import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';
import { Card, Form, DatePicker, Input, Select, Table, message, Button, Icon, Tag, Pagination } from 'antd';
import appConfig from '@/config/app.config';
import ViewLog from '@/components/log/viewLog';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const dateFormat2 = 'YYYY-MM-DD HH:mm:ss';
const typeList = [
  { name: '全部', value: ''},
  { name: '正常', value: 'NORMAL'},
  { name: '黑名单', value: 'BLACK'},
]

interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
}
const BlackLogPage: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<Boolean>(true);
  const [modalvisible, setModalvisible]  = useState<Boolean>(false);
  const [total, setTotal] = useState<Number>(0);
  const [seachPms, setSeachPms] = useState<object>({
    startTime: moment().subtract(30, "days").format(dateFormat),
    endTime: moment().format(dateFormat),
    userId: '',
    type: '',
    offset: 0,
    limit: 10,
  });
  const [useridLog, setUseridLog] = useState<Array<any>>([]);
  const [useridRecord, setUseridRecord] = useState<object>({});
  const [userList, setUserList] = useState<Array<any>>([]);
  const [search, setSearch] = useState<Boolean>(false);

  useEffect(() => {
    getData(seachPms);
  }, [search])

  const getData = async (pms) => {
    const maplist = ['startTime', 'endTime']
    maplist.map((item)=>{
      if (pms[item] === '') {
        delete pms[item]
      }
    })
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/nameList/blackLogInfoList`, pms);
    if(ret.data.status === 200) {
      setUserList(ret.data.data.list)
      setTotal(ret.data.data.total)
    } else {
      message.error('失败，请重试');
    }
    setLoading(false)
  }
  const changePage = (page, pageSize) => {
    setLoading(true)
    let data = Object.assign({},seachPms)
    data.offset = page-1
    setSeachPms(data)
    setSearch(!search)
  }
  const column = [{
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
  }, {
    title: '首次拉黑时间',
    dataIndex: 'firstTime',
    key: 'firstTime',
    render: (text: any) => moment(text).format(dateFormat2),
  }, {
    title: '最近拉黑时间',
    dataIndex: 'lastTime',
    key: 'lastTime',
    render: (text: any) => moment(text).format(dateFormat2),
  }, {
    title: '当前状态',
    dataIndex: 'type',
    key: 'type',
    render: (text: any) => text==='正常'? <Tag color="green">{text}</Tag>:<Tag color="volcano">{text}</Tag>,
  }, {
    title: '操作人',
    dataIndex: 'createUser',
    key: 'createUser',
    render: (text: any) => text==='系统识别'? <Tag color="purple"><Icon type="robot"/> {text}</Tag>:<Tag color="cyan"><Icon type="user"/> {text}</Tag>,
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    render: (text: any, record: object) => {
      return(
        <Button size="small" icon="inbox" type="primary" onClick={()=>{ viewModal(record) }}>查看</Button>
      )
    },
  }];
  
  const viewModal = async (record: object) => {
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/nameList/blackLogList`, { userId: record.userId});
    if(ret.data.status === 200) {
      setModalvisible(true)
      setUseridLog(ret.data.data)
      setUseridRecord(record)
    } else {
      message.error('失败，请重试')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err: any, values: { userId: any, type: string}) => {
      if (!err) {
        let data = Object.assign({},seachPms)
        data.userId = values.userId
        data.type = values.type
        setSeachPms(data)
        setSearch(!search)
        // console.log(values)
      }
    });
  }
  const onChangeTime = (value: any, dateString: any[]) => {
    let data = Object.assign({},seachPms)
    data.startTime = dateString[0]
    data.endTime = dateString[1]
    setSeachPms(data)
  }
  
  const onOkTime = (value: any) => {
    console.log('onOk: ', value);
  }
  return (
    <> 
      <div className="main-content">
        <PageHeader current="拉黑日志" home="日志管理"/>
        <Card bordered={false} style={{ minHeight: 380, marginTop: '-25px' }}>
          <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
            <Form.Item label="userid">
              {getFieldDecorator('userId', {
                initialValue: seachPms.userId,
              })(
                <Input style={{width: 140}} placeholder="请输入userid" allowClear={true}/>
              )}
            </Form.Item>
            <Form.Item label="拉黑时间">
              {getFieldDecorator('creat_time', {
                initialValue: [moment().subtract(30, "days"), moment()],
              })(
                <RangePicker
                  format={dateFormat}
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeTime}
                  onOk={onOkTime}
                  style={{width: '245px'}}
                />
              )}
            </Form.Item>
            
            <Form.Item label="当前状态">
              {getFieldDecorator('type', {
                initialValue: seachPms.type,
              })(
                <Select style={{width: 100}}>
                  {typeList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
          </Form>
          <Table
            columns={column}
            loading={loading}
            dataSource={userList}
            rowKey={record => record.userId}
            pagination={false}
          />
          <Pagination 
            style={{marginTop: '20px',float: 'right'}} 
            total={total} 
            showQuickJumper={true} 
            onChange={changePage}
            current={seachPms.offset+1}
          />
          <ViewLog
            modalvisible={modalvisible}
            setModalvisible={setModalvisible}
            useridLog={useridLog}
            useridRecord={useridRecord}
          />
        </Card>
      </div>
    </>
  );
}
const WrappedDemo = Form.create({ name: 'validate_other' })(BlackLogPage);
export default WrappedDemo;
