import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';

import { filterFormKey, replaceFormItem } from '@/pages/commonPages/baseHisContentList/model/inspection/formModel';
import { filterTableKey, replaceTableItem } from '@/pages/commonPages/baseHisContentList/model/inspection/tableColumns';

import { ContentType } from '@/data/constants';

const contentType = 'inspection';

const ContentList = () => (
  <BaseHisContentList
    initialValues={{ material_type: [ContentType[contentType]] }}
    contentType={contentType}
    filterOptions={{
      filterFormKey,
      filterTableKey,
      replaceFormItems: { index: -1, items: replaceFormItem },
      replaceTableItems: {
        index: 2,
        items: replaceTableItem,
      },
    }}
  />
);

export default ContentList;
