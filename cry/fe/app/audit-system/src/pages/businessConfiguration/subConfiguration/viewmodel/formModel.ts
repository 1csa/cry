/**
 * 下拉菜单 数据流向说明： 首先是在index.tsx中引入本文件
 *
 * 如果没有联动，则就直接使用 BusinessSelector 组件传递 selectProps servicesFunction 两个参数即可
 * 直接 export default formModel 就行不用函数包装再返回
 *
 * 如果有联动，则在index.tsx初始化的时候 传入联动的回调函数 这里 BusinessSelector 调用里底层的 BasicSelector 组件
 * 接受cascaderOptions 系列参数 用于联动数据处理
 * 此时不能直接 export default formModel 需要包装一下将数据作为一个函数 因为要接受index.tsx传入的回调函数
 * ddlCb 拿到数据之后就可以在index.tsx对整个 formModel 做处理
 */

import React from 'react';
import { BaseFormModelType } from '@/types';
import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchBusinessList, fetchBusinessUnitList } from '@/services/businessConfiguration';
import { fetchAuditLabelGroups } from '@/services/dropdownList';
import { material_type } from '@/data/constants';

const initFormModel = (ddlCb?: (v?: any) => void) => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '子业务Id',
      name: 'businessUnitId',
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
        // cascaderOptions: {
        //   paramsKey: 'businessId',
        //   fun: fetchBusinessUnitList,
        //   cascaderKey: 'businessUnitId',
        //   callbackData: ddlCb, // BasicSelector 的联动数据会传递给 ddlCb 的函数 这个函数会在index.tsx中捕获到数据
        // },
      }),
    },
    // {
    //   label: '所属子业务',
    //   name: 'businessUnitId',
    //   sourceData: [],
    //   type: 'select',
    // },
    {
      label: '内容类型',
      name: 'contentType',
      sourceData: material_type,
      type: 'select',
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '标签组',
          name: 'tagId',
        },
        servicesFunction: fetchAuditLabelGroups,
      }),
    },
    {
      label: '查询',
      type: 'button',
    },
  ];
  return formModel;
};

export default initFormModel;
