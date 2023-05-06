/**
 * 啫喱素材模板 套用评论模板
 */
import React, { useState, useEffect } from 'react';
import produce from 'immer';

import { Card, Button, Tag, Modal, Drawer, Popover, Empty, Image, message } from 'antd';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import Iconfont from '@/components/Dumb/Iconfont';
import OperationButton, { AuditLabel, tagTypes, InitTagsType, ResultTags, resultTags } from '@/components/Smart/OperationButton';
import ReviewLogModal from '@/components/Smart/ReviewLog';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';
import { compatibleSensitiveWords } from '@/components/Smart/MediaContentMainPanel/utils';
import { parseDescription } from '@/components/BusinessLogic/machineResult';

import { getApolloSetting } from '@/services/apolloSetting';
// import { fetchAuditResultMenuTags as fetchLabelConfigFromApi } from '@/services/commonServices';
import { fetchLabelConfigFromApi } from '@/services/commonServices';

import handleTaskSubmit from './handleTaskSubmit';
import { BtnGroupTypes } from '@/types';
import { formateTime, getCookie, isJSON } from '@/utils/dev_helper';
import { reviewStatus, fallback } from '@/data/constants';

import './index.less';

type SensCatType = { type: string; word: string; wordRemark: string };

type MediaType = {
  id: string;
  url: string;
  coverUrl?: string;
};

export interface ICommentPanelProps {
  commentInfo: any[];
  tagOptions: Record<tagTypes, number[]>;
  reloadCallBack?: () => void;
}

const MaterialPanel: React.FC<ICommentPanelProps> = ({ commentInfo, tagOptions, reloadCallBack }) => {
  const isHis = location.pathname.includes('pictureArticleReview/historicalContentList');

  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [drawerUrl, setDrawerUrl] = useState<string>();
  const [visibleVideoModal, setVisibleVideoModal] = useState<boolean>(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>();
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [currentDataId, setCurrentDataId] = useState<string>('');
  const [newCommentInfo, setNewCommentInfo] = useState<any[]>(commentInfo); // 列表数据
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false);

  // 点击视频封面图开始弹窗播放视频
  const handleVideoPaly = (url: string) => {
    setCurrentVideoUrl(url);
    setVisibleVideoModal(true);
  };

  // 打开历史弹窗
  const handleHisModal = (dataid: string) => {
    setCurrentDataId(dataid);
    setLogVisible(true);
  };

  /**
   * 解析历史
   * @param stages 人审阶段
   * @param manualStatus 人审结果数值
   * @param tmmanul 机审审核时间
   * @returns
   */
  const renderUserResult = (stages: any[], manualStatus?: number, tmmanul?: number) => {
    // console.log('renderUserResult', stages, manualStatus, tmmanul);
    const tagColor = {
      3101: '#46BC15',
      3001: '#46BC15',
      3102: '#FF3000',
      3002: '#FF3000',
    };
    if (Array.isArray(stages) && stages.length > 0) {
      // 解析人审结果
      // const len = stages.length;
      // const lastItem = stages[len - 1];

      return stages.map((item: any, index: number) => {
        const labels = isJSON(item.result) ? JSON.parse(item.result)?.labels ?? [] : [];
        const labelsResult = labels.map((labelsItem: any) => {
          const result = labelsItem.labels.map((label: any) => {
            return `${label.label}${label.desc ? '-' : ''}${label.desc ?? ''}`;
          });
          return result;
        });
        const manualLabels = labelsResult.length ? `(${labelsResult.join('、')})` : '';
        return (
          <span key={index} style={{ display: 'block', marginBottom: 5 }}>
            <Tag color={tagColor[item.status]}>
              {reviewStatus(item.status)}
              {manualLabels}
            </Tag>
            <span>{item.auditor || ''} </span>
            <span>{item.commitTime ? formateTime(item.commitTime) : ''}</span>
          </span>
        );
      });

      // return (
      //   <>
      //     <Tag color={tagColor[lastItem.status]}>{reviewStatus(lastItem.status)}—-</Tag>
      //     <span>{lastItem.auditor || ''} </span>
      //     <span>{lastItem.commitTime ? formateTime(lastItem.commitTime) : ''}</span>
      //   </>
      // );
    } else {
      // 解析机审结果信息
      if (manualStatus && tmmanul) {
        return (
          <>
            <Tag color={tagColor[manualStatus]}>{reviewStatus(manualStatus)}**</Tag>
            <span>{formateTime(tmmanul)}</span>
          </>
        );
      } else {
        return null;
      }
    }
  };

  // 每点击一次标签 更新一次数据 在提交的时候获取标签
  const handleCommentUserTagResult = (result: { [K: string]: AuditLabel[] }, index: number) => {
    const { cancelCheckbox, cancelRadio } = result;
    let newState = [];

    // 扩展属性而已
    if (cancelCheckbox) {
      // @ts-ignore
      newState = produce(newCommentInfo, draft => {
        // 这个字段需要提交的是filter然后给接口
        draft[index].cancelCheckbox = cancelCheckbox;
        // 这个字段是用来更新按钮状态的 按钮的状态 由这里控制
        if (draft[index].opResult && Object.keys(draft[index].opResult).length > 0) {
          // 有字段扩展
          draft[index].opResult = {
            ...draft[index].opResult,
            cancelCheckbox: cancelCheckbox[0].labels?.map(val => val.code),
          };
        } else {
          // 无字段 新增
          draft[index].opResult = {
            cancelCheckbox: cancelCheckbox[0].labels?.map(val => val.code),
          };
        }
      });
    }
    if (cancelRadio) {
      // @ts-ignore
      newState = produce(newCommentInfo, draft => {
        draft[index].cancelRadio = cancelRadio;
        // 人审打标
        if (draft[index].opResult && Object.keys(draft[index].opResult).length) {
          // 单选可取消 只有当返沪的cancelRadio[0].labels === []的是会取消掉单选
          if (cancelRadio[0].cancelable) {
            // 为按钮设置数据选中
            draft[index].opResult = {
              ...draft[index].opResult,
              cancelRadio: cancelRadio[0].labels?.map(val => val.code),
            };
          } else {
            draft[index].opResult = {
              ...draft[index].opResult,
              notCancelRadio: cancelRadio[0].labels?.map(val => val.code),
            };
          }
        } else {
          if (cancelRadio[0].cancelable) {
            draft[index].opResult = {
              cancelRadio: cancelRadio[0].labels?.map(val => val.code),
            };
          } else {
            draft[index].opResult = {
              notCancelRadio: cancelRadio[0].labels?.map(val => val.code),
            };
          }
        }
      });
    }
    setNewCommentInfo([...newState]);
  };

  // 公共的提交方法，历史和审核，区别就是历史是单条数据
  const handelCommit = (arrInfo: any[], needReload?: boolean, index?: number) => {
    setSubmitButtonLoading(true);
    const manualResults = arrInfo?.map((ele: any) => {
      // 获取到之前扩展的数据
      const mr = [
        // @ts-ignore
        ...(ele?.cancelCheckbox || []),
        ...(ele?.cancelRadio || []),
        ...(ele?.notCancelRadio || []),
      ];

      // 写状态 审核结果是按照是否有驳回并且下边的labels长度来决定的
      const [desc, code] =
        mr?.filter(item => {
          return item?.groupCn === '驳回' && item?.labels?.length > 0;
        })?.length > 0
          ? ['not-pass', 3002]
          : ['pass', 3001];

      // 返回包装的参数
      return submitTaskParamsInAuditOperation(ele, code, desc, mr);
    });

    const hasEmptyItem = manualResults?.some((item: any) => JSON.parse(item?.manual_result)?.labels.length === 0);

    // console.log(manualResults);

    const existOtherEmpty = manualResults?.some((item: any) => {
      const labels = JSON.parse(item?.manual_result)?.labels[0]?.labels || [];
      const result = labels.some((_item: any) => _item.code === 'else' && !_item.desc) || false;
      return result;
    });

    if (existOtherEmpty) {
      message.warning('其他理由输入不可以为空！请仔细确认');
      setSubmitButtonLoading(false);
      return;
    }

    const submitTask = () => {
      // 成功失败之后都需要关掉按钮的loading
      handleTaskSubmit(
        manualResults,
        isHis,
        needReload
          ? () => {
              setSubmitButtonLoading(false);
              reloadCallBack && reloadCallBack();
            }
          : () => {
              if (isHis && typeof index === 'number') {
                // 历史提交之后重新关掉编辑按钮以及更新数据
                const newState = produce(newCommentInfo, draft => {
                  draft[index].disabledTags = true;
                  // 这是为了显示审核状态立马生效 给对对象下扩展的临时属性
                  draft[index].stages = [
                    {
                      auditor: decodeURIComponent(getCookie('nickname')),
                      status: manualResults[0].manual_status,
                      commitTime: +new Date(),
                    },
                  ];
                });
                setNewCommentInfo([...newState]);
              }
              setSubmitButtonLoading(false);
            },
        () => {
          setSubmitButtonLoading(false);
        },
        () => {
          setSubmitButtonLoading(false);
        },
      );
    };

    // 过滤出来的数据中有没打标签的提示一下
    if (hasEmptyItem) {
      Modal.confirm({
        title: '请注意',
        content: '未选择标签的内容将按审核通过（无问题）处理',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          submitTask();
        },
        onCancel: () => {
          setSubmitButtonLoading(false);
        },
      });
      return false;
    }

    submitTask();
  };

  // 点击本页提交的时候 获取所有页面中结果
  const handleAllComment = () => {
    // 这个index随便给的 反正要判断isHis
    handelCommit(newCommentInfo.slice(), true);
  };

  // 单个修改提交
  const handleItemEdit = (item: any, index: number) => {
    handelCommit([item], false, index);
  };

  // 编辑按钮
  const handleEditTags = (index: number, status: boolean) => {
    let newState = [];
    // 编辑的时候改变状态
    if (status) {
      // 获取之前的结果
      // 如果是取消的话，把之前的数据重新恢复
      const resetBtnStatus = (draft: any[], key: string) => {
        const currentItem = draft[index]?.initTags[key];
        return Array.isArray(currentItem) ? currentItem[0]?.labels?.map((val: Partial<BtnGroupTypes>) => val.code) : [];
      };
      // initTags字段里把之前的结果存下来了，后来重新设置
      newState = produce(newCommentInfo, draft => {
        draft[index] = { ...draft[index], ...(draft[index]?.initTags || {}) };
        draft[index].opResult = {
          // 恢复数据
          cancelRadio: resetBtnStatus(draft, 'cancelRadio'),
          cancelCheckbox: resetBtnStatus(draft, 'cancelCheckbox'),
          notCancelRadio: resetBtnStatus(draft, 'notCancelRadio'),
        };
      });
    }
    // 关掉编辑
    newState = produce(newState?.length > 0 ? newState : newCommentInfo, draft => {
      draft[index].disabledTags = status;
    });

    setNewCommentInfo(newState);
  };

  const handleDrawerInfo = (url: string, status: boolean) => {
    setVisibleDrawer(status);
    setDrawerUrl(url);
  };

  // 初始化 审核操作面板的 labels
  const initConfigLabel = () => {
    if (Array.isArray(commentInfo) && !commentInfo?.length) {
      setNewCommentInfo([]);
      return false;
    }
    fetchLabels();
  };

  // 接口获取标签 然后处理 页面数据
  const fetchLabels = () => {
    fetchLabelConfigFromApi(tagOptions)
      .then(res => {
        const { errorno, data } = res;
        if (errorno === 0) {
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item?.code === 3001) {
              initNewLabels(item?.labelTree);
              break;
            }
          }
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  // 整合数据 任务|历史
  // 1. 通过 Apollo 接口处理敏感数据
  // 2. 处理操作面板数据
  const initNewLabels = (auditLabels: AuditLabel[]) => {
    // 拿一份新的数据
    const newData = JSON.parse(JSON.stringify(commentInfo));

    // 取敏感词配置 可以写在一个forEach里 但是每次都要判断是不是历史
    getApolloSetting().then(res => {
      if (isHis) {
        newData.forEach((itemData: any) => {
          const item = formatItemData(itemData, res);

          // 这块处理高亮数据的回显示 处理结果标签
          const result = item[`result_l${item?.audit_level}`];

          const { opResult, cancelRadio, cancelCheckbox, notCancelRadio } = getTags(result);
          item.disabledTags = true;
          // 不打标签和打了用户的标签都是通过 无问题又必须是 没打标签的时候才展示
          if (result?.status === 3001) {
            if (result?.labels?.length === 0) {
              // 这是当前的所有标签
              item.auditLabels = auditLabels;
              // 当前选中高亮
              item.opResult = {};
              // item.cancelRadio = cancelRadio;
              item.initTags = {
                cancelRadio: [],
                cancelCheckbox: [],
                notCancelRadio: [],
              };
            } else {
              // 打了标签就显示打的标签 多个标签
              item.auditLabels = auditLabels;
              // 这里需要处理一下打过的标签数据
              // 要做一个 单选可以取消的标签 多选可以取消的标签 单选无法取消的标签的判断再把数据传递下去
              // 配置多选的话一定是可以取消的

              // 高亮
              item.opResult = opResult;
              // 设置各种按钮的数据，防止修改提交的时候拿不到数据
              item.cancelRadio = cancelRadio;
              item.cancelCheckbox = cancelCheckbox;
              item.notCancelRadio = notCancelRadio;
              item.initTags = {
                cancelRadio,
                cancelCheckbox,
                notCancelRadio,
              };
            }
          } else {
            // 打了标签就显示打的标签 多个标签
            // item.auditLabels = auditLabels;

            // 初始化 其他 标签时需要处理自定义展示内容
            const elseFlag = 'else';
            const existElse = opResult?.cancelRadio?.includes(elseFlag);

            if (existElse) {
              // @ts-ignore
              const [
                {
                  labels: [{ desc = '' }],
                },
              ] = cancelRadio;
              const newAuditLabels = JSON.parse(JSON.stringify(auditLabels));
              item.auditLabels = newAuditLabels.map((item: any) => {
                if (item.group === 'reject') {
                  item.labels.forEach((_item: any) => {
                    if (_item.code === elseFlag) {
                      _item.desc = desc;
                    }
                  });
                }
                return item;
              });
            } else {
              item.auditLabels = auditLabels;
            }

            // 这里需要处理一下打过的标签数据
            // 要做一个 单选可以取消的标签 多选可以取消的标签 单选无法取消的标签的判断再把数据传递下去
            // 配置多选的话一定是可以取消的

            // 高亮
            item.opResult = opResult;
            // 设置各种按钮的数据，防止修改提交的时候拿不到数据
            item.cancelRadio = cancelRadio;
            item.cancelCheckbox = cancelCheckbox;
            item.notCancelRadio = notCancelRadio;
            item.initTags = {
              cancelRadio,
              cancelCheckbox,
              notCancelRadio,
            };
          }
        });
      } else {
        newData.forEach((itemData: any) => {
          const item = formatItemData(itemData, res);
          item.disabledTags = false;
          item.auditLabels = auditLabels;
        });
      }
      // 初始化
      setNewCommentInfo([...newData]);
    });
  };

  /**
   * 格式化数据 审核任务|历史列表 除审核结果的数据
   * @param item 当前数据
   * @param res  apolloSetting res
   * @returns object item
   */
  const formatItemData = (item: any, res: any) => {
    // 所有可能出现敏感词的部分
    const titleWords = item?.machine_result?.sensitive?.title?.words ?? [];
    const contentWords = item?.machine_result?.sensitive?.context?.words ?? [];
    // 高亮短文本内容
    if (titleWords.length || contentWords.length) {
      const { category } = getCommentWords([...titleWords, ...contentWords], res.sensitiveHighlightList);
      item.category = category;
      if (titleWords.length) {
        const { matchWordsToHtml } = getCommentWords(titleWords, res.sensitiveHighlightList);
        item.material.title = highlighComment(matchWordsToHtml, item?.material?.title);
      }
      if (contentWords.length) {
        const { matchWordsToHtml } = getCommentWords(contentWords, res.sensitiveHighlightList);
        item.material.content = highlighComment(matchWordsToHtml, item?.material?.content);
      }
    }
    return item;
  };

  // 短文本历史列表  初始化操作面板 按钮状态
  const getTags = (result: InitTagsType<AuditLabel[]>) => {
    let opResult: Partial<ResultTags> = {};
    let initTag: Partial<Record<resultTags, AuditLabel[]>> = {};

    // 判断类型，初始化在数据下插入标签，后来提交的时候需要
    result?.labels?.forEach(ele => {
      if (ele?.inputType === 'checkbox') {
        // 这是提交数据的时候需要
        Object.assign(initTag, {
          cancelCheckbox: ele?.labels.length > 0 ? [ele] : undefined,
        });
        // 这是高亮按钮标记 opResult 控制按钮的显示 着色
        Object.assign(opResult, { cancelCheckbox: ele?.labels?.map(val => val?.code) });
      } else if (ele?.inputType === 'radio') {
        if (ele?.cancelable === true) {
          Object.assign(initTag, {
            cancelRadio: ele?.labels.length > 0 ? [ele] : undefined,
          });
          Object.assign(opResult, { cancelRadio: ele?.labels?.map(val => val?.code) });
        } else {
          Object.assign(initTag, {
            notCancelRadio: ele?.labels.length > 0 ? [ele] : undefined,
          });
          Object.assign(opResult, { notCancelRadio: ele?.labels?.map(val => val?.code) });
        }
      }
    });
    return { opResult, ...initTag };
  };

  /**
   * 获取html或者短文本内容涉及到的 命中的需要 高亮的敏感词 以及敏感词的分类和鼠标划上去之后显示敏感词和备注信息
   * @param commentWords              需要匹配的文字
   * @param sensitiveHighlightList    apollo 接口相应数据
   * @returns
   */
  const getCommentWords = (commentWords: any[], sensitiveHighlightList: string) => {
    // console.log('apollo 接口 sensitiveHighlightList json', JSON.parse(sensitiveHighlightList));
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

  // 页面初始化
  useEffect(() => {
    initConfigLabel();
  }, [JSON.stringify(commentInfo)]);

  const titleInfo = (article: any, cmtid: string, part_zone_cn: string, dataId: string) => (
    <div className="jcsb mb20">
      <div className="title">
        {/* {article?.circle?.name && <Tag color="#4A90E2">{article.circle.name}</Tag>}
        {!isDynamic
          ? article?.id && (
              <BasicCopyToClipboard
                data={article.id}
                title={`${isGroup ? '群聊' : '文章'}ID`}
                renderChild={() => (
                  <Tag color="#4A90E2" className="cp">
                    {article.id}
                  </Tag>
                )}
              />
            )
          : null}
        {!groupDynamic ? (
          <span
            style={{ color: '#4A90E2' }}
            className="cp"
            onClick={() => {
              handleDrawerInfo(article?.outerUrl, true);
            }}
          >
            {article?.title || `[原帖无标题]`}
          </span>
        ) : null} */}
      </div>
      <div className="tags">
        <BasicCopyToClipboard data={cmtid} title="素材ID" renderChild={() => <Tag className="cp">ID：{cmtid}</Tag>} />
        {part_zone_cn && <Tag>{part_zone_cn}</Tag>}
        <Tag className="cp" onClick={() => handleHisModal(dataId)}>
          审核历史
        </Tag>
      </div>
    </div>
  );

  const userInfo = (info: any, publishTime: number, hasAvatar: boolean = true) => {
    return (
      <div className="user-info-panel flex-box mb20">
        {hasAvatar && <Image className="avatar mr10" src={info?.userHeadImageUrl || ''} preview={false} />}
        <div className="user-info">
          <div className="name">
            {info?.userNick}
            <BasicCopyToClipboard data={info?.id ?? ''} title="用户ID" renderChild={() => <span className="cp">({info?.id ?? ''})</span>} />
          </div>
          {/* <div className="second-info">货运司机</div> */}
          <div className="second-info">
            发布于 <span>{publishTime ? formateTime(publishTime) : ''}</span>
            {/* / <span>IP：223.114.194.48</span> /
            <span>中国 新疆 石河子</span> <span>移动</span> */}
          </div>
        </div>
      </div>
    );
  };

  const commentContentPanel = (
    images: MediaType[] = [],
    videos: MediaType[] = [],
    // commentContent: any,
    title: string,
    content: string,
    hasMarLeft: boolean = true,
    // machineResult: any,
  ) => {
    return (
      <div className={`${hasMarLeft ? 'ml74' : ''} material-panel`}>
        <p className="warp-text text">
          名称：
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </p>
        <p className="warp-text text">
          理念：
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </p>
        {Array.isArray(images) && images.length > 0 && (
          <div className="img-box">
            {images?.map(ele => {
              return (
                <div className="zenly-material-image-wrapper mr10 mb10" key={ele?.id}>
                  <Popover
                    placement="right"
                    content={
                      <Image
                        src={ele?.url}
                        fallback={fallback}
                        preview={false}
                        style={{ width: 500, height: 500, objectFit: 'contain' }}
                        alt="文章图片信息"
                      />
                    }
                    title="图片预览"
                  >
                    <Image src={ele?.url ?? 'error'} fallback={fallback} className="material-img obf" />
                  </Popover>
                </div>
              );
            })}
          </div>
        )}
        {Array.isArray(videos) && videos.length > 0 && (
          <>
            {videos?.map((ele, idx) => (
              <div key={ele.id} style={{ position: 'relative' }} className="mb20 cp video-poster-size" onClick={() => handleVideoPaly(ele?.url)}>
                <div className="video-mask video-poster-size">
                  <Iconfont name="iconbofang" />
                </div>
                <img className="obf video-poster-size" src={ele?.coverUrl} alt="视频封面图" />
              </div>
            ))}
          </>
        )}
        {/* {commentContent && commentContent?.id && (
          <div className="comment-border mb20">
            {userInfo(commentContent?.customerAttribute, commentContent?.publishTime, false)}
            {commentContentPanel(
              commentContent?.images,
              commentContent?.videos,
              commentContent?.parentComment,
              commentContent?.content,
              false,
              machineResult,
            )}
          </div>
        )} */}
      </div>
    );
  };

  return (
    <div className="comment-panel">
      {!newCommentInfo.length ? (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        newCommentInfo?.map((ele: any, index: number) => {
          return (
            <div key={index} className="mb20" style={{ display: 'flex' }}>
              <Card className="info" style={{ marginBottom: 0 }}>
                {titleInfo(ele?.material?.article, ele?.material?.id, ele?.part_zone_cn, ele?.data_id)}
                {userInfo(ele?.material?.customerAttribute, ele?.material?.publishTime)}
                {commentContentPanel(
                  ele?.material?.images ?? [],
                  ele?.material?.videos ?? [],
                  // ele?.material?.parentComment,
                  ele?.material?.title,
                  ele?.material?.content,
                  true,
                  // ele?.machine_result,
                )}
                <p className="ml74">
                  <span>{parseDescription(ele?.machine_result)}</span>
                  <span>
                    {ele?.category &&
                      ele?.category?.map((val: SensCatType, index: number) => (
                        <Popover
                          key={index}
                          title="敏感词信息(词/备注)"
                          content={
                            <span>
                              <span>{val?.word}</span> / <span>{val?.wordRemark}</span>
                            </span>
                          }
                        >
                          <Tag className="mb10">{val?.type}</Tag>
                        </Popover>
                      ))}
                  </span>
                </p>
                <p className="ml74">{renderUserResult(ele?.stages, ele?.manual_status, ele?.tmmanul)}</p>
                {/* {Array.isArray(ele?.stages) && ele?.stages?.length > 0 && (
                )} */}
              </Card>
              <Card className="operation-panel">
                <p className="jcsb title-modify">
                  <span>审核操作</span>
                  {/* {isHis && (
                    <>
                      {ele?.disabledTags ? (
                        <span className="cp" onClick={() => handleEditTags(index, false)}>
                          编辑
                        </span>
                      ) : (
                        <span className="tags-reset jcsb">
                          <Button type="text" loading={submitButtonLoading} className="cp" onClick={() => handleItemEdit(ele, index)}>
                            提交
                          </Button>
                          <Button type="text" className="cp" onClick={() => handleEditTags(index, true)}>
                            取消
                          </Button>
                        </span>
                      )}
                    </>
                  )} */}
                </p>
                <OperationButton
                  // tagOptions={tagOptions}
                  isVideo={false}
                  handleUserTag={(result: { [K: string]: AuditLabel[] }) => handleCommentUserTagResult(result, index)}
                  auditLabels={ele?.auditLabels}
                  disabled={ele?.disabledTags}
                  initInfo={{
                    tag: ele[`result_l${ele?.audit_level}`] || {},
                    result: ele?.opResult,
                  }}
                  // initTags={ele[`result_l${ele?.audit_level}`] || {}}
                  // initResult={ele?.opResult}
                />
              </Card>
            </div>
          );
        })
      )}
      {isHis ? null : (
        <div className="do-operation">
          <Button loading={submitButtonLoading} name="短文本审核-本页提交" type="primary" onClick={handleAllComment}>
            本页提交
          </Button>
        </div>
      )}
      <Drawer title="预览" placement="right" width={1200} closable={false} onClose={() => handleDrawerInfo('', false)} visible={visibleDrawer}>
        <iframe src={drawerUrl} id="ifr-article" name="ifr-article" allowFullScreen={true} />
      </Drawer>
      <Modal
        title="视频播放"
        visible={visibleVideoModal}
        destroyOnClose
        // onOk={handleModalOk}
        onCancel={() => {
          let videoDom = document?.querySelector('.modal-video');
          // @ts-ignore
          videoDom && videoDom?.pause && videoDom?.pause();
          setVisibleVideoModal(false);
        }}
        footer={null}
        bodyStyle={{ overflow: 'auto', padding: 0 }}
        centered
        width="800"
      >
        <video className="modal-video" controls src={currentVideoUrl}>
          <source src={currentVideoUrl} type="video/mp4" />
          您的浏览器不支持 HTML5 video 标签。
        </video>
      </Modal>
      <ReviewLogModal visible={logVisible} onCancelCallBack={value => setLogVisible(value)} taskId={currentDataId} />
    </div>
  );
};

export default MaterialPanel;
