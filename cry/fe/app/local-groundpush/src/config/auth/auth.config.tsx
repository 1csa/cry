import React from 'react';
import { Popconfirm, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { TeamProps } from './auth.d';

interface GenTeamColumn {
  (handleInfoChange: (record: TeamProps)=>void): ColumnProps<TeamProps>[]
}

export const TeamCnKeyMap = {
  teamName: "团队名称",
  id: "团队编号",
  leaderName: '负责人',
  leaderPhone: '负责人电话',
  leaderWx: '负责人微信',
  responser: "负责人(姓名|电话|WX)",
  citys: '地推城市',
  cooperationStartTime: '合作开始时间',
  cooperationEndTime: '合作结束时间',
  status: '当前状态',
  stopReason: '停止服务原因'
};

export const genTeamColumn: GenTeamColumn =(handleInfoChange)=>{
  const TeamColumn: ColumnProps<TeamProps>[] = [{
    title: '团队名称',
    dataIndex: 'teamName',
    width: '8%',
  }, {
    title: '团队编号',
    dataIndex: 'id',
    width: '8%'
  }, {
    title: '负责人(姓名|电话|WX)',
    dataIndex: 'responser',
    width: '18%',
    render: (_,  record)=><div>
      <span style={{marginRight: 3}}>{`${record.leaderName} | ${record.leaderPhone} | ${record.leaderWx || '--'}`}</span>
      <Button type="link" size="small" style={{padding: 0}} onClick={()=>handleInfoChange(record)}>修改信息</Button>
    </div>
  }, {
    title: '地推城市',
    dataIndex: 'city',
    width: '8%',
    render: (_, record) =><span>{
      record.citys && record.citys.length !== 0 ? record.citys.map(city=>city.cityName).join(',') : '--'
    }</span>
  }, {
    title: '合作开始',
    dataIndex: 'cooperationStartTime',
    width: '17%',
    sorter: true
  }, {
    title: '合作结束',
    dataIndex: 'cooperationEndTime',
    width: '17%',
    render: (text)=><span>{text || '--'}</span>
  }, {
    title: '状态',
    dataIndex: 'status',
    width: '7%',
    align: 'center',
    render: (_, record: TeamProps)=>record.status === 0 ? '停止服务' : '服务中'
  }, {
    title: '原因',
    dataIndex: 'stopReason',
    render: (_, record: TeamProps)=>record.stopReason && record.status !== 1 ? record.stopReason : '--'
  }];

  return TeamColumn
}
