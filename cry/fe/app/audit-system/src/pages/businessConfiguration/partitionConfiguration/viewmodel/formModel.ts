import React from 'react';
import { BaseFormModelType } from '@/types';
import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchBusinessList, fetchBusinessUnitList } from '@/services/businessConfiguration';

const initFormModel = (ddlCb?: (v?: any) => void) => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '分区名称',
      name: 'partzoneCn',
      type: 'text',
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '所属业务',
          name: 'businessId',
        },
        servicesFunction: fetchBusinessList,
        cascaderOptions: {
          paramsKey: 'businessId',
          fun: fetchBusinessUnitList,
          cascaderKey: 'businessUnitId',
          callbackData: ddlCb, // BasicSelector 的联动数据会传递给 ddlCb 的函数 这个函数会在index.tsx中捕获到数据
        },
      }),
    },
    {
      label: '所属子业务',
      name: 'businessUnitId',
      sourceData: [],
      type: 'select',
    },
    {
      label: '查询',
      type: 'button',
    },
  ];
  return formModel;
};

export default initFormModel;
