import React from 'react';

import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import BusinessFormItemCascader from '@/components/Smart/BusinessFormItemCascader';

import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { BaseFormModelType, OnChangeFnType } from '@/types';
import { machineResult, manualResult } from '@/data/constants';
import { IvmProps } from '../index';

const initFormSchema = (
  material_type: number[],
  handleCascaderItem?: (value: any, casForm: any) => void,
  filterOptions?: Partial<IvmProps>,
) => {
  const formModel: Array<BaseFormModelType> = [
    {
      type: 'component',
      renderComponent: React.createElement(BusinessFormItemCascader, {
        material_type,
        isSearch: true,
        callback: (value: any, casForm: any) =>
          handleCascaderItem && handleCascaderItem(value, casForm),
      }),
    },
    {
      label: '入库时间',
      name: 'insertTime',
      type: 'rangePicker',
      timeKey: ['receiveTimeStart', 'receiveTimeEnd'],
      formateTime: DATE_FORMAT_SS,
    },
    {
      label: '审核时间',
      name: 'reviewTime',
      type: 'rangePicker',
      timeKey: ['auditTimeStart', 'auditTimeEnd'],
      formateTime: DATE_FORMAT_SS,
    },
    {
      label: '模型标记',
      name: 'machineLabels',
      sourceData: [],
      type: 'multiple',
    },
    {
      label: '关键词分类',
      name: 'sensitiveCategories',
      sourceData: [],
      type: 'cascader',
      fieldNames: { label: 'categoryName', value: 'categoryId', children: 'category' },
      width: 260,
    },
    {
      label: '命中关键词',
      name: 'sensitiveWords',
      type: 'text',
    },
    // {
    //   label: '审核结果',
    //   name: 'auditResult',
    //   sourceData: [],
    //   type: 'select',
    //   onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
    //     return fn && fn({ manualLabels: value });
    //   },
    // },
    {
      label: '机审结果',
      name: 'machineAuditResult',
      sourceData: machineResult,
      type: 'select',
    },
    {
      label: '人审结果',
      name: 'manualAuditResult',
      sourceData: manualResult,
      type: 'select',
      onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
        return fn && fn({ manualLabels: value });
      },
    },
    {
      label: '人审标签',
      name: 'manualLabels',
      sourceData: [],
      type: 'multiple',
    },
    {
      label: '内容',
      name: 'objectId',
      type: 'text',
      isReplaceName: true,
      preSelect: [
        {
          label: '内容ID',
          value: 'objectId',
        },
        {
          label: '正文',
          value: 'content',
        },
        {
          label: '标题',
          value: 'title',
        },
      ],
    },
    {
      type: 'component',
      renderComponent: React.createElement(AuditUserSelect, {
        selectProps: {
          label: '审核员',
          name: 'auditorId',
        },
      }),
    },
    {
      label: 'userid', // 作者
      name: 'articleAuthorId',
      type: 'text',
    },
    {
      label: '查询',
      type: 'button',
      buttonName: '历史查询按钮',
    },
  ];
  // 先根据传进来的filterFormKey来过滤掉不需要的数据
  const filterData = filterOptions?.filterFormKey
    ? formModel.filter(item => {
        if (
          !filterOptions?.filterFormKey
            ?.split(',')
            .includes(typeof item?.name === 'string' ? item?.name : '')
        ) {
          return item;
        }
      })
    : formModel;

  // 然后在根据字段增加需要改变的部分
  filterOptions?.replaceFormItems?.items &&
    filterData?.splice(
      filterOptions?.replaceFormItems?.index!,
      0,
      ...(filterOptions?.replaceFormItems?.items || []),
    );
  return filterData;
};

export default initFormSchema;
