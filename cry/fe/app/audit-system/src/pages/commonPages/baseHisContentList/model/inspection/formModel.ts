import React from 'react';

import AuditUserSelect from '@/components/Smart/AuditUserSelect';

import { BaseFormModelType } from '@/types';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    {
      type: 'component',
      renderComponent: React.createElement(AuditUserSelect, {
        selectProps: {
          label: '被质检人姓名',
          name: 'inspectionUser',
        },
      }),
    },
  ];
  return formModel;
};
export const filterFormKey =
  'insertTime,machineLabels,sensitiveCategories,sensitiveWords,machineAuditResult,manualAuditResult,manualLabels,articleAuthorId';
export const replaceFormItem = initFormSchema();
