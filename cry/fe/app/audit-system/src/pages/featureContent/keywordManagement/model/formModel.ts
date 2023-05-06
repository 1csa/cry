import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { actionType, status } from './constants';

export default [
  {
    label: '关键词',
    name: 'word',
    type: 'text',
    isReplaceName: false,
    preSelect: [
      {
        label: '精确',
        value: 'accuracy&number&1',
      },
      {
        label: '模糊',
        value: 'accuracy&number&0',
      },
    ],
  },
  {
    label: '关键词分类',
    name: 'categoryId',
    sourceData: [],
    type: 'cascader',
    fieldNames: { label: 'categoryName', value: 'categoryId', children: 'category' },
    width: 260,
  },
  {
    label: '审核指令',
    name: 'actionType',
    type: 'select',
    sourceData: actionType.filter(e => e.value !== -1),
  },
  {
    label: '生效区域',
    name: 'subId',
    type: 'select',
    sourceData: [],
  },
  {
    label: '生效业务方',
    name: 'businessId',
    type: 'select',
    width: 260,
    sourceData: [],
  },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    sourceData: status,
  },
  {
    label: '备注',
    name: 'remark',
    type: 'text',
  },
  {
    label: '操作人',
    name: 'operationUName',
    type: 'text',
  },
  {
    label: '提交时间',
    name: 'operationTime',
    type: 'rangePicker',
    timeKey: ['startTime', 'endTime'],
    formateTime: DATE_FORMAT_SS,
  },
  {
    label: '查询',
    type: 'button',
    buttonName: '敏感词查询',
  },
];
