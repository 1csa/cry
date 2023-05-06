import { ColumnsType } from '@/types';
import { material_type } from '@/data/constants';

function getColumns(columnsOptions: ColumnsType) {
  const { operation } = columnsOptions;
  return [
    {
      title: '子业务Id',
      dataIndex: 'businessUnitId',
      key: 'businessUnitId',
    },
    {
      title: '子业务名称',
      dataIndex: 'businessUnitName',
      key: 'businessUnitName',
    },
    {
      title: '所属业务',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: '内容类型',
      dataIndex: 'contentTypeCn',
      key: 'contentTypeCn',
    },
    {
      title: '审核模板',
      dataIndex: 'templateCn',
      key: 'templateCn',
    },
    {
      title: '标签组',
      dataIndex: 'tagName',
      key: 'tagName',
      width: 200,
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
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
