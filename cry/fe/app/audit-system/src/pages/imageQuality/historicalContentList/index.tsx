import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { ContentType } from '@/data/constants';

import { filterFormKey, replaceFormItem } from '@/pages/commonPages/baseHisContentList/model/quality/formModel';
import { filterTableKey, replaceTableItem } from '@/pages/commonPages/baseHisContentList/model/quality/tableColumns';

const ImageQualityHis = () => {
  const contentType: string = 'articleQuality';
  return (
    <BaseHisContentList
      initialValues={{ material_type: [ContentType[contentType]] }}
      contentType={contentType}
      filterOptions={{
        filterFormKey,
        filterTableKey,
        // index 是准备需要将replaceFormItem插入到哪里 利用里splice的api
        replaceFormItems: { index: -3, items: replaceFormItem },
        replaceTableItems: {
          index: 3,
          items: replaceTableItem,
        },
      }}
    />
  );
};

export default ImageQualityHis;
