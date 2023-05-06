import React from 'react';
import { BaseFormModelType } from '@/types';
import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchParentLabelList } from '@/services/dropdownList';
import { tagInfo } from '@/data/constants';

const formModel = (groupId?: number) => {
  const data: Array<BaseFormModelType> = [
    {
      label: '标签',
      name: 'name',
      type: 'text',
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '父级标签',
          name: 'parentId',
        },
        servicesFunction: () => fetchParentLabelList({ groupId }),
      }),
    },
    {
      label: '动作',
      name: 'action',
      type: 'select',
      sourceData: tagInfo.action,
    },
    {
      label: '查询',
      type: 'button',
    },
  ];
  return data;
};

// const formModel: Array<BaseFormModelType> =
export default formModel;
