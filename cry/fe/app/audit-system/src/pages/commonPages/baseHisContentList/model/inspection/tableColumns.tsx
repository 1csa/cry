import React from 'react';
import { Tooltip } from 'antd';

import { parseUserResultData } from '@/components/BusinessLogic/parseReshowData';

import { TableItemType } from '@/types';
import { formateTime, isJSON } from '@/utils/dev_helper';
import { allQualityLabels, aging } from '@/data/articleQuality';
import { reviewStatus } from '@/data/constants';
import { AnyArray } from 'immer/dist/internal';

export const parseQualityLabels = (userResult: any) => {
  const reason: string[] = parseUserResultData(userResult)?.reason || [];
  const finallyResult: string[] = [];
  allQualityLabels?.forEach(item => {
    reason.forEach(ele => {
      if (ele === item.value) {
        finallyResult.push(item.label);
      }
    });
  });
  return finallyResult.join('、');
};

const initTableList: TableItemType[] = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (_: any, record: any) => {
      const { title } = isJSON(record.material?.materialBefore) ? JSON.parse(record.material.materialBefore) ?? { title: '' } : { title: '' };
      return (
        <div className="clamp3" style={{ WebkitBoxOrient: 'vertical' }}>
          <Tooltip title={title}>{title}</Tooltip>
        </div>
      );
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
    title: (
      <>
        入库时间
        <br />
        发布时间
      </>
    ),
    dataIndex: 'time_receive',
    key: 'time_receive',
    width: 120,
    render: (_: any, record: any) => {
      return (
        <>
          {record.time_receive ? formateTime(record.time_receive) : '--'}
          <br />
          {record.releaseTime ? formateTime(record.releaseTime) : '--'}
        </>
      );
    },
  },
  {
    title: (
      <>
        时效性
        <br />
        一审
      </>
    ),
    dataIndex: 'timeliness',
    key: 'timeliness',
    render: (_: any, record: any) => {
      // 质检结果 result_l1
      // 一审结果 result_l2
      return (
        <>
          {aging.find(item => item.value === parseUserResultData(record?.result_l1)?.timeliness)?.label ?? '--'}
          <br />
          {aging.find(item => item.value === parseUserResultData(record?.result_l2)?.timeliness)?.label ?? '--'}
        </>
      );
    },
  },
  {
    title: (
      <>
        审核状态
        <br />
        一审
      </>
    ),
    dataIndex: 'status',
    key: 'status',
    render: (_: any, record: any) => {
      // 质检结果 result_l1
      // 一审结果 result_l2
      return (
        <span>
          {reviewStatus(record?.result_l1?.status) ?? '--'}
          <br />
          {reviewStatus(record?.result_l2?.status) ?? '--'}
        </span>
      );
    },
  },
  {
    title: (
      <>
        质量分数
        <br />
        一审
      </>
    ),
    dataIndex: 'score',
    key: 'score',
    render: (text: string, record: any) => {
      // 质检结果 result_l1
      // 一审结果 result_l2
      return (
        <>
          {parseUserResultData(record?.result_l1)?.score ?? '--'}
          <br />
          {parseUserResultData(record?.result_l2)?.score ?? '--'}
        </>
      );
    },
  },
  {
    title: (
      <>
        质量标签
        <br />
        一审
      </>
    ),
    dataIndex: 'qualityLabels',
    key: 'qualityLabels',
    render: (_: any, record: any) => {
      // 质检结果 result_l1
      // 一审结果 result_l2
      return (
        <>
          {parseQualityLabels(record?.result_l1) || '--'}
          <br />
          {parseQualityLabels(record?.result_l2) || '--'}
        </>
      );
    },
  },
  {
    title: (
      <>
        是否与
        <br />
        初审一致
      </>
    ),
    dataIndex: 'last_same_sign',
    key: 'last_same_sign',
    render: (text: any, record: any) => {
      return text ? '是' : '否';
    },
  },
  {
    title: '审核员',
    dataIndex: 'user',
    key: 'user',
    render: (_: any, record: any) => {
      return record.auditor_id_l3 || record.auditor_id_l2 || record.auditor_id_l1;
    },
  },
  {
    title: '被质检人',
    dataIndex: 'inspection_user',
    key: 'inspection_user',
    render: (_: any, record: any) => {
      return record.material?.sampledAuditName ?? '--';
    },
  },
];

export const filterTableKey = 'title,tmmanul,machine_status,stageText,manual_status,machine_result,manual_status,user';
export const replaceTableItem = initTableList;
