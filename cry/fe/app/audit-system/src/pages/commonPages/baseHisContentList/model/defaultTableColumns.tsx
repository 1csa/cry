import React from 'react';
import { Tooltip } from 'antd';

import parseColumns from '@/components/BusinessLogic/tableColumnsParse';

import { reviewStatus } from '@/data/constants';
import { formateTime } from '@/utils/dev_helper';
import { ColumnsType } from '@/types';
import { IvmProps } from '../index';

/**
 * 组合列表项的方法。优化点 ==》可以根据传递的参数随意拼接columns
 * 觉得不方便的话可以传递一个有顺序的字段的数组，从集合里筛选出来按照传入的字段顺序重新拼接
 * @param operation 可操作项
 */
const getColumns = (columnsOptions: ColumnsType, filterOptions?: Partial<IvmProps>) => {
  const { columns, operation } = columnsOptions;

  const initTableList = [
    ...(columns || []),
    ...[
      {
        title: '内容ID',
        dataIndex: 'docid',
        key: 'docid',
      },
      {
        title: '分区',
        dataIndex: 'part_zone_cn',
        key: 'part_zone_cn',
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text: string) => (
          <div className="clamp3" style={{ WebkitBoxOrient: 'vertical' }}>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        ),
      },
      {
        title: '机审结果',
        dataIndex: 'machine_status',
        key: 'machine_status',
        render: (machine_status: number) => {
          return <span>{reviewStatus(machine_status)}</span>;
        },
      },
      {
        title: '审核阶段',
        dataIndex: 'stageText',
        key: 'stageText',
      },
      {
        title: '人审结果',
        dataIndex: 'manual_status',
        key: 'manual_status',
        render: (text: number, record: any) => {
          return <span>{parseColumns.getAuditResult(record, text)}</span>;
        },
      },
      {
        title: '机审标签',
        dataIndex: 'machine_result',
        key: 'machine_result',
        ellipsis: true,
        render: (machine_result: any) => {
          return (
            <Tooltip placement="topLeft" title={parseColumns.getMachineResult(machine_result)}>
              <span>{parseColumns.getMachineResult(machine_result).substring(0, 10)}</span>
            </Tooltip>
          );
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
      {
        title: '审核时间',
        dataIndex: 'tmmanul',
        key: 'tmmanul',
        render: (tmmanul: number) => {
          return formateTime(tmmanul);
        },
      },
      {
        title: '审核员',
        dataIndex: 'user',
        key: 'user',
        render: (user: string, record: any) => {
          return record.auditor_id_l3 || record.auditor_id_l2 || record.auditor_id_l1;
        },
      },
    ],
    ...operation,
  ];

  // 先按照key过滤掉不需要的，再按照items增加新的
  const filterTableData = filterOptions?.filterTableKey
    ? initTableList.filter(item => {
        const [...keys] = filterOptions?.filterTableKey?.split(',') || [];
        if (!keys.includes(item.key)) {
          return item;
        }
      })
    : initTableList;

  filterOptions?.replaceTableItems?.items &&
    filterTableData.splice(filterOptions?.replaceTableItems?.index, 0, ...(filterOptions?.replaceTableItems?.items || []));

  return filterTableData;
};

export default getColumns;
