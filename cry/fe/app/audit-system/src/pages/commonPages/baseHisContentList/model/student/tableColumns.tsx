import React from 'react';
import { TableItemType } from '@/types';
import { formateTime } from '@/utils/dev_helper';
import parseColumns from '@/components/BusinessLogic/tableColumnsParse';

const initTableList: TableItemType[] = [
  {
    title: '用户ID',
    dataIndex: ['material', 'applicant', 'id'],
    key: 'id',
  },
  {
    title: '用户昵称',
    dataIndex: ['material', 'applicant', 'nickname'],
    key: 'nickname',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: number, record: any) => {
      return <span>{parseColumns.getAuditResult(record, text)}</span>;
    },
  },
  {
    title: '入库时间',
    dataIndex: 'time_receive',
    key: 'time_receive',
    render: (time_receive: number) => {
      return formateTime(time_receive);
    },
  },
];

export const filterTableKey =
  'docid,part_zone_cn,title,machine_status,stageText,machine_result,user';
export const replaceTableItem = initTableList;
