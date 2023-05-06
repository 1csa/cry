import { BaseFormModelType } from '@/types';
import { sysConfing } from '@/data/constants';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';

const formModel: Array<BaseFormModelType> = [
  {
    label: '业务类型',
    name: 'tableName',
    type: 'select',
    sourceData: sysConfing.businessType,
  },
  {
    label: '操作类型',
    name: 'manipulateType',
    type: 'select',
    sourceData: [
      {
        label: '添加',
        value: 'insert',
      },
      {
        label: '更新',
        value: 'update',
      },
      {
        label: '删除',
        value: 'delete',
      },
    ],
  },
  {
    label: '操作人',
    name: 'operatorId',
    type: 'text',
  },
  {
    label: '操作时间',
    name: 'operationTime',
    type: 'rangePicker',
    timeKey: ['gmtCreateStart', 'gmtCreateEnd'],
    formateTime: DATE_FORMAT_SS,
  },
  {
    label: '查询',
    type: 'button',
  },
];
export default formModel;
