import React from 'react';
import { BaseFormModelType } from '@/types';
import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchParentLabelList } from '@/services/dropdownList';
import { tagInfo } from '@/data/constants';

const initFormModel = (isEdit?: boolean) => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '标签',
      name: 'name',
      type: 'text',
      rules: [{ required: true, message: '请输入标签，1~10个字符。', min: 1, max: 10 }],
    },
    {
      label: '编码',
      name: 'code',
      type: 'text',
      rules: [
        {
          required: true,
          message: '6～32个字符，可使用字母、数字、下划线，需要以字母开头',
          min: 6,
          max: 32,
          pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,32}/,
        },
      ],
      disabled: isEdit,
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '父级标签',
          name: 'parentId',
          rules: [{ required: true }],
        },
        servicesFunction: fetchParentLabelList,
      }),
    },
    {
      label: '动作',
      name: 'action',
      type: 'select',
      sourceData: tagInfo.action,
      rules: [{ required: true }],
      disabled: isEdit,
    },
    {
      label: '话术',
      name: 'words',
      type: 'text',
      rules: [{ required: false, max: 300 }],
    },
    // {
    //   label: '快捷键',
    //   name: 'shortcutName',
    //   type: 'text',
    //   disabled: true,
    // },
    {
      label: '排序（数字越小越靠前）',
      name: 'sort',
      type: 'inputNumber',
      inputNumber: {
        min: 0,
      },
    },
    {
      label: '确认',
      type: 'button',
    },
  ];
  return formModel;
};
export default initFormModel;
