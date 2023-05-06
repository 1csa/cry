import React, { memo, useState, useEffect } from 'react';
import produce from 'immer';

import { Button, Tag, Drawer, Popover } from 'antd';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import Icon from '@/components/Dumb/Iconfont';
import AuditOperationBasicPanel from '@/components/Smart/AuditOperationPanel';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';
import { compatibleSensitiveWords } from '@/components/Smart/MediaContentMainPanel/utils';
// import { parseDescription } from '@/components/BusinessLogic/machineResult';

import { isJSON } from '@/utils/dev_helper';
import { dailyPushAuditData } from '@/data/constants';

import { getApolloSetting } from '@/services/apolloSetting';

import './DailyPushPanel.less';

type SensCatType = { type: string; word: string; wordRemark: string };
type ListCatType = {
  type: string;
  // word: string;
  // wordRemark: string;
  list: Array<{ word: string; wordRemark: string }>;
};

interface DailyPushPanelProps {
  data: any;
  reloadCallBack: () => void;
  isPreview: boolean; // 预览 不展示操作面板 | 非预览 可以操作审核(提交/无效反馈)
}

const DailyPushPanel: React.FC<DailyPushPanelProps> = ({ data, reloadCallBack, isPreview }) => {
  const { material, machine_result, business_type, business_id, business_unit_type, business_unit_id, part_zone_cn } = data;
  const [frameUrl, setFrameUrl] = useState('');
  const [frameVisible, toggleFrameVisible] = useState(false);
  // 点击内容 | 关闭 iframe Drawer
  const handleClick = (url?: string, index?: number) => {
    toggleFrameVisible(!frameVisible);
    url && setFrameUrl(url);
    if (typeof index === 'number') {
      const info = produce(pushInfo, (draft: any) => {
        draft.content[index].status = 1;
      });
      setPushInfo(info);
    }
  };

  const [pushInfo, setPushInfo] = useState<any>({});
  // 初始化页面
  useEffect(() => {
    initData();
  }, [JSON.stringify(material)]);

  // 初始化数据
  const initData = () => {
    getApolloSetting().then(res => {
      try {
        const info = JSON.parse(JSON.stringify(material));
        info.extraInfo.features = isJSON(material?.extraInfo?.features) ? JSON.parse(material?.extraInfo?.features) : {};
        const titleSensitive = formatItemData(info.extraInfo?.features?.daily_topic?.title, res, machine_result?.sensitive?.title?.words ?? []);
        const summarySensitive = formatItemData(info.extraInfo?.features?.daily_topic?.summary, res, machine_result?.sensitive?.summary?.words ?? []);

        const contentTitleDefineCategory: any = [];
        info.content = isJSON(info.content)
          ? JSON.parse(info.content).map((item: any, index: number) => {
              const contentTitleSensitive = formatItemData(item.title, res, machine_result?.sensitive?.context?.textHidWord[index]?.words ?? []);
              contentTitleDefineCategory.push(...contentTitleSensitive?.defineCategory);
              return { ...item, status: 0, contentTitleSensitive };
            })
          : [];

        const defineCategory: ListCatType[] = [];
        [...titleSensitive.defineCategory, ...summarySensitive.defineCategory, ...contentTitleDefineCategory].forEach(item => {
          if (!item) return;
          const { type, word, wordRemark } = item;
          const listItem = { word, wordRemark };
          const index = defineCategory.findIndex(_item => _item.type === type);
          if (index === -1) {
            defineCategory.push({
              type,
              list: [listItem],
            });
          } else {
            defineCategory[index].list.push(listItem);
          }
        });
        setPushInfo({ ...info, titleSensitive, summarySensitive, defineCategory });
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 是否全部已读
  const [status, setStatus] = useState<boolean>(false);
  // 判断内容是否已经全部已读
  useEffect(() => {
    const index = pushInfo?.content?.findIndex((item: any) => item.status === 0);
    const allRead = index === -1 ? true : false;
    setStatus(allRead);
  }, [JSON.stringify(pushInfo)]);

  // 获取html或者评论内容涉及到的 命中的需要 高亮的敏感词 以及敏感词的分类和鼠标划上去之后显示敏感词和备注信息
  const getMatchWords = (commentWords: any[], sensitiveHighlightList: string) => {
    const { matchWordsToHtml } = compatibleSensitiveWords(commentWords, JSON.parse(sensitiveHighlightList));
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
    return highlightHtml(matchWordsToHtml, content, 'title', {}).htmlText;
  };

  /**
   * 格式化数据 审核任务|历史列表 除审核结果的数据
   * @param text 当前文本数据
   * @param res  apolloSetting res
   * @param matchWords 敏感词数组
   * @returns object item
   */
  const formatItemData = (text: string, res: any, matchWords = []) => {
    const result: any = {
      // defineCategory: '', // 匹配结果
      // htmlText: '', // html 字符串
    };
    // 所有可能出现敏感词的部分
    const { matchWordsToHtml, category } = getMatchWords(matchWords, res.sensitiveHighlightList);
    if (matchWords.length > 0) {
      result.defineCategory = category;
      result.htmlText = highlighComment(matchWordsToHtml, text);
    } else {
      result.defineCategory = category;
      result.htmlText = text;
    }
    return result;
  };

  // 审核面板数据
  const auditOperationData = {
    material: data,
    reloadCallBack,
    isVideo: false,
    userReviewResult: data[`result_l${data.audit_level}`],
    templateName: 'ExposurePanel',
    jsonResTagDataSource: dailyPushAuditData,
    tagOptions: {
      business_type: [business_type || business_id],
      business_unit_type: [business_unit_type || business_unit_id],
    },
    btnGroupStatus: !status, // 全部已读-可以审核，否则不可以审核
  };

  // 重新加载 iframe 内容
  // iframe 的 reload 方法已失效
  const reloadIframe = () => {
    // @ts-ignore
    document.getElementById('iframe-topic-push').contentWindow.location.replace(frameUrl);
  };

  return (
    <div className="main-panel-card" id="daily-push-panel">
      <div className="main-panel-card-left">
        <div className="mb20 card">
          <div className="mb20 head">
            <span className="title-wrapper">
              <span className="title mr20 text-overflow">
                {/* {pushInfo?.extraInfo?.features?.daily_topic?.title} */}
                <span
                  dangerouslySetInnerHTML={{
                    __html: pushInfo?.titleSensitive?.htmlText,
                  }}
                />
              </span>
              <BasicCopyToClipboard data={pushInfo?.id} title="文章ID" renderChild={() => <Tag color="#4A90E2">{pushInfo?.id}</Tag>} />
              <Tag color="#4A90E2">{pushInfo?.category}</Tag>
              <span className="ml20 publish-time">发布于 {pushInfo?.attr?.time}</span>
            </span>
            <span>
              <Tag>{part_zone_cn}</Tag>
              <Tag>日报审核</Tag>
            </span>
          </div>
          <div className="text-justify mb10">
            {/* {pushInfo?.extraInfo?.features?.daily_topic?.summary} */}
            <span
              dangerouslySetInnerHTML={{
                __html: pushInfo?.summarySensitive?.htmlText,
              }}
            />
          </div>
          <div>
            {/* <span>{parseDescription(machine_result)}</span> */}
            <span>
              {Array.isArray(pushInfo?.defineCategory) &&
                pushInfo.defineCategory.map((val: ListCatType, index: number) => (
                  <Popover
                    key={index}
                    title="敏感词信息(词/备注)"
                    content={
                      <>
                        {Array.isArray(val.list) &&
                          val.list.map((item: any, index) => (
                            <div key={item?.type || index}>
                              <span>{item?.word}</span> / <span>{item?.wordRemark}</span>
                            </div>
                          ))}
                      </>
                    }
                  >
                    <Tag className="mb10">{val?.type}</Tag>
                  </Popover>
                ))}
            </span>
          </div>
        </div>
        <div className="list">
          {Array.isArray(pushInfo.content) &&
            pushInfo.content.map((item: any, index: number) => (
              <div className="item" key={index}>
                <span className="wrapper">
                  {item.status ? <Tag color="#87d068">已读</Tag> : <Tag color="#4A90E2">未读</Tag>}
                  <Tag color="#4A90E2">内容{index + 1}</Tag>
                  <span className="cp title" onClick={() => handleClick(item.url, index)}>
                    <span dangerouslySetInnerHTML={{ __html: item.contentTitleSensitive?.htmlText }} />
                  </span>
                </span>
                <BasicCopyToClipboard
                  title="标题"
                  data={item.title}
                  renderChild={() => (
                    <span className="icon-wrapper">
                      <Icon name="iconcopy1-copy" className="icon" />
                    </span>
                  )}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="main-panel-card-right">{!isPreview && <AuditOperationBasicPanel {...auditOperationData} />}</div>

      <Drawer
        visible={frameVisible}
        width="80%"
        title={
          <>
            <Button type="link" href={frameUrl} target="_blank">
              查看原文
            </Button>
            <Button type="link" onClick={reloadIframe}>
              <Icon name="iconreload1" className="icon" />
            </Button>
          </>
        }
        onClose={() => handleClick()}
      >
        <iframe src={frameUrl} allowFullScreen={true} name="iframe-topic-push" id="iframe-topic-push" />
      </Drawer>
    </div>
  );
};

export default memo(DailyPushPanel);
