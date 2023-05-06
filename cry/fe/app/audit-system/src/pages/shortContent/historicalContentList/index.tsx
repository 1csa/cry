import React from 'react';

import BaseHisContentList from '@/pages/commonPages/baseHisContentList';

import { ContentType } from '@/data/constants';
import { filterFormKey, replaceFormItem } from './viewmodel/formModel';

const contentType: string = 'comment';

const CommentAuditHisList = () => (
  <BaseHisContentList
    initialValues={{ material_type: [ContentType[contentType]] }}
    contentType={contentType}
    defaultTable={false}
    filterOptions={{
      filterFormKey,
      replaceFormItems: { index: -2, items: replaceFormItem },
    }}
  />
);

export default CommentAuditHisList;
