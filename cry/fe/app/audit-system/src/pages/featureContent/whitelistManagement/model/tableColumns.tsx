import React from 'react';
import { ColumnsType } from '@/types';

function getColumns(columnsOptions?: ColumnsType) {
  const operation = columnsOptions?.operation || [];
  return [
    {
      title: '媒体ID',
      dataIndex: 'objectId',
      key: 'objectId',
    },
    {
      title: '媒体名称',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '所属词表',
      dataIndex: 'typeDescription',
      key: 'typeDescription',
    },
    {
      title: '所属业务',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: '所属子业务',
      dataIndex: 'businessUnitName',
      key: 'businessUnitName',
    },
    {
      title: '生效时间',
      dataIndex: 'text',
      key: 'text',
      render: (text: string, record: any) => (
        <>
          {record.startTime} - {record.endTime}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'statusDescription',
      key: 'statusDescription',
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
