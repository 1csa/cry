import React from 'react';
export const rangeColumns: any[] = [
  {
    title: '渠道名称',
    dataIndex: 'channel_name',
    key: 'channel_name',
    fixed: 'left',
  },
  {
    title: '渠道类型',
    dataIndex: 'channel_category',
    key: 'channel_category',
    fixed: 'left',
  },
  {
    title: '渠道号',
    dataIndex: 'distribution_channel_actual1',
    key: 'distribution_channel_actual1',
    fixed: 'left',
  },
  {
    title: '初始激活',
    dataIndex: 'new_user',
    key: 'new_user',
  },
  {
    title: '实际有效激活',
    dataIndex: 'normal_user',
    key: 'normal_user',
  },
  {
    title: '平均激活成本',
    dataIndex: 'avg_cost',
    key: 'avg_cost',
  },
  {
    title: '花费',
    dataIndex: 'total_cost',
    key: 'total_cost',
  },
  {
    title: '次留',
    dataIndex: 'new_user_liucun1',
    key: 'new_user_liucun1',
  },
  {
    title: '去黑次留',
    dataIndex: 'drop_abnormal_user_liucun1',
    key: 'drop_abnormal_user_liucun1',
  },
  {
    title: '去黑启动',
    dataIndex: 'drop_abnormal_session_launch',
    key: 'drop_abnormal_session_launch',
  },
  {
    title: '去黑时长(秒)',
    dataIndex: 'drop_normal_online_time',
    key: 'drop_normal_online_time',
    render: (text: string) => {
      return <div>
        {text ? (text+'').replace(/(?!^)(?=(\d{3})+$)/g, ',') : text}
      </div>
      }
  },
  {
    title: '黑',
    dataIndex: 'abnormal_user',
    key: 'abnormal_user',
    width: 60,
  },
  {
    title: '白',
    dataIndex: 'normal_user_n',
    key: 'normal_user_n',
    width: 80,
  },
  {
    title: '灰',
    dataIndex: 'suspect_user',
    key: 'suspect_user',
    width: 60,
  },
];
export const dayColumns: any[] = [
  {
    title: '日期',
    dataIndex: 'p_day',
    key: 'p_day',
    fixed: 'left',
  },
  {
    title: '渠道名称',
    dataIndex: 'channel_name',
    key: 'channel_name',
    fixed: 'left',
  },
  {
    title: '渠道类型',
    dataIndex: 'channel_category',
    key: 'channel_category',
    fixed: 'left',
  },
  {
    title: '渠道号',
    dataIndex: 'distribution_channel_actual1',
    key: 'distribution_channel_actual1',
    fixed: 'left',
  },
  {
    title: '初始激活',
    dataIndex: 'new_user',
    key: 'new_user',
  },
  {
    title: '实际有效激活',
    dataIndex: 'normal_user',
    key: 'normal_user',
  },
  {
    title: '平均激活成本',
    dataIndex: 'avg_cost',
    key: 'avg_cost',
  },
  {
    title: '花费',
    dataIndex: 'total_cost',
    key: 'total_cost',
  },
  {
    title: '次留',
    dataIndex: 'new_user_liucun1',
    key: 'new_user_liucun1',
  },
  {
    title: '去黑次留',
    dataIndex: 'drop_abnormal_user_liucun1',
    key: 'drop_abnormal_user_liucun1',
  },
  {
    title: '去黑启动',
    dataIndex: 'drop_abnormal_session_launch',
    key: 'drop_abnormal_session_launch',
  },
  {
    title: '去黑时长(秒)',
    dataIndex: 'drop_normal_online_time',
    key: 'drop_normal_online_time',
    render: (text: string) => (
      <div>
        {text ? (text+'').replace(/(?!^)(?=(\d{3})+$)/g, ',') : text}
      </div>)
  },
  {
    title: '黑',
    dataIndex: 'abnormal_user',
    key: 'abnormal_user',
    width: 60,
  },
  {
    title: '白',
    dataIndex: 'normal_user_n',
    key: 'normal_user_n',
    width: 80,
  },
  {
    title: '灰',
    dataIndex: 'suspect_user',
    key: 'suspect_user',
    width: 60,
  },
];