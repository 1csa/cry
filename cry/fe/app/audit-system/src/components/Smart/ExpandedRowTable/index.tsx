/**
 * 嵌套表格中的子表格
 * 这块因为接口的数据会一次性给到 所以需要处理数据
 */

import React from 'react';
import { Table, Tooltip } from 'antd';
import { formateTime } from '@/utils/dev_helper';
import { reviewStatus } from '@/data/constants';
import parseColumns from '@/components/BusinessLogic/tableColumnsParse';

interface IExpandedRowTableProps {
  expandedTableSource: any[];
}

const ExpandedRowTable: React.FC<IExpandedRowTableProps> = ({ expandedTableSource }) => {
  const columns = [
    {
      title: '审核阶段',
      dataIndex: 'stageText',
      key: 'stageText',
    },
    {
      title: '审核时间',
      dataIndex: 'commitTime',
      key: 'commitTime',
      render: (commitTime: number) => {
        return commitTime ? formateTime(commitTime) : '';
      },
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
    },
    {
      title: '审核结果',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return <span>{reviewStatus(status)}</span>;
      },
    },
    {
      title: '人审标签',
      dataIndex: 'result',
      key: 'result',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <Tooltip placement="topLeft" title={parseColumns.getManualResult(record, record.material_type)}>
            <span>{parseColumns.getManualResult(record, record.material_type).substring(0, 10)}</span>
          </Tooltip>
        );
      },
    },
  ];

  return <Table bordered rowKey="claimTime" columns={columns} dataSource={expandedTableSource} pagination={false} />;
};

export default ExpandedRowTable;
