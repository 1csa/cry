import { TableItemType } from '@/types';

const columnsOptions: Array<TableItemType> = [
  {
    title: '操作时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
  },
  {
    title: '业务类型',
    dataIndex: 'objectName',
    key: 'objectName',
  },
  {
    title: '操作类型',
    dataIndex: 'operationDescription',
    key: 'operationDescription',
  },
  {
    title: '操作记录',
    dataIndex: 'diffDescription',
    key: 'diffDescription',
    width: 800,
  },
  {
    title: '操作人姓名',
    dataIndex: 'operatorName',
    key: 'operatorName',
  },
  {
    title: '操作人ID',
    dataIndex: 'operatorId',
    key: 'operatorId',
  },
];

export default columnsOptions;
