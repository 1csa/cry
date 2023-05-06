import React from 'react';
import { TableItemType } from '@/types';
import { formateTime, isJSON } from '@/utils/dev_helper';
import parseColumns from '@/components/BusinessLogic/tableColumnsParse';

export const parseClassificationTag = (result: any) => {
  const labels =
    typeof result !== 'string'
      ? Array.isArray(result?.labels) && result?.labels.length > 0 && result?.labels[0]
      : {};
  const tag = labels?.tags?.map((item: any) => {
    return item?.dimensions.map((ele: any) => ele?.tags);
  });
  const machineTags = labels?.machineTags || '';
  const userUploadTags = labels?.userUploadTags || '';
  if (!tag) {
    return '';
  }
  const saftyTags = labels.saftyTags || '';
  const notSaftyTags = tag || '';

  return `${machineTags?.toString()},${userUploadTags?.toString()},${notSaftyTags.toString()},${saftyTags.toString()}`
    .split(',')
    .filter(e => e)
    .join('、');
};

export const parseCategory = (_result: any) => {
  if (_result) {
    const result = isJSON(_result) ? JSON.parse(_result) : _result;
    const labels = Array.isArray(result?.labels) && result?.labels.length > 0 && result?.labels[0];
    return `${labels?.bigCategory ?? ''} - ${labels?.smallCategory ?? ''}`;
  } else {
    return '';
  }
};

const initTableList: TableItemType[] = [
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: number, record: any) => {
      return <span>{parseColumns.getAuditResult(record, text)}</span>;
    },
  },
  {
    title: '分类',
    dataIndex: 'categoryLabels',
    key: 'categoryLabels',
    render: (text: number, record: any) => {
      // const result = record.result_l3 || record.result_l2 || record.result_l1;
      // const labels =
      //   Array.isArray(result?.labels) && result?.labels.length > 0 && result?.labels[0];
      // return (
      //   <span>
      //     {labels?.bigCategory} - {labels?.smallCategory}
      //   </span>
      // );
      const result = record.result_l3 || record.result_l2 || record.result_l1;
      return <span>{parseCategory(result)}</span>;
    },
  },
  {
    title: '标签',
    dataIndex: 'tag',
    key: 'tag',
    render: (text: number, record: any) => {
      const result = record.result_l3 || record.result_l2 || record.result_l1;
      return <span>{parseClassificationTag(result)}</span>;
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

export const filterTableKey = 'machine_status,stageText,manual_status,machine_result';
// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
export const replaceTableItem = initTableList;
