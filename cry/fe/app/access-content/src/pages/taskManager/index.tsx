import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {Form, Input, Button, Table, Radio, Divider, message, DatePicker, Spin} from 'antd';
import { PAUSE_FLAG, DEL_FLAG, FINISH_FLAG, STATUS_CN, PAGE, PAGE_SIZE, STATUS_CN_COLOR, START_FLAG } from '../../config/constant';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import {ConnectState, UserModelState} from '@/models/connect';
import {Link} from 'react-router-dom';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// import './index.less';
interface TaskManagerProps{
  form: any,
  dispatch: Dispatch
  user: UserModelState
}


const TaskManager: React.FC<TaskManagerProps> = ({form, dispatch, user}) => {
  const {getFieldDecorator, setFieldsValue} = form;
  const [searchParams, setSearchParams] = useState<{[propName: string]: any}>({
    status: 1,
    page: PAGE,
    count: PAGE_SIZE,
    request_from: 'tools'
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksTotal, setTaskSTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const permission = user && user["permission"] || [];
  useEffect(() => {
    onRequestDataBack();
  }, []);
  const onSearch = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any)=>{
      if(err){
        console.log(err);
        return;
      }
      if(values['create_timestamp'] && values['create_timestamp'].length){
        searchParams['create_timestamp_start'] =  (new Date(values['create_timestamp'][0]).getTime() / 1000) | 0;
        searchParams['create_timestamp_end'] =  (new Date(values['create_timestamp'][1]).getTime() / 1000) | 0;
      }
      delete values.create_timestamp;
      Object.assign(searchParams, values, {page: 1})
      onRequestDataBack();
    });
  }
  const onReset = () => {
    let tempSearchParams = {
      creator_mail: undefined,
      create_timestamp: undefined,
      keyword: undefined,
      task_id: undefined,
    };
    setFieldsValue(tempSearchParams);
    tempSearchParams['status'] = 1;
    tempSearchParams['page'] = 1;
    delete searchParams.create_timestamp_start;
    delete searchParams.create_timestamp_end;
    delete tempSearchParams.create_timestamp;
    Object.assign(searchParams, tempSearchParams);
    onRequestDataBack();
  }
  const onTabsChange = (e: any) => {
    searchParams['status'] = e.target.value;
    searchParams['page'] = PAGE;
    setSearchParams({...searchParams});
    onRequestDataBack();
  }
  const onPageChange = (page: any) => {
    searchParams['page'] = page;
    onRequestDataBack();
  }
  const onRequestDataBack = async () => {
    setSearchParams({...searchParams});
    setLoading(true);
    const {code, reason, tasks = [], total} = await dispatch({
      type: "TaskList/searchTask",
      payload: {
        ...searchParams
      }
    });
    if(code === 0){
      setTasks([...(tasks || [])]);
      setTaskSTotal(total)
    } else {
      message.info(`任务列表加载失败请稍后重试! ${reason}`);
    }
    setLoading(false);
  }
  const onSetTaskStatus = async (id: any, status: number) => {
    const {currentUser = {}} = user;
    const operator = currentUser.email;
    if(!operator){
      console.error(`operator: {operator}为空, 禁止操作`);
      return
    }
    const payload = {
      task_id: id,
      status,
      operator,
      reason: ''
    };
    let {code, reason} = await dispatch({
      type: 'TaskList/setTaskStatus',
      payload,
    })
    if(code === 0){
      let page = searchParams.page;
      if(tasks.length === 1 && page > 1){
        searchParams['page'] = 1;
      }
      message.success(`操作成功`);
      onRequestDataBack();
    } else {
      message.info(`操作失败!请稍后重试, ${reason}`);
    }
  }
  const columns = [{
    title: '任务ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: (text: string, record: any) => {
      return <Link to={`/taskManager/detail?id=${text}&status=${record['status']}`}>{text}</Link>
    }
  },{
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => {
      return <Link to={`/taskManager/detail?id=${record['id']}&status=${record['status']}`}>{text}</Link>
    }
  },{
    title: '创建时间',
    dataIndex: 'create_timestamp',
    key: 'create_timestamp',
    width: 150,
    render: (text: any) => moment(text * 1000).format("YYYY-MM-DD HH:MM:SS")
  },{
    title: '创建人',
    dataIndex: 'creator_mail',
    key: 'creator_mail',
  },{
    title: '任务说明',
    dataIndex: 'describe',
    key: 'describe',
  },{
    title: '全部抓取量',
    dataIndex: 'all_count',
    key: 'all_count',
  },{
    title: '昨日抓取量',
    dataIndex: 'count_yesterday',
    key: 'count_yesterday',
  },{
    title: '7日抓取量',
    dataIndex: 'count_7days',
    key: 'count_7days',
  },{
    title: '入库量',
    dataIndex: 'storage_count',
    key: 'storage_count',
  },{
    title: '状态',
    dataIndex: 'status',
    width: 100,
    key: 'status',
    render: (text: any) => {
      return <span style={{color: STATUS_CN_COLOR[text]}}>{STATUS_CN[text]}</span>;
    }
  },{
    title: '操作',
    dataIndex: 'Action',
    key: 'Action',
    width: 140,
    render: (text: string, record: any) => {
      let delButton = null, startButton = null, pauseButton = null, finishButton = null;

      if(DEL_FLAG.indexOf(record['status']) !== -1){
        delButton = <a onClick={() => onSetTaskStatus(record['id'], 6)}>删除</a>;
      }
      if(permission.indexOf('audit') !== -1 && START_FLAG.indexOf(record['status']) !== -1){
        startButton = <a onClick={() => onSetTaskStatus(record['id'], 2)}>开始</a>
      }
      if(PAUSE_FLAG.indexOf(record['status']) !== -1){
        pauseButton = <a onClick={() => onSetTaskStatus(record['id'], 4)}>暂停</a>;
      }
      if(FINISH_FLAG.indexOf(record['status'])!== -1){
        finishButton = <a onClick={() => onSetTaskStatus(record['id'], 3)}>立即结束</a>;
      }
      return <>
        {startButton}
        {(startButton && delButton) ? <Divider type="vertical"></Divider>: null}
        {delButton}
        {((delButton || startButton) && pauseButton)? <Divider type="vertical"></Divider>: null}
        {pauseButton}
        {((pauseButton|| delButton || startButton) && finishButton)? <Divider type="vertical"></Divider>: null}
        {finishButton}
      </>
    }
  }];
  const pagination = {
    defaultCurrent: PAGE,
    pageSize: PAGE_SIZE,
    onChange: onPageChange,
    total: tasksTotal,
    current: searchParams['page'] || PAGE
  };
  return (
    <>
      <div className="main-content">
        <div>
          <Form layout="inline" onSubmit={onSearch}>
            <FormItem label="创建人">{getFieldDecorator('creator_mail')(<Input placeholder="输入创建人邮箱"/>)}</FormItem>
            <FormItem label="创建时间">{getFieldDecorator('create_timestamp')(<RangePicker
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />)}</FormItem>
            <FormItem label="任务名称">{getFieldDecorator('keyword')(<Input placeholder="请输入任务名称"/>)}</FormItem>
            <FormItem label="主任务ID">{getFieldDecorator('task_id')(<Input placeholder="主任务ID"/>)}</FormItem>
            <FormItem><Button type="primary" htmlType="submit">搜索</Button></FormItem>
            <FormItem><Button type="primary" onClick={onReset}>重置</Button></FormItem>
          </Form>
        </div>
        <Divider>
          <span style={{fontSize: 10}}>列表区域</span>
        </Divider>
        <div>
          <Radio.Group onChange={onTabsChange} value={searchParams.status}>
            {
              STATUS_CN.map((status: string, index: number) => {
                return <Radio.Button value={index} key={index}>{status}</Radio.Button>
              })
            }
          </Radio.Group>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              style={{marginTop: 10}}
              pagination={pagination}
              dataSource={tasks}
              rowKey="id"
              scroll={{ x: 800 }}
            />
          </Spin>
        </div>
      </div>
    </>
  );
}

export default connect(({user}: ConnectState)=>({
  user
}))(Form.create()(TaskManager));

