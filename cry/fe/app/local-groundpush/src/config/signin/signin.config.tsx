import React from 'react';
import moment from 'moment';
import { ColumnProps } from 'antd/es/table';
import { signIn_data } from '@/pages/sign/components/index.d';
export const SignInColumn: ColumnProps<signIn_data>[] = [
    {
      title: '日期',
      dataIndex: 'signInDate',
      key: 'signInDate',
      render: (signinDate)=>moment(signinDate).format('YYYY-MM-DD')
    },
    {
      title: '团队名称',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: '团队编号',
      dataIndex: 'teamId',
      key: 'teamId',
    },
    {
      title: '姓名',
      dataIndex: 'pushManName',
      key: 'pushManName',
    },
    {
      title: '编号ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'uid',
      dataIndex: 'pushManId',
      key: 'pushManId',
    },
    {
      title: '签入时间',
      dataIndex: 'signInTime',
      key: 'signInTime',
      render: (signinTime)=>signinTime ? moment(signinTime).format('HH:mm:ss') : '--'
    },
    {
      title: '签入地点(地点|经|纬)',
      dataIndex: 'signInDate',
      key: 'signinAddr',
      render: (_, record)=><span>{
        `${
          record.address || '--'
        } | ${
          record.latIn ? parseFloat(record.latIn).toFixed(3) : '--'
        } | ${
          record.lngIn ? parseFloat(record.lngIn).toFixed(3) : '--'
        }`
      }</span>
    },
    {
      title: '签出时间',
      dataIndex: 'signOutDate',
      key: 'signOutDate',
      render: (signinDate)=>signinDate ? moment(signinDate).format('HH:mm:ss') : '--'
    },
    {
      title: '签出地点(经|纬)',
      dataIndex: 'sigoutAddr',
      render: (_, record)=><span>{
        `${
          record.latOut ? parseFloat(record.latOut).toFixed(3) : '--'
        } | ${
          record.lngOut ? parseFloat(record.lngOut).toFixed(3) : '--'
        }`
      }</span>
    }
  ];
  export const SignInKeyMap = {
    signInTime: '日期',
    teamName: '团队名称',
    teamId: '团队编号',
    pushManId: 'uid',
    pushManName: '姓名',
    id: '编号ID',
    signInDate:"签到时间",
    signOutDate:"签出时间",
    address:"签出地点"
  };
