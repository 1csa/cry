import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { replaceFormItem } from './viewmodel/formModel';
const VideoAuditHisList = () => {
  const contentType: string = 'video';
  // const routePathUrl: string = `/videoReview/mediaContentReview`;

  return (
    <BaseHisContentList
      initialValues={{ material_type: [103] }}
      contentType={contentType}
      // routePathUrl={routePathUrl}
      filterOptions={{
        replaceFormItems: { index: -11, items: replaceFormItem },
      }}
    />
  );
};

export default VideoAuditHisList;
