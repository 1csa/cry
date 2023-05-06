import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { ContentType } from '@/data/constants';

import { filterFormKey, replaceFormItem } from '@/pages/commonPages/baseHisContentList/model/student/formModel';
import { filterTableKey, replaceTableItem } from '@/pages/commonPages/baseHisContentList/model/student/tableColumns';

const contentType: string = 'student';
// const routePathUrl: string = `/studentCard/studentReview`;

const HistoryContentList = () => {
  return (
    <BaseHisContentList
      initialValues={{ material_type: [ContentType[contentType]] }}
      contentType={contentType}
      // routePathUrl={routePathUrl}
      filterOptions={{
        filterFormKey,
        filterTableKey,
        replaceFormItems: { index: 3, items: replaceFormItem },
        replaceTableItems: { index: 0, items: replaceTableItem },
      }}
    />
  );
};

export default HistoryContentList;
