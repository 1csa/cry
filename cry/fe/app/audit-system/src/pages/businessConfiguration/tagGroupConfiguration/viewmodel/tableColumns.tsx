import { ColumnsType } from '@/types';

function getColumns(columnsOptions: ColumnsType) {
  const { operation } = columnsOptions;
  return [
    {
      title: '标签组名称',
      dataIndex: 'name',
      key: 'name',
      width: 400,
    },
    {
      title: '标签组描述',
      dataIndex: 'description',
      key: 'description',
      width: 800,
    },
    {
      title: '最近编辑人',
      dataIndex: 'updateOperatorName',
      key: 'updateOperatorName',
    },
    {
      title: '最近编辑时间',
      dataIndex: 'gmtUpdate',
      key: 'gmtUpdate',
    },
    ...operation,
  ];
}
export default getColumns;
