import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { filterFormKey, replaceFormItem } from '@/pages/commonPages/baseHisContentList/model/classification/formModel';
import { filterTableKey, replaceTableItem } from '@/pages/commonPages/baseHisContentList/model/classification/tableColumns';

import { ContentType } from '@/data/constants';

const VideoClassificationHis = () => {
  const contentType: string = 'videoTags';
  return (
    <BaseHisContentList
      initialValues={{ material_type: [ContentType[contentType]] }}
      contentType={contentType}
      filterOptions={{
        filterFormKey,
        filterTableKey,
        replaceFormItems: { index: -3, items: replaceFormItem },
        replaceTableItems: {
          index: 3,
          items: replaceTableItem,
        },
      }}
    />
  );
};

export default VideoClassificationHis;
