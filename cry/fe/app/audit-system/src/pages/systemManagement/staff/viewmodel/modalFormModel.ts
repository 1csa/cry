import { BaseFormModelType } from '@/types';

const modalFormModel: Array<BaseFormModelType> = [
  {
    label: '用户ID',
    name: 'pandoraId',
    type: 'text',
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '姓名',
    name: 'name',
    type: 'text',
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '邮箱',
    name: 'email',
    type: 'text',
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '工号',
    name: 'workNo',
    type: 'text',
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '账号状态',
    name: 'isEnabled',
    type: 'switch',
    switchProps: {
      checkedChildren: '启用',
      unCheckedChildren: '禁用',
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '组织',
    name: 'isOutsource',
    type: 'switch',
    switchProps: {
      checkedChildren: '一点',
      unCheckedChildren: '外包',
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    label: '确认',
    name: 'confirm',
    type: 'button',
  },
];

export default modalFormModel;
