import React, { useState, useEffect } from 'react';
import { Form, Divider, Input, Select, Button, Table, message as aliasMessage, DatePicker } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { PAGE, PAGE_SIZE, putStatus } from '../../config/constant';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';
import { connect } from 'dva';
import router from 'umi/router';
import './index.less';

const { RangePicker } = DatePicker;

interface putColumnsProps {
  key: number,
  task_id: number,
  task_name: string,
  create_author: string,
  create_time: string,
  count_yesterday: number,
  count_all: number,
  count_delivery: number,
  task_status: number,
  operators: string
}

interface putConfigProps {
  form: any,
  dispatch: Dispatch,
  user: UserModelState
}


const putConfig: React.FC<putConfigProps> = ({ form, dispatch, user }) => {

  const [dataSource, setDataSource] = useState<putColumnsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [defaultParams, setDefaultParams] = useState<{ [propName: string]: any }>({
    page: PAGE,
    page_size: 20,
    create_author: '',
    task_id: '',
    task_word: ''
  });
  const permission = user && user["permission"] || [];
  const [taskTotal, setTaskTotal] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { getFieldDecorator } = form;

  const columns: ColumnProps<putColumnsProps>[] = [
    {
      key: 'id',
      title: '任务ID',
      dataIndex: 'task_id',
      align: 'center',
      width: 100,
      render: (text: number, record: any) => {
        return <a onClick={() => scanTask(record.job_id)}>{text}</a>
      }
    },
    {
      key: 'create_time',
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      width: 200,
    },
    {
      key: 'create_author',
      title: '创建人',
      dataIndex: 'create_author',
      width: 140,
      align: 'center'
    },
    {
      key: 'task_name',
      title: '任务名称',
      dataIndex: 'task_name',
      width: 160,
      align: 'center'
    },
    {
      key: 'count_all',
      title: '全部量级',
      dataIndex: 'count_all',
      width: 140,
      align: 'center'
    },
    {
      key: 'count_yesterday',
      title: '昨日量级',
      dataIndex: 'count_yesterday',
      width: 140,
      align: 'center'
    },
    {
      key: 'count_delivery',
      title: '入库量',
      dataIndex: 'count_delivery',
      width: 140,
      align: 'center'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'task_status',
      align: 'center',
      width: 140,
      render: (text: string, record: any) => {
        let showText = ~~record.task_status === 1 ? '创建完成-未开始' : 
        ~~record.task_status === 2 ? '进行中' : 
        ~~record.task_status === 4 ? '已结束' : null;
        return <span>{showText}</span>
      }
    },
    {
      key: 'operators',
      title: '操作人',
      dataIndex: 'operators',
      width: 140,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'Action',
      key: 'Action',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (text: string, record: any) => {
        let startButton = permission.includes('deliveryAdminAuthority') ? record.task_status !== 1 ? 
        <Button type="link" className="start" disabled>启动</Button> :
        <Button type="link" className="start" onClick={() => startTaskEvent(record.job_id)}>启动</Button> 
        :(<></>);
  
        let endButton = permission.includes('deliveryAdminAuthority') ? record.task_status === 2 ? 
        <Button type="link" className="stop" onClick={() => endTaskEvent(record.job_id)}>停止</Button> :
        <Button type="link" className="stop" disabled>停止</Button>
        :(<></>);
  
        let editButton = record.task_status === 1 ? 
        <Button type="link" className="edit" onClick={() => editTask(record)}>编辑</Button> : 
        <Button type="link" className="edit" disabled>编辑</Button>;

        let copyButton = <Button type="link" className="edit" onClick={() => copyTask(record)}>复制</Button>;
  
        return <>
          {startButton}
          {endButton}
          {editButton}
          {copyButton}
        </>
      }
    }
  ]

  const pageChangeEvent = (page: any, pageSize: any) => {
    defaultParams['page'] = page;
    setDefaultParams({ ...defaultParams });
    getTaskList();
  }

  const pagination = {
    defaultCurrent: PAGE,
    pageSize: PAGE_SIZE,
    total: taskTotal,
    current: defaultParams['page'],
    onChange: pageChangeEvent
  }
  const getTaskList = async () => {
    setLoading(true);

    Object.keys(defaultParams).forEach((item: string) => {
      if (defaultParams[item] === '') {
          delete defaultParams[item];
      }
    });
    let params = JSON.parse(JSON.stringify(defaultParams));
    const { code, message, data = [] } = await dispatch({
        type: 'putTaskList/getTaskList',
        payload: {
          ...params
        }
    });
  
    if (code === 0 || message === 'success') {
      setDataSource([...(data.tasks || [])]);
      setTaskTotal(data.total);
    } else {
      setDataSource([...[]]);
      setTaskTotal(0);
      aliasMessage.error(`${message}`);
    }
    setLoading(false);
  }

  const onChangeTime = (date: object, dateString: any) => {
    let [ startTime, endTime ] = dateString;
    defaultParams['start_time'] = startTime;
    defaultParams['end_time'] = endTime;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (err) { return; }
      Object.assign(defaultParams, values, { page: 1 });
      getTaskList();
    });
  }

  const selectStatus = (val: number) => {
    defaultParams['task_status'] = val;
  }

  const startTaskEvent = async (id: string) => {
    let { currentUser = {} } = user;
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/startTask',
      payload: {
        'job_id': id,
        'operators': currentUser.name
      }
    });
    if (code === 0 || message === 'success') {
      let num = dataSource.findIndex((item: any) => {
        return item.job_id === data.job_id;
      })
      dataSource[num]['task_status'] = 2;
      setDataSource([...dataSource]);
    } else {
      aliasMessage.error(`${message}`);
    }
  }
  
  const endTaskEvent = async (id: string) => {
    let { currentUser = {} } = user;
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/stopTask',
      payload: {
        'job_id': id,
        'operators': currentUser.name
      }
    });
    if (code === 0 || message === 'success') {
      let num = dataSource.findIndex((item: any) => {
        return item.job_id === data.job_id;
      })
      dataSource[num]['task_status'] = 4;
      setDataSource([...dataSource]);
    } else {
      aliasMessage.error(`${message}`);
    }
  }

  const createTask = () => {
    router.push('/putConfig/create');
  }

  const editTask = (record: any) => {
    router.push(`/putConfig/create?id=${record.job_id}&type=edit`);
  }

  const scanTask = (id: number) => {
    router.push(`/putConfig/create?id=${id}&type=scan`);
  }

  const copyTask = (record: any) => {
    router.push(`/putConfig/create?id=${record.job_id}&type=copy`);
  }  

  useEffect(() => {
    getTaskList();
  }, [])

  return (
    <div className="main-content">
      <p className="title">任务管理</p>
      <Divider />
      <Form layout="inline" onSubmit={handleSubmit}>
        {/* <Form.Item label="搜索条件:"></Form.Item> */}
        <Form.Item label="创建人:">{getFieldDecorator('create_author')(<Input placeholder="请输入创建人" />)}</Form.Item>
        <Form.Item label="创建时间:">
          <RangePicker
            onChange={onChangeTime} 
            placeholder={['开始时间', '结束时间']}
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <Form.Item label="任务关键词:">{getFieldDecorator('task_word')(<Input placeholder="请输入任务关键词" />)}</Form.Item>
        <Form.Item label="任务ID:">{getFieldDecorator('task_id')(<Input placeholder="请输入任务ID" />)}</Form.Item>
        <Form.Item label="任务状态:">
          <Select placeholder="请选择任务状态" onChange={selectStatus} style={{ width: 168 }}>
            {
              putStatus.map((item: any, index:number) => {
                return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item><Button className="operator-btn" type="primary" htmlType="submit">查询</Button></Form.Item>
        <Form.Item><Button className="operator-btn" type="primary" onClick={() => createTask() }>新建任务</Button></Form.Item>
      </Form>
      <div className="list">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          rowKey="task_id"
          loading={loading}
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
    
  )
}

export default connect(({ user }: ConnectState) => ({
  user
}))(Form.create()(putConfig));