import React from 'react';

import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import AuditEmailSelect from '@/components/Smart/AuditEmailSelect';

import { BaseFormModelType } from '@/types';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';
import { Status, Roles } from './config';

const formModel: Array<BaseFormModelType> = [
  {
    label: '用户ID',
    name: 'pandoraId',
    type: 'text',
  },
  {
    type: 'component',
    renderComponent: React.createElement(AuditUserSelect, {
      selectProps: {
        label: '姓名',
        name: 'name',
      },
    }),
  },
  {
    label: '账号状态',
    name: 'isEnabled',
    type: 'select',
    sourceData: Status,
  },
  {
    label: '工号',
    name: 'workNo',
    type: 'text',
  },
  {
    label: '角色',
    name: 'role',
    type: 'select',
    sourceData: Roles,
  },
  {
    label: '创建时间',
    name: 'createTime',
    type: 'rangePicker',
    timeKey: ['gmtCreateStartTime', 'gmtCreateEndTime'],
    formateTime: DATE_FORMAT_SS,
  },
  {
    label: '更新时间',
    name: 'updateTime',
    type: 'rangePicker',
    timeKey: ['gmtUpdateStartTime', 'gmtUpdateEndTime'],
    formateTime: DATE_FORMAT_SS,
  },
  {
    type: 'component',
    renderComponent: React.createElement(AuditEmailSelect, {
      selectProps: {
        label: '邮箱',
        name: 'email',
      },
    }),
  },
  {
    type: 'component',
    renderComponent: React.createElement(AuditUserSelect, {
      selectProps: {
        label: '操作人',
        name: 'operator',
      },
    }),
  },
  {
    label: '查询',
    type: 'button',
  },
];

export default formModel;
