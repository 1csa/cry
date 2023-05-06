import React, { useState, useEffect } from 'react';
import { message } from 'antd';

import MediaContentTitlePanel from '@/components/Dumb/MediaContentTitlePanel';
import { similarVideosArrayType } from '@/components/Dumb/SimilarVideos';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';
import handleNewVideoUrl from '@/components/BusinessLogic/fetchNewVideoUrl';

import NianHuaMarkPanel from '@/components/Smart/AuditOperationPanel/NianHuaMarkPanel';

import MediaInfo, { PictureType } from '../MediaInfo';
import VideoPanel from '../VideoPanel';

import { getApolloSetting } from '@/services/apolloSetting';
import { get, currentRoutePath } from '@/utils/dev_helper';
import { ComposeWordsType, IMatchWordsToHtml } from '@/types';
import { CreateMediaInfoContext } from '@/context';
import { videoType } from '@/data/constants';
import { compatibleSensitiveWords } from './utils';

import './index.less';

type ImageRisk = {
  sims: { score: number; src: string; tag: string }[];
  url: string;
};

type ImageTypes = 'caption' | 'id' | 'url';
export interface IsvgSize {
  width: number;
  height: number;
}
export interface IPhotoSensitive {
  coordinate: {
    x: number;
    y: number;
  };
  stroke: string;
  text: string;
  lineHeight: number;
  lineWidth: number;
}

const IMAGE_DOMAIN: string = 'http://i1.go2yd.com/image.php';
const reverseColumn = ['imageQuality/marking', 'videoQuality/marking'];

interface IMCMPProps {
  logModalCallBack: (status: boolean) => void;
  reloadCallBack: () => void;
  reviewArticleInfo: any;
  templateName: string;
  isPreview: boolean; // 是否是预览 预览的话直接不需要操作的
}

const NianHuaPanel: React.FC<IMCMPProps> = ({ logModalCallBack, reloadCallBack, reviewArticleInfo, templateName, isPreview }) => {
  const {
    machine_result,
    material,
    business_unit_type,
    business_unit_id,
    business_id,
    business_type,
    audit_level,
    docid,
    material_type,
  } = reviewArticleInfo;

  const [anchorCount, setAnchorCount] = useState<{ [K: string]: number }>({});
  const [sensitiveGroup, setSensitiveGroup] = useState<ComposeWordsType[]>([]); // 用于在右侧展示按钮组来点击的
  const [matchArticleWordsList, setMatchArticleWordsList] = useState<IMatchWordsToHtml[]>([]); // 正文的敏感词
  const [matchTitleWordsList, setMatchTitleWordsList] = useState<IMatchWordsToHtml[]>([]); // 标题的敏感词
  const [matchSubTitleWordsList, setMatchSubTitleWordsList] = useState<IMatchWordsToHtml[]>([]); // 副标题的敏感词
  const [matchSummaryWordsList, setMatchSummaryWordsList] = useState<IMatchWordsToHtml[]>([]); // 简介的敏感词
  const [isMatchWordsByIndex, setIsMatchWordsByIndex] = useState<boolean>(false); // 是否是通过index来匹配高亮敏感词的
  const [realVideoUrl, setRealVideoUrl] = useState<string>('');

  const leaderText = machine_result?.leader?.words.length ? '封面图涉习' : '';
  const videosSample: similarVideosArrayType[] =
    Array.isArray(machine_result?.riskSample) && machine_result?.riskSample.length > 0
      ? machine_result?.riskSample
      : (Array.isArray(machine_result?.similarSample) && machine_result?.similarSample.length > 0 && machine_result?.similarSample) || [];
  const isVideo = videoType.includes(location.pathname.replace('/app/audit-system/', ''));

  // const mapKey = (item: any) => {
  //   return {
  //     coordinate: {
  //       x: item?.topLeft?.x,
  //       y: item?.topLeft?.y,
  //     },
  //     stroke: !item.sensitiveResults.length ? 'green' : 'red',
  //     lineWidth: item?.width,
  //     lineHeight: item?.height,
  //   };
  // };

  // /**
  //  * 将命中OCR的数据的图片格式修改为Map，url作为key，同一张图片的命中的文字的数据作为value数组
  //  */
  // let photoSensitive = new Map();
  // Array.isArray(reviewArticleInfo.machine_result.json)
  //   ? reviewArticleInfo.machine_result.json.forEach((item: any) => {
  //       if (photoSensitive.has(item?.url)) {
  //         photoSensitive.set(item?.url, [...photoSensitive.get(item.url), mapKey(item)]);
  //       } else {
  //         photoSensitive.set(item?.url, [mapKey(item)]);
  //       }
  //     })
  //   : [];

  // 处理举报类型和数量
  const ReportPanelData = get(material, 'feedback', []).length
    ? get(material, 'feedback', [])
        .map((item: any) => item.fbcat)
        ?.flat(5)
        .map((str: string) => {
          return {
            key: str,
            // count: 1
          };
        })
    : [];

  // 审核标题组件的数据
  const mediaTitleData = {
    title: material?.title,
    subTitle: material?.subTitle,
    bussinessType: material?.category ? material.category.split(';') : [],
    reviewType: material?.part_zone_cn,
    qualityTags: [
      {
        label: '曝光',
        value: material?.cntView,
      },
      {
        label: '点击率',
        value: material?.cntClick,
      },
      {
        label: 'CTR',
        value: material?.ctr,
      },
    ],
  };

  // 媒体信息组件数据，包括一些 机审信息的锚点、内容媒体、文章信息、作者信息
  const mediaInfoContextProviderValue = () => {
    return {
      leader: leaderText,
      sensitiveGroup,
      machineModel: {
        machineTags: machine_result?.machineTags || [],
        imageRisk: machine_result?.imageRisk || [],
      },
      similarVideos: {
        type: Array.isArray(machine_result?.riskSample) && machine_result?.riskSample.length > 0 ? 'risk' : 'similar',
        data: videosSample?.map(item => {
          const reqDocid = machine_result?.suggestTag?.req?.docid ?? '';
          if (item?.docId === reqDocid) {
            return {
              ...item,
              hasBorder: true,
            };
          } else {
            return {
              ...item,
              hasBorder: false,
            };
          }
        }),
      },
    };
  };

  const contentMedia = () => {
    let realImg: PictureType[] = [];
    if (!isVideo) {
      // 遍历原来的图片数组的同时遍历过了黑样本图片的数组，黑样本的图片的score值如果大于阈值需要变红
      const images = machine_result?.imageRisk || [];
      const imagesUrl = get(material, 'images', '') ? material.images : [];
      if (images?.length > 0) {
        imagesUrl.forEach((element: Record<ImageTypes, string>) => {
          images.forEach((item: ImageRisk) => {
            if (element?.url === item?.url) {
              realImg.push({
                id: element?.id ?? '',
                url: element.id ? `${IMAGE_DOMAIN}?url=${element.id}` : element.url,
                score: item?.sims?.length > 0 ? item?.sims[0]?.score : 0,
                tag: item?.sims?.length > 0 ? item?.sims[0]?.tag : '',
                antiFrandResult: {
                  needTips: false,
                  tips: '',
                },
              });
            }
          });
        });
      } else {
        // 如果没有黑样本图片的话就按照默认的解析策略
        imagesUrl.forEach((item: Record<ImageTypes, string>) => {
          realImg.push({
            id: item.id,
            url: item.id ? `${IMAGE_DOMAIN}?url=${item.id}` : item.url,
            antiFrandResult: {
              needTips: false,
              tips: '',
            },
          });
        });
      }
      return realImg;
    } else {
      return [];
    }
  };

  /**
   * 敏感词分开匹配 标题匹配标题的 正文匹配正文的 简介匹配简介的 但是右边显示的词需要三个合并起来
   * 图文：标题title | titleWords、正文content/context | articleWords、副标题 subTitle | subTitleWords
   * 视频：标题title | titleWords、简介summary | summaryWords、副标题 subTitle | subTitleWords
   * TODO: apollo的请求可以存起来不需要频繁请求
   * 这个方法 主要是处理了两个事情
   * 1）获取各个 模块的敏感词，通过apollo中的颜色调用 兼容敏感词的方法 返回需要在右侧展示的敏感词和需要在html中匹配的敏感词
   * 2）composeWords 用于右侧展示显示
   * 3）matchWordsToHtml 用于在html中按照索引匹配
   */
  const initWordsHighlight = () => {
    // 获取初始化的词
    const titleWords = machine_result?.sensitive?.title?.words ?? [];
    const summaryWords = machine_result?.sensitive?.summary?.words ?? [];
    const subTitleWords = machine_result?.sensitive?.subTitle?.words ?? [];
    const articleWords = machine_result?.sensitive?.context?.words ?? machine_result?.sensitive?.content?.words ?? [];

    // 逻辑处理
    [...articleWords, ...titleWords, ...summaryWords, ...subTitleWords].length > 0 &&
      getApolloSetting().then(res => {
        // 如果是文章按照index匹配的话 标题、简介肯定也都是
        const isNewArticleSensitiveWords = articleWords.length > 0 && (!!articleWords[0]?.wordRemark || !!articleWords[0]?.expression);

        setIsMatchWordsByIndex(isNewArticleSensitiveWords);

        // 按照模块映射词数据
        const obj = {
          title: () => {
            const { composeWords, matchWordsToHtml } = compatibleSensitiveWords(titleWords, JSON.parse(res.sensitiveHighlightList));
            return [composeWords, matchWordsToHtml];
          },
          article: () => {
            const { composeWords, matchWordsToHtml } = compatibleSensitiveWords(articleWords, JSON.parse(res.sensitiveHighlightList));
            return [composeWords, matchWordsToHtml];
          },
          subTitle: () => {
            const { composeWords, matchWordsToHtml } = compatibleSensitiveWords(subTitleWords, JSON.parse(res.sensitiveHighlightList));
            return [composeWords, matchWordsToHtml];
          },
          summary: () => {
            const { composeWords, matchWordsToHtml } = compatibleSensitiveWords(summaryWords, JSON.parse(res.sensitiveHighlightList));
            return [composeWords, matchWordsToHtml];
          },
        };

        // 视频和图文 是标题和副标题共有
        // 用于敏感词高亮的是 matchTitleWordsToHtml
        // 用于右侧合并展示的是 composeTitleWords
        const [composeTitleWords, matchTitleWordsToHtml] = obj.title();
        const [composeSubTitleWords, matchSubTitleWordsToHtml] = obj.subTitle();
        setMatchTitleWordsList(matchTitleWordsToHtml);
        setMatchSubTitleWordsList(matchSubTitleWordsToHtml);

        if (isVideo) {
          // 单独更新一下简介的敏感词
          const [composeSummaryWords, matchSummaryToHtml] = obj.summary();
          setMatchSummaryWordsList(matchSummaryToHtml);
          // 视频右侧需要展示的敏感词是 标题、简介、副标题三者敏感词的合并
          setSensitiveGroup([...composeTitleWords, ...composeSubTitleWords, ...composeSummaryWords]);
        } else {
          const [composeArticleWords, matchArticleWordsToHtml] = obj.article();

          setSensitiveGroup([...composeTitleWords, ...composeArticleWords, ...composeSubTitleWords]);
          setMatchArticleWordsList(matchArticleWordsToHtml);
        }
        replaceTagComponent();
      });
  };

  // 视频简介或者文章html
  const content = () => {
    if (!isVideo) {
      const html = get(material, 'content', '');
      // 将内容侧处理完的图片url替换为go2yd的域名
      return html;
    } else {
      return highlightHtml(matchSummaryWordsList, material?.summary || '', 'video').htmlText;
    }
  };

  /**
   * 只有曝光审核的url需要转换
   */
  const resetVideoUrl = () => {
    // 视频地址 只有曝光审核的时候才调用转换接口 统一视频地址都从material?.videoUrls[0]获取
    const videoUrl = isVideo
      ? (Array.isArray(material?.videoUrls) && material?.videoUrls.length > 0 && material?.videoUrls[0]) || material?.url || ''
      : '';

    if (videoUrl) {
      handleNewVideoUrl(videoUrl)
        .then(res => {
          setRealVideoUrl(res);
        })
        .catch(err => {
          message.error(`转换视频接口失败，原因：${err}`);
        });
    } else {
      setRealVideoUrl(videoUrl);
    }
  };

  const replaceTagComponent = () => {
    try {
      $TagComponent && $TagComponent.render();
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    resetVideoUrl();
    initWordsHighlight();
    replaceTagComponent();
  }, []);

  const markPanelProps = {
    isVideo,
    material,
    reloadCallBack,
    userReviewResult: reviewArticleInfo[`result_l${audit_level}`],
  };

  return (
    <div className="main-panel-card">
      <div className="card main-panel-card-left">
        <MediaContentTitlePanel
          title={mediaTitleData.title}
          subTitle={mediaTitleData.subTitle}
          matchTitleWords={matchTitleWordsList}
          matchSubTitleWords={matchSubTitleWordsList}
          bussinessType={mediaTitleData.bussinessType}
          qualityTags={mediaTitleData.qualityTags}
          reviewType={mediaTitleData.reviewType}
          logModalCallBack={visible => logModalCallBack(visible)}
          templateName={templateName}
          summary={isVideo ? content() : ''}
        />
        <div className="scroll-panel">
          {isVideo ? (
            <div style={{ height: '100%' }}>
              <VideoPanel
                realVideoUrl={realVideoUrl}
                sourceUrl={(Array.isArray(material?.videoUrls) && material?.videoUrls[0]) || material?.url}
                antiFrandResult={machine_result?.antiFrandResult?.imgs || []}
              />
              {!isPreview && (
                <div style={{ paddingTop: 20 }}>
                  <NianHuaMarkPanel {...markPanelProps} />
                </div>
              )}
            </div>
          ) : (
            Array.isArray(material.images) &&
            material.images.length && (
              <div id="nian-hua-image">
                {material.images.map((item: any, index: number) => (
                  <div className="image-bg" key={index}>
                    <div className="image-wrapper">
                      <img src={item.url} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <div className="main-panel-card-right">
        <div className={`${reverseColumn.includes(currentRoutePath()) ? 'panel-reverse' : ''}`}>
          <div className="card more-info">
            <CreateMediaInfoContext.Provider value={mediaInfoContextProviderValue()}>
              <MediaInfo contentMedia={contentMedia()} anchorCount={anchorCount} isVideo={isVideo} data={reviewArticleInfo} />
            </CreateMediaInfoContext.Provider>
          </div>
          {!isVideo && !isPreview && audit_level !== -1 && (
            <div className="card">
              <NianHuaMarkPanel {...markPanelProps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NianHuaPanel;
