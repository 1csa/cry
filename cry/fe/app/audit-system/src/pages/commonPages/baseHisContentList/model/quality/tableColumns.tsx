import React from 'react';

import parseColumns from '@/components/BusinessLogic/tableColumnsParse';
import { parseUserReviewResult } from '@/components/BusinessLogic/parseReshowData';

import { allQualityLabels, aging } from '@/data/articleQuality';
import { formateTime } from '@/utils/dev_helper';
import { TableItemType } from '@/types';

export const parseQualityLabels = (record: any) => {
  const reason: string[] = parseUserReviewResult(record)?.reason || [];
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
    title: '入库时间',
    dataIndex: 'time_receive',
    key: 'time_receive',
    render: (time_receive: number) => {
      return formateTime(time_receive);
    },
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: number, record: any) => {
      return <span>{parseColumns.getAuditResult(record, text)}</span>;
    },
  },
  // {
  //   title: '文章属性',
  //   dataIndex: 'articleProperty',
  //   key: 'articleProperty',
  //   render: (text: string, record: any) => {
  //     return <>{articleAttr.find(item => item.value === parseUserReviewResult(record)?.articleAttr)?.label}</>;
  //   },
  // },
  {
    title: '时效性',
    dataIndex: 'timeliness',
    key: 'timeliness',
    render: (text: string, record: any) => {
      return <>{aging.find(item => item.value === parseUserReviewResult(record)?.timeliness)?.label}</>;
    },
  },
  {
    title: '发布时间',
    key: 'releaseTime',
    render: (record: any) => record?.material?.attr?.time ?? '',
  },
  {
    title: '质量分数',
    dataIndex: 'qualityScore',
    key: 'qualityScore',
    render: (text: string, record: any) => {
      return <>{parseUserReviewResult(record)?.score}</>;
    },
  },
  {
    title: '质量标签',
    dataIndex: 'qualityLabels',
    key: 'qualityLabels',
    render: (text: string, record: any) => {
      return <>{parseQualityLabels(record)}</>;
    },
  },
];

export const filterTableKey = 'part_zone_cn,machine_status,stageText,manual_status,machine_result';
// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
export const replaceTableItem = initTableList;
