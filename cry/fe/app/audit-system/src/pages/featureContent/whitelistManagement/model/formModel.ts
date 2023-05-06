import React from 'react';

import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import { fetchBusinessList, fetchBusinessUnitList } from '@/services/dropdownList';

import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { BaseFormModelType } from '@/types';
import { whiteList } from '@/data/constants';

const initFormModel = (ddlCb?: (v?: any) => void) => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '白名单类型',
      name: 'type',
      type: 'select',
      sourceData: whiteList.whiteListType,
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
    // {
    //   type: 'component',
    //   renderComponent: React.createElement(BusinessSelector, {
    //     selectProps: {
    //       label: '所属子业务',
    //       name: 'businessUnitId',
    //     },
    //     servicesFunction: fetchBusinessUnitList,
    //   }),
    // },
    // {
    //   label: '媒体名称',
    //   name: 'description',
    //   type: 'text',
    //   // type: 'select',
    //   // sourceData: whiteList.objectType,
    // },
    {
      label: '媒体ID',
      name: 'objectId',
      type: 'text',
      // type: 'select',
      // sourceData: whiteList.objectType,
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      sourceData: whiteList.status,
    },
    // {
    //   label: '编辑人',
    //   name: 'operatorUpdate',
    //   type: 'text',
    // },
    {
      type: 'component',
      renderComponent: React.createElement(AuditUserSelect, {
        selectProps: {
          label: '编辑人',
          name: 'operatorUpdate',
        },
      }),
    },
    {
      label: '操作时间',
      name: 'operationTime',
      type: 'rangePicker',
      timeKey: ['gmtUpdateStart', 'gmtUpdateEnd'],
      formateTime: DATE_FORMAT_SS,
    },
    {
      label: '查询',
      type: 'button',
    },
  ];

  return formModel;
};

export default initFormModel;
