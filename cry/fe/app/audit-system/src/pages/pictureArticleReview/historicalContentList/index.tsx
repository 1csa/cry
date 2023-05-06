import React from 'react';
import BaseHisContentList from '@/pages/commonPages/baseHisContentList';
import { replaceFormItem } from './viewmodel/formModel';
const contentType = 'article';

const PicArticleAuditHisList = () => {
  return (
    <BaseHisContentList
      initialValues={{ material_type: [102] }}
      contentType={contentType}
      filterOptions={{
        replaceFormItems: { index: -10, items: replaceFormItem },
      }}
    />
  );
};

export default PicArticleAuditHisList;
