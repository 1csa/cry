import { ColumnsType } from '@/types';
import { tagInfo } from '@/data/constants';

function getColumns(columnsOptions: ColumnsType) {
  const { operation } = columnsOptions;
  return [
    {
      title: '标签',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '父级标签',
      dataIndex: 'parentLabel',
      key: 'parentLabel',
    },
    {
      title: '动作',
      dataIndex: 'action',
      key: 'action',
      render: (action: number) => tagInfo.action.find(item => item.value === action)?.label,
    },
    {
      title: '话术',
      dataIndex: 'words',
      key: 'words',
    },
    // {
    //   title: '快捷键',
    //   dataIndex: 'shortcutName',
    //   key: 'shortcutName',
    // },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
