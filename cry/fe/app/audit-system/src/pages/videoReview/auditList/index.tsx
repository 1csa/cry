import React from 'react';
import PicArtAuditList from '@/pages/pictureArticleReview/auditList';
import { ContentType } from '@/data/constants';

/**
 * 视频的列表组件是用的图文的
 * 所以所有的参数都是先进入图文的list才是到底层的list
 */
const VideoAuditList: React.FC<{}> = () => {
  const contentType: string = 'video';
  const routePath: string = `/videoReview/mediaContentReview`;
  return (
    <PicArtAuditList
      contentType={contentType}
      routePath={routePath}
      initialValues={{ material_type: [ContentType[contentType]], status: [3010] }}
    />
  );
};

export default VideoAuditList;
