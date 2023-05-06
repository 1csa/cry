import React, { useState } from 'react';
import produce from 'immer';

import SimilarVideos from '@/components/Dumb/SimilarVideos';
import MachineInfoPanel from './MachineInfoPanel';
import ArticleInfo from './ArticleInfo';
import AuthorInfo from './AuthorInfo';
import AntiFrandPicture from './AntiFrandPicture';

import { BusinessType, SubBusinessType } from '@/data/constants';

import './index.less';

export type PictureType = {
  id: string;
  url: string;
  score?: number;
  tag?: string;
  antiFrandResult: {
    needTips: boolean;
    tips: string | Array<string>;
  };
};
interface MediaInfoProps {
  data: any; // 数据
  contentMedia: Array<PictureType>; // 图文内容媒体图片 | 视频封面图片 url
  anchorCount: { [K: string]: number }; // 文章中命中几个锚点在DangerousText组件中初始化的时候已经回传到父组件FeedbackMainPanel，再由FeedbackMainPanel传给MediaInfo【状态提升】
  isVideo: boolean; // 是否视频审核
}

let obj = {};

/**
 * 媒体信息组件，包括一些 机审信息的锚点、内容媒体、文章信息、作者信息
 */
const MediaInfo: React.FC<MediaInfoProps> = ({ data, contentMedia, anchorCount, isVideo }) => {
  const { material, business_id, business_unit_id, last_auditor_name = '' } = data;
  const { data_id, docid, media: authorInfo, attr: articleInfo } = material;

  const isNianHua = business_id === BusinessType.nianHua;
  const isInspection = business_id === BusinessType.inspection;
  const isGroup = business_unit_id === SubBusinessType.groupPictures;

  // 用来初始化锚点索引从第一位开始，记录点击次数 一组观察对比的数据 命中那些关键词作为key命中的数量作为value 在点击锚点的时候++数据
  for (const key in anchorCount) {
    Object.assign(obj, {
      [key]: 0,
    });
  }

  const [pageAnchorData, setPageAnchorData] = useState<any>(obj);

  const handleTagChange = (item: string) => {
    // 每次点击一次锚点增加一个索引
    const newState = produce(pageAnchorData, (draft: any) => {
      if (draft[item] === anchorCount[item]) {
        draft[item] = 1;
      } else {
        ++draft[item];
      }
      // 设置点击敏感词的时候去滚动 这里为啥直接拼article呢 因为标题一只固定不需要跳转的
      const ele = document.querySelector(`[data-id=${item}-article-${draft[item]}]`);
      if (ele) {
        ele.scrollIntoView({ behavior: 'smooth' });
      }
    });
    setPageAnchorData(newState);
  };

  return (
    <div className="media-info">
      {!isNianHua && (
        <>
          <MachineInfoPanel features={material?.extraInfo?.features} handleTagChangeProps={item => handleTagChange(item)} />
          <SimilarVideos />
        </>
      )}
      {isVideo ? (
        <div className="content-media">
          <h3>封面图</h3>
          <AntiFrandPicture contentMedia={contentMedia} imgAlt="视频封面图" canScroll={false} />
        </div>
      ) : (
        !isNianHua && (
          <div className="content-media">
            <h3>内容媒体</h3>
            <AntiFrandPicture contentMedia={contentMedia} imgAlt="内容媒体图片" />
          </div>
        )
      )}
      <AuthorInfo authorInfo={authorInfo} docid={docid} isGroup={isGroup} isInspection={isInspection} auditorNameL1={last_auditor_name} />
      <ArticleInfo articleInfo={articleInfo} docid={docid} dataId={data_id} extraInfo={material?.extraInfo} />
    </div>
  );
};

export default MediaInfo;
