import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';
import { Card, Form, DatePicker, Input, Select, Table, message, Button, Icon, Tag, Popconfirm } from 'antd';
import AddBlackForm from '@/components/userlist/addUserList';
import appConfig from '@/config/app.config';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const dateFormat2 = 'YYYY-MM-DD HH:mm';
const typeList = [
  { name: 'USERID', value: 'USERID'}, // 目前只有USERID
]

interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
}
const BlackListPage: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<Boolean>(true);
  const [adddrawervisible, setAdddrawervisible]  = useState<Boolean>(false);
  const [seachPms, setSeachPms] = useState<object>({
    startTime: moment().subtract(30, "days").format(dateFormat),
    endTime: moment().format(dateFormat),
    userId: '',
    type: 'WHITE',
    dimension: 'USERID',
    offset: 0,
    limit: 5000,
  });
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
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/nameList/list`, pms);
    if(ret.data.status === 200) {
      setUserList(ret.data.data.list)
    } else {
      message.error('失败，请重试');
    }
    setLoading(false)
  }
  const column = [{
    title: '用户ID',
    dataIndex: 'value',
    key: 'value',
  }, {
    title: '原因',
    dataIndex: 'remarks',
    key: 'remarks',
  }, {
    title: '操作人',
    dataIndex: 'createUser',
    key: 'createUser',
    render: (text: any) => text==='系统识别'? <Tag color="purple"><Icon type="robot"></Icon> {text}</Tag>:<Tag color="cyan"><Icon type="user"></Icon> {text}</Tag>,
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text: any) => moment(text).format(dateFormat2),
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    render: (text: any, record: object) => {
      return(
        <Popconfirm
        title="确定删除吗？"
        placement="topRight"
        okText="确认"
        cancelText="取消"
        onConfirm={ () => {confirmDelete(record)}}
        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button size="small" icon="delete" style={{backgroundColor:'#f50', borderColor: '#f50'}} type="primary">移除</Button>
        </Popconfirm>
      )
    },
  }];
  const confirmDelete = async (record) => {
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/nameList/updateStatus`, {id: record.id});
    if(ret.data.status === 200) {
      let newList: any[] = [];
      newList = newList.concat(userList); 
      newList.map((item,index)=>{
        if (item.id === record.id) {
          newList.splice(index,1)
        }
      })
      setUserList(newList)
      message.success('删除成功');
    } else {
      message.error('失败，请重试');
    }
  }
  const addNewFeature = () => {
    setAdddrawervisible(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = Object.assign({},seachPms)
        data.userId = values.userId
        data.dimension = values.dimension
        setSeachPms(data)
        setSearch(!search)
        console.log(values)
      }
    });
  }
  const onChangeTime = (value, dateString) => {
    let data = Object.assign({},seachPms)
    data.startTime = dateString[0]
    data.endTime = dateString[1]
    setSeachPms(data)
  }
  
  const onOkTime = (value) => {
    console.log('onOk: ', value);
  }
  const children = <Button type="primary" icon="plus" onClick={addNewFeature}>加白名单</Button>
  return (
    <> 
      <div className="main-content">
        <PageHeader current="白名单管理" home="黑白名单" children={children}/>
        <Card bordered={false} style={{ minHeight: 380, marginTop: '-25px' }}>
          <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
            <Form.Item label="userid">
              {getFieldDecorator('userId', {
                initialValue: seachPms.userId,
              })(
                <Input style={{width: 140}} placeholder="请输入userid"/>
              )}
            </Form.Item>
            <Form.Item label="操作时间">
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
            
            {/* <Form.Item label="异常类型">
              {getFieldDecorator('dimension', {
                initialValue: seachPms.dimension,
              })(
                <Select style={{width: 100}}>
                  {typeList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
                </Select>
              )}
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
          </Form>
          <Table
            columns={column}
            loading = {loading}
            dataSource={userList}
            rowKey={record => record.id}
          />
           <AddBlackForm
            adddrawervisible={adddrawervisible}
            setAdddrawervisible={setAdddrawervisible}
            userList={userList}
            setUserList={setUserList}
            typeList={typeList}
            type="WHITE"
          />
        </Card>
      </div>
    </>
  );
}
const WrappedDemo = Form.create({ name: 'validate_other' })(BlackListPage);
export default WrappedDemo;
