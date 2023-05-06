import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { ContentType } from '@/data/constants';

import { filterFormKey, replaceFormItem } from '@/pages/commonPages/baseHisContentList/model/message/formModel';
import { filterTableKey, replaceTableItem } from '@/pages/commonPages/baseHisContentList/model/message/tableColumns';

// const contentType: string = 'message';
const contentType = 'userAction';
// const routePathUrl: string = `/privateMessage/messageReview`;

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
