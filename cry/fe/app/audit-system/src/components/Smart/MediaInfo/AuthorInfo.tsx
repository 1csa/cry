import React, { useMemo } from 'react';

const copyrightMap = {
  0: '无版权',
  1: '有版权',
};
const subTypeMap = {
  0: '无',
  null: '无',
  1: '央媒',
  2: '党媒',
  3: '官媒',
  4: '商媒',
  5: '代理',
};
const mediaTypeMap = {
  1: '个人',
  2: '机构',
  3: '政务',
  4: '企业',
  5: '其他',
};
const authorMap = {
  0: '未开通',
  2: '开通原创',
  4: '开通独家',
  10: '终止',
};

export const accountMap = {
  1: '中台获取账号',
  0: '自媒体账号',
};

interface IAuthorInfo {
  authorInfo: { [K: string]: string | number };
  docid: string;
  isGroup: boolean; // 是否群照片墙
  isInspection: boolean; // 是否质检
  auditorNameL1: string; // 初审人
}

/**
 * 作者信息组件
 */
const AuthorInfo: React.FC<IAuthorInfo> = ({ authorInfo, docid, isGroup, isInspection, auditorNameL1 }) => {
  return useMemo(
    () => (
      <div className="author-info mb10">
        <h3>作者信息</h3>
        <div className="article-info-x">
          <p className="p-details">
            <span className="sp-title">账号类型：</span>
            <span className="f1 orange">{accountMap[authorInfo?.vest]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">作者名称：</span>
            <span className="f1 orange">{authorInfo?.mediaName}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">账号认证信息：</span>
            <span className="f1">{authorInfo?.authentication}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">作者ID：</span>
            <span className="f1">{authorInfo?.mediaId}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">媒体等级：</span>
            <span className="f1 orange">{authorInfo?.mediaLevel}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">媒体类型：</span>
            <span className="f1">{mediaTypeMap[authorInfo?.mediaType]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">账号二级分类：</span>
            <span className="f1">{subTypeMap[authorInfo?.subType]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">{isGroup ? '群ID' : '领域'}：</span>
            <span className="f1">{authorInfo?.mediaClass}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">版权：</span>
            <span className="f1">{copyrightMap[authorInfo?.mediacopyright]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">发文权限：</span>
            <span className="f1">{authorMap[authorInfo?.Author]}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">白名单：</span>
            <span className="f1 orange">{authorInfo.selfVisibleFlag ? '自见豁免白名单' : ''}</span>
          </p>
          <p className="p-details">
            <span className="sp-title">每日发文篇数：</span>
            <span className="f1 ">{authorInfo?.postcount}</span>
          </p>
          {isInspection ? (
            <p className="p-details">
              <span className="sp-title">初审人：</span>
              <span className="f1">{auditorNameL1}</span>
            </p>
          ) : null}
        </div>
      </div>
    ),
    [docid],
  );
};

export default AuthorInfo;
