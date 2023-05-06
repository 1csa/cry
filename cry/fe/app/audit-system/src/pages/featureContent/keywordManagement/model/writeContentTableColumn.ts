import uploadTableColumn from './uploadTableColumn';
export default [
  ...[
    {
      title: '校验状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      key: 'failReason',
    },
  ],
  ...uploadTableColumn,
];
