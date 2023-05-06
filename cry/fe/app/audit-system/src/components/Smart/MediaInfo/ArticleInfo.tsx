import React, { useMemo } from 'react';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';

import { isJSON } from '@/utils/dev_helper';

const copyrightMap = {
  0: '无版权',
  1: '有版权',
};
const showStatusMap = {
  1: '正常',
  0: '删除',
};
const puhlistType = {
  1: '手动发文',
  2: '自动发文',
};

interface IArticleInfo {
  articleInfo: { [K: string]: string | number };
  docid: string;
  dataId: string;
  extraInfo: any;
}

/**
 * 文章信息组件
 */
const ArticleInfo: React.FC<IArticleInfo> = ({ articleInfo, docid, dataId, extraInfo }) => {
  // 圈子  栏目
  const { partnerName = '', clipName = '', features = '' } = extraInfo ?? {};
  const featuresObj = useMemo(() => (isJSON(features) ? JSON.parse(features) : features), [docid]);

  return useMemo(
    () => (
      <div className="article-info">
        <h3>文章信息</h3>
        <div className="article-info-x">
          <div className="picture-main-box picture-box fb">
            <div className="f1"></div>
          </div>
          <p className="p-details">
            <span className="sp-title">docid：</span>
            {/* {docid && <BasicCopyToClipboard data={docid} title="docid" renderChild={() => <span className="cp f1">{docid}</span>} />} */}
            <a href={'http://www.yidianzixun.com/' + docid} target="_blank">
              <span className="cp f1">{docid}</span>
            </a>
          </p>
          <p className="p-details">
            <span className="sp-title">暴雪系统ID：</span>
            {dataId && <BasicCopyToClipboard data={dataId} title="任务id" renderChild={() => <span className="cp f1 ellipsis">{dataId}</span>} />}
          </p>
          <p className="p-details">
            <span className="sp-title">封面图贴纸：</span>
            <span className={`f1 ${!!featuresObj.videoCoverContent ? 'orange' : ''}`}>{!!featuresObj.videoCoverContent ? '有' : '无'}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">文章标记：</span>
            <span className="f1">{articleInfo?.mark}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">展示状态：</span>
            <span className="f1">{showStatusMap[articleInfo?.show_status]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">发布时间：</span>
            <span className="f1">{articleInfo?.time}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">发文地区：</span>
            <span className="f1">{articleInfo?.area}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">发文方式：</span>
            <span className="f1">{puhlistType[articleInfo?.type] || puhlistType[1]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">版权：</span>
            <span className="f1">{copyrightMap[articleInfo?.copyright]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">版权风险：</span>
            <span className="f1">{articleInfo?.copy_risk}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">风险项：</span>
            <span>{articleInfo?.risk_class}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">发文IP：</span>
            <span className="f1">{articleInfo?.ip}</span>
          </p>
          {partnerName && (
            <p className="p-details">
              <span className="sp-title">圈子：</span>
              <span className="f1 orange">{partnerName}</span>
            </p>
          )}
          {clipName && (
            <p className="p-details">
              <span className="sp-title">栏目：</span>
              <span className="f1 orange">{clipName}</span>
            </p>
          )}
        </div>
      </div>
    ),
    [docid],
  );
};

export default React.memo(ArticleInfo);
