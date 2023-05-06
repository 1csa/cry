import React from 'react';
import { businessConf, audit_level } from '@/data/constants';
import { BaseFormModelType } from '@/types';
import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchBusinessList, fetchBusinessUnitList } from '@/services/businessConfiguration';

const initFormModel = (
  isEdit: boolean,
  ddlCb?: (v?: any) => void,
  handleInputNumberChange?: (value: number | string | undefined) => void,
) => {
  const top: Array<BaseFormModelType> = [
    {
      label: '分区名称',
      name: 'partzoneCn',
      type: 'text',
      rules: [
        { required: true, message: '请输入分区名称，最少2个字符，最多32个字符。', min: 2, max: 32 },
      ],
    },
    {
      label: '分区描述',
      name: 'description',
      type: 'text',
      rules: [
        {
          required: false,
          message: '请输入分区描述，最多150个字符。',
          min: 0,
          max: 150,
        },
      ],
    },
  ];
  const middleIsNotEdit: Array<BaseFormModelType> = [
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '所属业务',
          name: 'businessId',
          rules: [{ required: true }],
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
      rules: [{ required: true }],
    },
  ];

  const middleIsEdit: Array<BaseFormModelType> = [
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
  ];

  const bottom: Array<BaseFormModelType> = [
    {
      label: '最多包含几审',
      name: 'auditLevel',
      type: 'select',
      rules: [{ required: true }],
      sourceData: audit_level,
    },
    {
      label: '审核时限（分钟）',
      name: 'auditTimeLimit',
      type: 'inputNumber',
      rules: [{ required: true, message: '审核时限不能为空！' }],
      inputNumber: {
        min: 1,
        max: 60,
        handleChange: handleInputNumberChange,
      },
    },
    {
      label: '是否启用快捷键',
      name: 'isEnabledKey',
      type: 'select',
      sourceData: businessConf.isEnabledKey,
      rules: [{ required: true, message: '审核时限不能为空！' }],
    },
    {
      label: '提交延时（秒）',
      name: 'delayTime',
      type: 'inputNumber',
      rules: [{ required: true, message: '提交延时不能为空！' }],
      inputNumber: {
        min: 0,
        max: 8 * 60, // 最大数值按照 审核时限 动态设置 * 60
      },
    },
    {
      label: '确认',
      type: 'button',
    },
  ];

  let formModel: Array<BaseFormModelType> = [];

  if (isEdit) {
    formModel = [...top, ...middleIsEdit, ...bottom];
  } else {
    formModel = [...top, ...middleIsNotEdit, ...bottom];
  }
  return formModel;
};
export default initFormModel;
