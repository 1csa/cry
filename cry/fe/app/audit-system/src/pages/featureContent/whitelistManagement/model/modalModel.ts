import React from 'react';

import { BaseFormModelType, OnChangeFnType } from '@/types';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { whiteList } from '@/data/constants';
// import { stage } from '@/data/constants';
// import ExcelSheet from '../ExcelSheet';
import ObjectIds from '../objectIds';

import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchBusinessList, fetchBusinessUnitList } from '@/services/dropdownList';

// 白名单 新增 | 编辑 | 导入Excels
const initFormModel = (isEdit: boolean, isEnabledTime: boolean, ddlCb?: (v?: any) => void, type?: 'textarea' | 'upload') => {
  // 增加的基础表单
  const addModel: Array<BaseFormModelType> = [
    {
      label: '白名单类型',
      name: 'listType',
      type: 'select',
      sourceData: whiteList.whiteListType,
      rules: [{ required: true }],
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '所属业务',
          name: 'businessId',
          rules: [{ required: true, message: '请选择所属业务' }],
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
      rules: [{ required: true, message: '请选择所属子业务' }],
    },
  ];

  const toggleSwitch: Array<BaseFormModelType> = [
    {
      label: '生效时间(是否永久)',
      name: 'enableTime',
      type: 'switch',
      switchProps: {
        checkedChildren: '否',
        unCheckedChildren: '是',
      },
      rules: [{ required: true }],
      onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
        return fn && fn({ isEnabledTime: value });
      },
    },
  ];

  // 不使用时间组件 永久
  const notUseTime = () => {
    const btn = {
      label: '确认',
      name: 'confirm',
      type: 'button',
    };
    if (isEdit) {
      return [btn];
    } else {
      return [
        {
          type: 'component',
          name: 'excel',
          // renderComponent: React.createElement(ExcelSheet),
          renderComponent: React.createElement(ObjectIds, {
            type,
          }),
        },
        btn,
      ];
    }
  };

  // 非永久
  const useTime: Array<BaseFormModelType> = [
    {
      label: '生效时间设置',
      name: 'operationTime',
      type: 'rangePicker',
      timeKey: ['startTime', 'endTime'],
      formateTime: DATE_FORMAT_SS,
      rules: [{ required: true }],
    },
    ...notUseTime(),
  ];

  // 编辑的基础数据
  const editModel: Array<BaseFormModelType> = [
    {
      label: '白名单类型',
      name: 'typeDescription',
      type: 'text',
      disabled: true,
      rules: [{ required: true }],
    },
    {
      label: '所属业务',
      name: 'businessName',
      type: 'text',
      disabled: true,
      rules: [{ required: true }],
    },
    {
      label: '所属子业务',
      name: 'businessUnitName',
      type: 'text',
      disabled: true,
      rules: [{ required: true }],
    },
    {
      label: '媒体ID',
      name: 'objectId',
      type: 'text',
      rules: [{ required: true }],
    },
    {
      label: '媒体名称',
      name: 'description',
      type: 'text',
      rules: [{ required: true }],
    },
  ];

  const switchClose = [...toggleSwitch, ...notUseTime()];
  const switchOpen = [...toggleSwitch, ...useTime];
  const a: Array<BaseFormModelType> = [...editModel, ...switchOpen];
  const b: Array<BaseFormModelType> = [...editModel, ...switchClose];
  const c: Array<BaseFormModelType> = [...addModel, ...switchOpen];
  const d: Array<BaseFormModelType> = [...addModel, ...switchClose];

  if (isEdit) {
    return isEnabledTime ? a : b;
  } else {
    return isEnabledTime ? c : d;
  }
};

export default initFormModel;
