/**
 * 图文 / 啫喱-图文 | 啫喱-群照片 照片墙审核
 */
import React, { useState, useEffect } from 'react';
import { useKeyPress, useDebounceFn } from 'ahooks';

import { Button, Tag, Image, Typography, Popover, Tooltip } from 'antd';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import { saveAuditRetUserReviewTags } from '@/components/BusinessLogic/common';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';
import { compatibleSensitiveWords } from '@/components/Smart/MediaContentMainPanel/utils';
import handleTaskSubmit from '@/components/Smart/AuditOperationPanel/handleTaskSubmit';
import ZenLyOperationPanel from '@/components/Smart/AuditOperationPanel/ZenLyPanel';
import { tagTypes } from '@/components/Smart/OperationButton';

import { fallback } from '@/data/constants';
import { isJSON } from '@/utils/dev_helper';
import { BtnGroupTypes } from '@/types';

import { getApolloSetting } from '@/services/apolloSetting';

import './index.less';

const { Text } = Typography;

// 敏感词
type SensCatType = { type: string; word: string; wordRemark: string };

const REJECT = 'reject';
const PASS = 'pass';

const auditResultStatus = {
  [REJECT]: 3002,
  [PASS]: 3001,
};

// 默认 审核状态
const defaltManualStatus = 3001;
// 默认 审核信息
const defaultManualResult = {
  status: defaltManualStatus,
  desc: 'pass',
  labels: [],
};

interface ZenlyPanelProps {
  data: any[];
  tagOptions: Record<tagTypes, number[]>;
  reloadCallBack: () => void;
}

const ZenLyPanel: React.FC<ZenlyPanelProps> = ({ data, tagOptions, reloadCallBack }) => {
  // format 一遍 data , 存储 新的打标结果
  const [list, setList] = useState<any>([]);

  /**
   * 将数据重新设置添加一些字段 重新返回
   * @param labelMap 接口返回的数据格式
   */
  const addAttrToVideoTagData = (labelMap: any) => {
    let newObj = {};
    for (const key in labelMap) {
      const element = labelMap[key];
      Object.assign(newObj, {
        [key]: composeInitTagGroup(element, key),
      });
    }
    return newObj;
  };

  // 从接口获取 tag 数据
  const handleMenuTags = async () => {
    const data: any = await saveAuditRetUserReviewTags({
      business_type: tagOptions.business_type,
      business_unit_type: tagOptions.business_unit_type,
    });
    const tagDataSourceMap: any = {
      [REJECT]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[REJECT])?.labelMap),
      [PASS]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[PASS])?.labelMap),
    };
    // console.log(tagDataSourceMap);
    setTagDataSource(tagDataSourceMap || {});
  };

  // Apollo Setting
  // 数据初始化
  useEffect(() => {
    handleMenuTags();
    getApolloSetting().then(res => {
      const formatList = data.map((item: any) => {
        const sensitiveInfo = formatItemData(item, res);
        const { audit_level = 1, business_id, business_unit_id, data_id, docid, part_zone } = item;

        // 初始 tag 标签信息 & 提交时需要此部分数据
        const tagInfo = {
          audit_level,
          business_id,
          business_unit_id,
          data_id,
          docid,
          part_zone,
          manual_result: JSON.stringify(defaultManualResult),
          manual_status: defaltManualStatus,
        };

        return {
          ...item,
          tagInfo,
          sensitiveInfo,
          visible: false,
        };
      });
      setList(formatList);
    });
  }, [data]);

  /**
   * 格式化数据
   * @param item 当前数据
   * @param res  apolloSetting res
   * @returns object item
   */
  const formatItemData = (item: any, res: any) => {
    // 所有可能出现敏感词的部分
    const contextWords = item?.machine_result?.sensitive?.context?.words ?? [];
    const { matchWordsToHtml, category } = getCommentWords(contextWords, res.sensitiveHighlightList);

    const result: any = {};
    if (contextWords.length > 0) {
      result.category = category;
      result.content = highlighComment(matchWordsToHtml, item?.material?.extraInfo?.textContent);
    }
    return result;
  };

  /**
   * 获取html或者评论内容涉及到的 命中的需要 高亮的敏感词 以及敏感词的分类和鼠标划上去之后显示敏感词和备注信息
   * @param textWords                 需要匹配的文字
   * @param sensitiveHighlightList    apollo 接口相应数据
   * @returns
   */
  const getCommentWords = (textWords: any[], sensitiveHighlightList: string) => {
    // console.log('apollo 接口 sensitiveHighlightList json', JSON.parse(sensitiveHighlightList));
    const { matchWordsToHtml } = compatibleSensitiveWords(textWords, JSON.parse(sensitiveHighlightList));
    // 处理敏感词分类、备注、以及命中敏感词在Tag中的展示
    // 先按照敏感词去重
    const words = [...new Set(matchWordsToHtml?.map(ele => ele?.word) || [])];
    let category: SensCatType[] = [];
    // 遍历当前敏感词 去 所有敏感词中找当前敏感词所对应的 分类以及备注
    for (let i = 0; i < words.length; i++) {
      const wv = words[i];
      for (let j = 0; j < matchWordsToHtml.length; j++) {
        const mv = matchWordsToHtml[j];
        if (mv?.word === wv) {
          // 如果已经存在 跳出本次循环
          const hasWord = category?.find(data => data?.word === wv);
          if (hasWord) {
            continue;
          } else {
            // 否则将数据插入
            category.push({
              type: `${mv?.cateOneName}/${mv?.cateTwoName}`,
              word: wv,
              wordRemark: mv?.wordRemark,
            });
          }
        }
      }
    }
    return { matchWordsToHtml, category };
  };

  // 返回高亮的敏感词 html的形式 需要render
  const highlighComment = (matchWordsToHtml: any[], content: string) => {
    // return highlightHtml(matchWordsToHtml, content, 'title', {}).htmlText;
    // TODO: 以下内容为临时方案 最终还是要上边的代码实现
    // console.log(matchWordsToHtml, content);
    const formatWords = matchWordsToHtml.map((item: any) => {
      const { text } = item;
      const length = text.length;
      const start = content.indexOf(text);
      return {
        ...item,
        start,
        end: start + length - 1,
      };
    });
    return highlightHtml(formatWords, content, 'title', {}).htmlText;
  };

  // 审核标签
  const [tagDataSource, setTagDataSource] = useState<Object>({});

  const composeInitTagGroup = (sourceTag: Array<Partial<BtnGroupTypes>>, group?: string) => {
    const newState = Array.isArray(sourceTag) ? sourceTag.slice() : [];
    newState.forEach((item: Partial<BtnGroupTypes>) => {
      item.type = 'default';
      item.disabled = false;
      item.danger = false;
      item.group = group || '';
    });
    return newState;
  };

  /**
   * 将提交函数放在防抖中
   */
  const { run } = useDebounceFn(() => handleExposureSubmit(), {
    wait: 400,
  });

  // 提交
  const handleExposureSubmit = () => {
    const requestData = list.map((item: any) => item.tagInfo);
    handleTaskSubmit(requestData, false, reloadCallBack);
  };

  /**
   * 曝光图文和视频 快捷键 提交标签按钮
   */
  useKeyPress('ctrl.enter', () => {
    run();
  });

  /**
   * 每项打标 回调
   * @param result 打标结果
   * @param index 当前数据脚标
   */
  const addTagCallback = (result: any, index: number) => {
    // 数据是否发生变化
    const status = list[index].tagInfo.manual_result === result.manual_result;
    list[index].tagInfo = result;
    if (!status) {
      list[index].visible = false;
    }
    setList([...list]);
  };

  // popover visible
  const handleVisibleChange = (visible: boolean, index: number) => {
    list[index].visible = visible;
    setList([...list]);
  };

  return (
    <div className="zenly-card">
      <div className="zenly-wrapper">
        {Array.isArray(list)
          ? list.map((item: any, key: number) => {
              const {
                material: { id, attr = {}, media = {}, extraInfo = {}, images },
                tagInfo = {},
                visible,
              } = item;
              const { time } = attr;
              const { mediaId, mediaName } = media;
              const { textContent } = extraInfo;
              const { manual_status = 0, manual_result } = tagInfo;
              const labels = isJSON(manual_result) ? JSON.parse(manual_result)?.labels : [];
              const tags = labels.map((labelItem: any) => labelItem.label);
              return (
                <div className="zenly-item-wrapper" key={key}>
                  <div className="zenly-item">
                    <div className="top">
                      <div className="id-info">
                        <BasicCopyToClipboard data={id} title="docid" renderChild={() => <Tag className="cp">docid: {id}</Tag>} />
                        <BasicCopyToClipboard data={mediaId} title="uid" renderChild={() => <Tag className="cp">uid: {mediaId}</Tag>} />
                      </div>
                      <div className="author-info">
                        <Tooltip title={mediaName} placement="topLeft">
                          <span className="author text-overflow">{mediaName}</span>
                        </Tooltip>
                        <span className="publish-time">发布于：{time}</span>
                      </div>
                    </div>

                    <div className="middle">
                      <Tooltip title={textContent} placement="topLeft">
                        <div
                          className="text"
                          dangerouslySetInnerHTML={{
                            __html: item.sensitiveInfo?.content ?? textContent,
                          }}
                        />
                      </Tooltip>
                      <div className="imgs-wrapper">
                        {Array.isArray(images)
                          ? [images[0]].map((item: any, key: number) => (
                              <div className="image-wrapper flex" key={key}>
                                <Popover
                                  placement="left"
                                  overlayStyle={{ width: 480 }}
                                  arrowPointAtCenter
                                  content={<Image width="100%" src={item.url ?? 'error'} fallback={fallback} preview={false} />}
                                >
                                  <Image height="100%" src={item.url ?? 'error'} fallback={fallback} />
                                </Popover>
                              </div>
                            ))
                          : null}
                      </div>
                      <div className="text-right">
                        <Popover
                          placement="left"
                          trigger="click"
                          arrowPointAtCenter
                          overlayInnerStyle={{ width: 400 }}
                          visible={visible}
                          onVisibleChange={(newStatus: boolean) => handleVisibleChange(newStatus, key)}
                          content={
                            <ZenLyOperationPanel
                              data={item}
                              tagDataSource={tagDataSource}
                              addTagCallback={(result: any) => addTagCallback(result, key)}
                            />
                          }
                        >
                          <Button type="primary" size="small" className="mt10">
                            操作
                          </Button>
                        </Popover>
                      </div>
                    </div>

                    <div className="bottom">
                      <div className="sensitive">
                        {Array.isArray(item?.sensitiveInfo?.category)
                          ? item.sensitiveInfo.category.map((val: SensCatType, index: number) => (
                              <Popover
                                key={index}
                                title="敏感词信息(词/备注)"
                                content={
                                  <span>
                                    <span>{val?.word}</span> / <span>{val?.wordRemark}</span>
                                  </span>
                                }
                              >
                                <Tag>{val?.type}</Tag>
                              </Popover>
                            ))
                          : null}
                      </div>
                      <div className="text-center">
                        {manual_status === 3001 && tags.length ? <Text type="success">通过-{tags.join('、')}</Text> : null}
                        {manual_status === 3002 && tags.length ? (
                          <Text type="danger">
                            驳回-{labels[0].label}
                            {labels[0].code === 'other' ? <span style={{ fontSize: 12 }}>({labels[0].desc})</span> : null}
                          </Text>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="submit-wrapper">
        <Button type="primary" size="large" onClick={run}>
          提交 <span className="key-code">(CRTL + ENTER)</span>
        </Button>
      </div>
    </div>
  );
};

export default ZenLyPanel;
