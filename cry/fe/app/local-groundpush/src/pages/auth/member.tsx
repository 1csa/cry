import React ,{useState,useEffect, memo, ReactElement, } from 'react';
import moment from 'moment';
import {Input ,Button,Table,Modal, message} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { YSelect} from '@/components';
import AddMember from './components/addMember';
import {usePost} from '@/services/common';
import { process, exportData } from '@/utils/dev_helper';
import { PaginationConfig, SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { ConnectState, Dispatch, UserModelState, OtherModelState } from '@/models/connect';
import './member.less'
interface UserBoardProps {
  user: UserModelState,
  others: OtherModelState,
  dispatch: Dispatch;
}

interface pushMan_data{
  "id": number,
  "name": string,
  "phone": string,
  "wx": string,
  "teamId": number,
  "teamName": string,
  "status": number,
  "createTime": string,
  "updateTime": string,
  "updateUser": string,
  "uid": number,
  "startTime": string,
  "endTime": string,
  "stopReason": string
}
interface pushMan_type{
"pageNum": number,
"pageSize": number,
"size": number,
"total": number,
"list":pushMan_data[]
}
const reasonList =[{
  value:"用户留存质量不达标",title:"用户留存质量不达标"
},{
  value:"推广量效果不达标",title:"推广量效果不达标"
},{
  value:"疑似出现作弊现象",title:"疑似出现作弊现象"
},{
  value:"推广周期结束，正常终止",title:"推广周期结束，正常终止"
},{
  value:"突发情况，终止推广合作",title:"突发情况，终止推广合作"
}]

const Member: React.FC<UserBoardProps> =({ user, dispatch, others }) => {
  const { allTeams, allCities } = others;
  const columns: ColumnProps<pushMan_data>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编号ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '微信号',
      dataIndex: 'wx',
      key: 'wx',
    },
    {
      title: 'uid',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '所属团队',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: '团队编号',
      dataIndex: 'teamId',
      key: 'teamId',
    },
    {
      title: '首次服务',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime)=> startTime && moment(startTime).format('YYYY-MM-DD')
    },
    {
      title: '服务结束',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime)=> endTime && moment(endTime).format('YYYY-MM-DD')

    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status ) => status === 1 ? '服务中' : '停止服务'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) =><Button
        type="link"
        size="small"
        onClick={()=>handleDelete(record.id, record.status)}
      >{
        record.status === 1 ? '停止' : '恢复'
      }</Button>
     },
     {
      title: '停止服务原因',
      dataIndex: 'stopReason',
      key: 'stopReason',
      render: (_, record)=><span>{record.status===1 ? '-' : record.stopReason}</span>
    },
  ];

  const PushmanCnkeyMap = {
    name: '姓名',
    id: '编号ID',
    phone: '联系电话',
    wx: '微信号',
    uid: 'uid',
    teamName: '所属团队',
    teamId: '团队编号',
    startTime: '首次服务',
    endTime: '服务结束',
    status: '当前状态',
    stopReason: '停止服务原因'
  };

  const [ visible, setVisible ] = useState<boolean>(false);
  const [ addMemberVisible, setAddMemberVisible ] = useState<boolean>(false);
  const [ teamIds, setTeamIds] = useState();
  const [cityIds, setCityIds ] = useState();
  const [ current, setCurrent ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);
  const [ id, setId ] = useState<number>();
  const [ status, setStatus ] = useState<number>();
  const [ reason, setReason ] = useState();
  const [ name, setName ] = useState<string>();
  const [ uid, setUid ] = useState<string>();
  const [ phone, setPhone ] = useState<string>();
  const [ download, setDownload ] = useState(false);

  const { data: pushManData, fetchData: fetchPushManData } = usePost<pushMan_type>('/pushMan/list');
  const { data: allPushmen, fetchData: fetchAllPushmen } = usePost<pushMan_type>('/pushMan/list');
  const { fetchData: updateStatus } = usePost<pushMan_type>('/pushMan/updateStatus');

  useEffect(()=>{
    if (!allTeams || allTeams.length === 0) {
      dispatch({type: 'others/fetchAllTeams'});
    }
    if( !allCities || allCities.length === 0) {
      dispatch({type: 'others/fetchAllCities'});
    }
    handlePushManData()
  }, []);

  useEffect(()=>{
    if (!download) {
      return;
    }
    fetchAllPushmen({
      offset: 0, limit: 999999, teamIds, cityIds, name, pushManId: uid, phone
    })
  }, [ download ]);

  useEffect(()=>{
    if (!download) {
      return;
    }

    try {
      exportData( allPushmen && allPushmen.list, "地推员列表", downloadPredeal );
    } catch(err){
      message.error('出错了。。')
      console.log(err, "error happened in downloading....")
    }finally {
      setDownload(false);
    }
  }, [allPushmen]);

  function downloadPredeal( dataSource: pushMan_data) {
    let { id, name, phone, wx, teamId, teamName, status, uid, startTime, endTime, stopReason } = dataSource;
    let dataToTrans = {
      id, name, phone, wx, teamId, teamName, uid, startTime, endTime,
      status: status === 1 ? '服务中' : '停止服务',
      stopReason: status === 1 ? undefined : stopReason
    };

    let cnEntries = Object.entries(dataToTrans).map(([key, val])=>[PushmanCnkeyMap[key], val]);
    return Object.fromEntries(cnEntries)
  }

  const handleTableChange = ( { current =1, pageSize=10 }: PaginationConfig )=>{
    let newParams = {
      offset: pageSize * (current-1), limit: pageSize, teamIds, cityIds, name, pushManId: uid, phone
    };
    setCurrent(current);
    setPageSize(pageSize);
    fetchPushManData(process(newParams));
  };

    const handlePushManData =()=>{
      let params ={
        "offset":pageSize*(current-1),
        "limit":pageSize,
        "teamIds":teamIds,
        "cityIds":cityIds,
        "name":name,
        "pushManId":uid,
        "phone":phone
      }
      fetchPushManData(process(params))
    }
    function handleDelete(id:number,status:number){
      setId(id)
      setStatus(status)
      setVisible(true)
    }
    async function handleOk(){
      setVisible(false)
      let params = {
        "id":id,
        "status":status==0?1:0,
        "stopReason":reason
      }
      await updateStatus(params)
      handlePushManData()
    }
    function handleCancel(){
      setVisible(false)
    }

  return (
    <>
      <div className="add_content">
        <h3>人员查询</h3>
        <Button className="add_btn" icon="plus" type="primary" size="small" onClick={()=>setAddMemberVisible(true)}>添加地推人员</Button>
      </div>
      <div className="memberAuth-operation">
        <div className="query_param">
          <div>
            <div>
              <label className="team_attribute">团队属性</label>
              <YSelect
                mode="multiple"
                allowClear
                placeholder="请选择团队"
                filter={true}
                style={{width: 200, marginRight: 10}}
                size="small"
                options={allTeams || []}
                onChange={val=>setTeamIds(val)}
              />
              <YSelect
                placeholder="请选择城市"
                mode="multiple"
                allowClear
                filter={true}
                style={{ width: 200 ,marginRight:10}}
                options={allCities || []}
                onChange={(val)=>setCityIds(val)}
              />
            </div>
            <div className="staff">
              <label className="team_attribute">人员属性</label>
              <Input size="small" onChange={(event)=>setName(event.target.value)} placeholder="姓名" />
              <Input size="small" onChange={(event)=>setUid(event.target.value)} placeholder="编号ID" />
              <Input size="small" onChange={(event)=>setPhone(event.target.value)} placeholder="联系电话" />
            </div>
          </div>
          <Button type="primary" size="small" onClick={()=>handlePushManData()} >查询</Button>
        </div>
        <Button type="primary" size="small" onClick={()=>setDownload(true)}>下载csv</Button>
      </div>
      <div>
        <Table
            pagination={{
              size: 'small',
              total: pushManData&&pushManData.total,
              pageSize: pushManData && pushManData.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: total=> `总计${total}条结果`,
            }}
            bordered
            onChange={handleTableChange}
            rowKey='id'
            scroll={{x: 'max-content'}}
            columns={columns}
            dataSource={pushManData&&pushManData.list}
        />
      </div>
      <div>
        <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
        { status==1&&<p>确定要终止合作？</p> }
        { status==0&&<p>确定要恢复合作？</p> }
        { status==1&&<div>
            <label>理由:</label>
            <YSelect className="team" options = {reasonList} onChange = {(value)=>setReason(value)} style={{ width: '200px' }}></YSelect>
        </div>
        }
        </Modal>
        </div>
       <AddMember visible={addMemberVisible} user={user} teamData={allTeams} onOk={()=>{console.log("ok")}} onCancel={()=>setAddMemberVisible(false)} onAddMember={()=> {handlePushManData();setAddMemberVisible(false)}}/>
    </>
  );
};

export default connect((state: ConnectState)=>({
  user: state.user,
  others: state.others
}))(memo(Member));
