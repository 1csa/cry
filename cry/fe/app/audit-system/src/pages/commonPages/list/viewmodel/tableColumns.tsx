import React from 'react';
import { ColumnsType } from '@/types';
import { formateTime } from '@/utils/dev_helper';
import parseColumns from '@/components/BusinessLogic/tableColumnsParse';

/**
 * 组合列表项的方法。优化点 ==》可以根据传递的参数随意拼接columns
 * @param operation 可操作项
 */
const getColumns = (columnsOptions: ColumnsType) => {
  const { columns, operation } = columnsOptions;
  return [
    ...(columns || []),
    ...[
      {
        title: '审核状态',
        dataIndex: 'machine_status',
        key: 'machine_status',
        render: (text: number, record: any) => {
          return <span>{parseColumns.getAuditResult(record, text)}</span>;
        },
      },
      {
        title: '进审时间',
        dataIndex: 'time_receive',
        key: 'time_receive',
        render: (time_receive: number) => {
          return formateTime(time_receive);
        },
      },
      {
        title: '审核时间',
        dataIndex: 'tmmanul',
        key: 'tmmanul',
        render: (tmmanul: number) => {
          return formateTime(tmmanul);
        },
      },
      {
        title: '机审标签',
        dataIndex: 'machine_result',
        key: 'machine_result',
        render: (machine_result: any) => {
          return <span>{parseColumns.getMachineResult(machine_result)}</span>;
        },
      },
      {
        title: '人审标签',
        dataIndex: 'manual_status',
        key: 'manual_status',
        render: (text: number, record: any) => {
          return <span>{parseColumns.getManualResult(record)}</span>;
        },
      },
    ],
    ...operation,
  ];
};

export { getColumns };
