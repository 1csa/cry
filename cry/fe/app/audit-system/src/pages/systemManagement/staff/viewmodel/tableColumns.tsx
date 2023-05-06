import React from 'react';

import { Badge, Button } from 'antd';

import { Status } from './config';

const getColumns = (operation?: any) => {
  const baseColumns = [
    {
      title: '用户ID',
      dataIndex: 'pandoraId',
      key: 'pandoraId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '账号状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (value: any) => {
        const item = Status.find(item => item.value === value);
        // @ts-ignore
        return item && <Badge status={item.status} text={item.label} />;
      },
    },
    {
      title: '工号',
      dataIndex: 'workNo',
      key: 'workNo',
    },
    {
      title: '组织',
      dataIndex: 'isOutsource',
      key: 'isOutsource',
      render: (value: 0 | 1) => {
        return value === 1 ? (
          <Button type="text" danger style={{ paddingLeft: 0, paddingRight: 0 }}>
            外包
          </Button>
        ) : (
          <Button type="text" style={{ paddingLeft: 0, paddingRight: 0 }}>
            一点
          </Button>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      key: 'roles',
      render: (record: any) => {
        const { isOperatorManager, isBusinessManager, isPartzoneOperator } = record;
        const roles = [];
        isOperatorManager === 1 && roles.push('系统管理员');
        isBusinessManager === 1 && roles.push('子业务管理员');
        isPartzoneOperator === 1 && roles.push('分区管理员');
        return roles.join('、');
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      key: 'gmtUpdate',
    },
    {
      title: '操作人',
      dataIndex: 'operatorUpdate',
      key: 'operatorUpdate',
    },
  ];

  return [...baseColumns, operation];
};

export default getColumns;
