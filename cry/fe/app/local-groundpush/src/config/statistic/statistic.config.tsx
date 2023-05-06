import React from 'react';
import { ColumnProps } from 'antd/es/table';
import { TeamProps, UserProps } from './statistic';
import { parseLongFloat } from '@/utils/dev_helper';

export const TeamCnkeyMap = {
  timeKey: '日期',
  teamName: '团队名称',
  teamId: '团队编号',
  activationCount: '有效激活设备',
  effectiveUidCount: '有效激活uid',
  cheaterCount: '无效激活设备',
  cheaterUidCount: '无效激活uid',
  antiCheatCount: '作弊用户',
  tdCheatCount: '激活条件不合规',
  oldDeviceCount: '重复设备',
  oneDayRetention: '次日留存',
  sevenDayRetention: '7日留存',
  thirtyDayRetention: '30日留存',
};

export const TeamColumn: ColumnProps<TeamProps>[] = [
  {
    title: '日期',
    dataIndex: 'timeKey',
    width: '11%',
    align: 'center',
    sorter: true,
  },
  {
    title: '团队',
    dataIndex: 'teamName',
    align: 'center',
    width: '8%',
  },
  {
    title: '团队编号',
    dataIndex: 'teamId',
    align: 'center',
    width: '6%',
  },
  {
    title: '有效激活(去重)',
    dataIndex: 'effectiveActivation',
    align: 'center',
    children: [
      {
        title: '有效激活设备',
        dataIndex: 'activationCount',
        width: '8%',
        align: 'center',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
      {
        title: '有效激活uid',
        dataIndex: 'effectiveUidCount',
        width: '10%',
        align: 'center',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
    ],
  },
  {
    title: '无效激活(去重)',
    dataIndex: 'invalidActivation',
    children: [
      {
        title: '无效激活设备',
        dataIndex: 'cheaterCount',
        align: 'center',
        width: '8%',
      },
      {
        title: '无效激活uid',
        dataIndex: 'cheaterUidCount',
        width: '10%',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
    ],
  },
  {
    title: '无效理由(未去重, 按uid)',
    dataIndex: 'invalidReason',
    children: [
      {
        title: '作弊用户',
        dataIndex: 'antiCheatCount',
        width: '6%',
        align: 'center',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
      {
        title: '激活条件不合规',
        dataIndex: 'tdCheatCount',
        align: 'center',
        width: '8%',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
      {
        title: '重复设备',
        dataIndex: 'oldDeviceCount',
        align: 'center',
        width: '6%',
        render: count => <span>{count === undefined ? '--' : count}</span>,
      },
    ],
  },
  {
    title: '留存率(给予有效激活设备)',
    dataIndex: 'performance',
    children: [
      {
        title: '次日留存',
        dataIndex: 'oneDayRetention',
        align: 'center',
        width: '6%',
        render: retention => (
          <span>
            {retention === undefined
              ? '--'
              : retention === 0
              ? retention
              : `${parseLongFloat(100 * retention)}%`}
          </span>
        ),
      },
      {
        title: '7日留存',
        dataIndex: 'sevenDayRetention',
        align: 'center',
        width: '6%',
        render: retention => (
          <span>
            {retention === undefined
              ? '--'
              : retention === 0
              ? retention
              : `${parseLongFloat(100 * retention)}%`}
          </span>
        ),
      },
      {
        title: '30日留存',
        dataIndex: 'thirtyDayRetention',
        align: 'center',
        width: '6%',
        render: retention => (
          <span>
            {retention === undefined
              ? '--'
              : retention === 0
              ? retention
              : `${parseLongFloat(100 * retention)}%`}
          </span>
        ),
      },
    ],
  },
];

export const UserCnKeyMap = {
  timeKey: '日期',
  teamName: '团队名称',
  teamId: '团队编号',
  userId: 'uid',
  appVersion: '版本号',
  // brand: '机型',
  os: '机型',
  activationTime: '激活时间',
  activationPlace: '激活地点',
};

export const effectiveStatusMap = {
  '0': '待定',
  '1': '有效',
  '-1': '无效',
};

export const UserColumn: ColumnProps<UserProps>[] = [
  {
    title: '日期',
    dataIndex: 'timeKey',
    sorter: true,
    align: 'center',
    width: '11%',
  },
  {
    title: '团队名称',
    dataIndex: 'teamName',
    align: 'center',
    width: '8%',
  },
  {
    title: '团队编号',
    dataIndex: 'teamId',
    align: 'center',
    width: '6%',
  },
  {
    title: '地推员',
    dataIndex: 'pushManName',
    align: 'center',
    width: '7%',
  },
  {
    title: '地推员uid',
    dataIndex: 'pushManId',
    align: 'center',
    width: '7%',
  },
  {
    title: '激活设备uid',
    dataIndex: 'userId',
    align: 'center',
    width: '8%',
  },
  {
    title: '是否有效',
    dataIndex: 'effectStatus',
    align: 'center',
    width: '6%',
    render: text => (text === undefined ? '--' : effectiveStatusMap[text]),
  },
  {
    title: '原因',
    dataIndex: 'cheatReason',
    align: 'center',
    render: text => (text && text.length > 0 ? text : '--'),
  },
  {
    title: '版本号',
    dataIndex: 'appVersion',
    align: 'center',
    width: '7.5%',
    render: version => <span>{version && version.trim().length !== 0 ? version : '--'}</span>,
  },
  {
    title: '机型',
    dataIndex: 'os',
    align: 'center',
    width: '7.5%',
    // render: (brand)=><span>{brand && brand.trim().length !== 0 ? brand : '--'}</span>
    render: os => <span>{os === undefined ? '--' : os === 0 ? 'IOS' : 'Android'}</span>,
  },
  {
    title: '激活时间',
    dataIndex: 'activationTime',
    width: '11%',
    render: time => <span>{time && time.trim().length !== 0 ? time : '--'}</span>,
  },
  {
    title: '激活地点(city|lat|lng)',
    dataIndex: 'activationPlace',
    width: '12.5%',
    render: (_, { city, lat, lng }) => {
      return (
        <span>{`${city || '--'} | ${lat ? parseFloat(lat).toFixed(3) : '--'} | ${
          lng ? parseFloat(lng).toFixed(3) : '--'
        }`}</span>
      );
    },
  },
];
