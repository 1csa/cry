import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Select, Popconfirm, message } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';

import { ConnectState, Dispatch, OtherModelState, UserModelState } from '@/models/connect';
import { usePost, useUpdate } from '@/services/common';
import { exportData } from '@/utils/dev_helper';
import { YRadioButton, YSelect } from '@/components';
import { TableDataType } from '@/config/app.d';
import { genTeamColumn, TeamCnKeyMap } from '@/config/auth/auth.config.tsx';
import { TeamProps, TeamScreenParams } from '@/config/auth/auth.d';
import ResponserModal from './components/ResponserModal';
import AddteamModal from './components/AddTeam';
import './index.less';

interface TeamManagerProp {
  dispatch: Dispatch,
  others: OtherModelState,
  user: UserModelState
}

const AllCoStatus = [{name: "全部", value: undefined}, {name: '合作中', value: 1}, {name: '合作停止', value: 0}];
const stopReasion = ["用户留存质量不达标", "推广量效果不达标", "疑似出现作弊现象", "推广周期结束，正常终止", "突发情况，终止推广合作"];

const TeamManagerBoard: React.FC<TeamManagerProp> =({dispatch, others, user})=> {
  const { allTeams, allCities } = others;
  const { currentUser } = user;

  const { loading, data: teamData, fetchData: fetchTeamList } = usePost<TableDataType<TeamProps>>('/pushTeam/list');
  const { data: allTeamData, fetchData: fetchAllTeamList } = usePost<TableDataType<TeamProps>>('/pushTeam/list');
  const { updateData: updateStatus } = useUpdate('/pushTeam/updateStatusInfo');
  const [ teamList, setTeamList ] = useState<TeamProps[]>([]);
  const [ screenParams, setScreenParams ] = useState<Partial<TeamScreenParams>>({ limit: 10, offset: 0 });
  const [ teamOnChange, setTeamOnChange ] = useState<Partial<TeamProps>>({});
  const [ showInfoChange, setShowInfoChange ] = useState(false);
  const [ showAddteam, setShowAddteam] = useState(false);
  const [ stopReason, setStopReason ] = useState<string>();
  const [ showStopReason, setShowStopReason ] = useState(false);
  const [ download, setDownload ] = useState(false);

  const screenParamRef = useRef<Partial<TeamScreenParams>>({});

  const OperationColumn: ColumnProps<TeamProps> = {
    title: '操作',
    dataIndex: 'operation',
    width: '7%',
    render: (_, record)=><Popconfirm
      title={`确认${record.status === 0 ? '恢复': '终止'}合作？`}
      cancelText="取消" okText="确定" placement="leftBottom"
      onConfirm={()=>handleCoStatusChange(record)}
    ><a href="#">{record.status === 0 ? '恢复' : '终止'}</a></Popconfirm>
  }

  useEffect(()=>{
    if (!allTeams || allTeams.length === 0) {
      dispatch({type: 'others/fetchAllTeams'});
    }
    if( !allCities || allCities.length === 0) {
      dispatch({type: 'others/fetchAllCities'});
    }
    fetchTeamList(screenParams);
  }, []);

  useEffect(()=>{
    if ( !teamData ) { return; }
    setTeamList(teamData.list);
  }, [teamData]);

  useEffect(()=>{
    if (!download) {
      return;
    }

    fetchAllTeamList(screenParams);
  }, [download])

  useEffect(()=>{
    if (!download) {
      return;
    }

    try {
      exportData( allTeamData && allTeamData.list, "团队列表", downloadPredeal );
    } catch(err){
      message.error('出错了。。')
      console.log(err, "error happened in downloading....")
    }finally {
      setDownload(false);
    }
  }, [allTeamData])

  const downloadPredeal = ( dataSource: TeamProps)=>{
    let {
      id, teamName, leaderName, leaderPhone, leaderWx, cooperationStartTime, cooperationEndTime, status, stopReason, citys
    } = dataSource;
    let dataToTrans = {
      id, teamName, leaderName, leaderPhone, leaderWx,
      citys: citys && citys.length !== 0 ? citys.map(city=>city.cityName).join(',') : '--',
      cooperationStartTime, cooperationEndTime,
      status: status === 1 ? '服务中' : '停止服务',
      stopReason: status === 1 ? undefined : stopReason
    };

    let cnEntries = Object.entries(dataToTrans).map(([key, val])=>[TeamCnKeyMap[key], val]);
    return Object.fromEntries(cnEntries)
  }

  const handleChargerInfoChange= useCallback((record: TeamProps)=>{
    setTeamOnChange(record);
    setShowInfoChange(true);
  }, []);

  // 要么这里也采用fetchTable数据的方式，要么这个函数重写成传入参数数组和数值的形式和下方的终止数据时的表格变化作统一
  // 信息修改逻辑被拆分了，这部分用于表格信息的修改
  const handleCommitChange=useCallback((name: string, phone: string, weixin?: string)=>{
    let newTeamList = teamList.map((team)=>team.id !== teamOnChange.id ? team : {
        ...team, leaderName: name, leaderPhone: phone, leaderWx: weixin
      }
    );
    setTeamList(newTeamList);
    setShowInfoChange(false);
  }, [teamOnChange]);

  const handleQueryOn = useCallback(()=>{
    fetchTeamList({...screenParams});
  }, [screenParams]);

  const handleAddTeam = useCallback((teamName: string, teamNum: number)=>{
    fetchTeamList({offset: 0, limit: 10});
    dispatch({type: 'others/updateTeams', payload: {title: teamName, value: teamNum}});
  }, [])

  const handleCoStatusChange = useCallback((record: TeamProps)=>{
    if(record.status ===0) { // 当前状态是停止的，需要恢复
      updateStatus({
        id: record.id, status: 1
      }, ()=>fetchTeamList(screenParams));
    } else {
      setShowStopReason(true);
      setTeamOnChange(record);
    }
  }, [screenParams]);

  const handleConfirmStop = useCallback(()=>{
    updateStatus({ // 写死的数据，其实应该是有问题
      id: teamOnChange.id, status: 0, stopReason: stopReason
    },()=>{
      setStopReason(undefined);
      setShowStopReason(false);
      fetchTeamList(screenParams);
    });
  },[teamOnChange, screenParams, stopReason]);

  const handleTableChange = useCallback((
    { current =1, pageSize=10 }: PaginationConfig, _, { order }: SorterResult<TeamProps>
  )=>{
    let newScreenParams = {
      ...screenParamRef.current,
      limit: pageSize,
      offset: pageSize * (current -1),
      desc: order === 'ascend' ? 'asc' : undefined
    };
    setScreenParams(newScreenParams);
    fetchTeamList(newScreenParams);
  }, [screenParamRef]);

  return (
    <div className="teamAuth">
      <div className="teamAuth-header">
        <h3>团队查询</h3>
        <Button icon="plus" type="primary" size="small" onClick={()=>setShowAddteam(true)}>添加团队</Button>
      </div>
      <div className="teamAuth-operation">
        <div className="teamAuth-operation-screen">
          <YSelect
            className="teamAuth-operation-screen-item teamAuth-operation-screen-select"
            placeholder="请选择团队"
            mode="multiple"
            allowClear
            filter={true}
            options={allTeams || []}
            value={screenParams.teamIds}
            onChange={(val)=>setScreenParams({
              ...screenParams, teamIds: (val as number[]).length > 0 ? val as number[] : undefined
            })}
          />
          <YSelect
            className="teamAuth-operation-screen-item teamAuth-operation-screen-select"
            placeholder="请选择城市"
            mode="multiple"
            allowClear
            filter={true}
            options={allCities || []}
            value={screenParams.cityIds}
            onChange={val=>setScreenParams({
              ...screenParams, cityIds: (val as number[]).length > 0 ? val as number[] : undefined
            })}
          />
          <YRadioButton
            className="teamAuth-operation-screen-item"
            size="small"
            value={screenParams.status}
            radioOptions={AllCoStatus}
            onChange={e=>setScreenParams({...screenParams, status: e.target.value})}
          />
          <Button
            className="teamAuth-operation-screen-item"
            size="small"
            type="primary"
            onClick={handleQueryOn}
          >查询</Button>
        </div>
        <Button type="primary" size="small" onClick={()=>setDownload(true)}>下载csv</Button>
      </div>
      <Table<TeamProps>
        className="teamAuth-table"
        rowKey="id"
        bordered
        columns={[...genTeamColumn(handleChargerInfoChange), OperationColumn]}
        dataSource={teamList}
        loading={loading.fetchLoading}
        onChange={handleTableChange}
        // scroll={{x: 'max-content'}}
        pagination={{
          size: "small",
          total: teamData && teamData.total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: total=> `总计${total}条结果`,
        }}
      />
      <Modal
        title="修改负责人信息"
        visible={showInfoChange}
        onCancel={()=>setShowInfoChange(false)}
        footer={null}
      >
        <ResponserModal
          value={teamOnChange}
          onCommit={handleCommitChange}
          onCancel={()=>setShowInfoChange(false)}
        />
      </Modal>
      <Modal title="添加团队" visible={showAddteam} footer={null} onCancel={()=>setShowAddteam(false)}>
        <AddteamModal
          cities={allCities}
          currentUser={currentUser && currentUser.name}
          onCommit={handleAddTeam}
          onCancel={()=>setShowAddteam(false)}
        />
      </Modal>
      <Modal
        visible={showStopReason}
        title="终止团队服务"
        footer={null}
        onCancel={()=>{ setStopReason(undefined); setShowStopReason(false) }}
      >
        <div className="stopModal">
          <div className="stopModal-reason">
            <label className="stopModal-label">理由</label>
            <Select
              style={{minWidth: 280}}
              size="small"
              value={stopReason}
              onChange={(val: string)=>setStopReason(val)}
            >{
              stopReasion.map(reason=><Select.Option key={reason} value={reason}>{reason}</Select.Option>)
            }</Select>
          </div>
          <Button type="primary" size="small" onClick={handleConfirmStop}>提交</Button>
        </div>
      </Modal>
    </div>
  );
};

const memedTeamManagerBoard = memo(TeamManagerBoard);

export default connect((state: ConnectState)=>({
  others: state.others,
  user: state.user
}))(memedTeamManagerBoard);
