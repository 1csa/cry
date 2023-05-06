import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, Form, DatePicker, Input, Select, Table, message, Button, Icon, Tag, Popconfirm } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import moment from 'moment';
import AddFeatureForm from '@/components/dispose/addFeature';
import ViewFeature from '@/components/dispose/viewFeature';
import { defaultFeatureFormValue } from '@/config/constant';


const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const dateFormat2 = 'YYYY-MM-DD HH:mm';

const statusList = [
  { name: '全部', value: ''},
  { name: '未处理', value: '未处理', color: 'lime'},
  { name: '处理中', value: '处理中', color: 'volcano'},
  { name: '已上线', value: '已上线', color: 'blue'},
  { name: '已废弃', value: '已废弃', color: 'gray'},
]

interface FormProps {
  form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
}
const FeaturePage: FC<FormProps> = (props: FormProps) => {
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const [loading, setLoading] = useState<Boolean>(true);
  const [seachPms, setSeachPms] = useState<object>({
    startTime: moment().subtract(30, "days").format(dateFormat),
    endTime: moment().format(dateFormat),
    featureCnName: '',
    featureEnName: '',
    level1Type: '',
    level2Type: '',
    status: '',
    offset: 0,
    limit: 5000,
  });
  const [adddrawervisible, setAdddrawervisible]  = useState<Boolean>(false);
  const [defaultform, setDefaultform] = useState<Object>(defaultFeatureFormValue);
  const [viewpopvisible, setViewpopvisible]  = useState<Boolean>(false);
  const [viewFeature, setViewFeature] = useState<object>({});
  const [featureList, setFeatureList] = useState<Array<any>>([]);
  const [type1List, setType1List] = useState<Array<any>>([]);
  const [type2List, setType2List] = useState<Array<any>>([]);
  const [search, setSearch] = useState<Boolean>(false);
  useEffect(() => {
    getData(seachPms);
  }, [search])
  useEffect(() => {
    getTypeList();
  }, [])
  const getData = async (pms) => {
    let data = Object.assign({},pms)
    const maplist = ['level1Type', 'level2Type', 'status', 'startTime', 'endTime']
    maplist.map((item)=>{
      if (data[item] === '') {
        delete data[item]
      }
    })
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/feature/list`, data);
    if(ret.data.status === 200) {
      let list = ret.data.data.list
      if (list && list.length > 0) {
        list.map((item)=>{
          item.countUnit = item.calInterval.replace(/[^a-z]+/ig,"")
          item.calInterval = parseInt(item.calInterval).toString()
        })
      }
      setFeatureList(list)
    } else {
      message.error('失败，请重试');
    }
    setLoading(false)
  }
  const getTypeList = async () => {
    const ret = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/featureLevel1`);
    const ret2 = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/featureLevel2`);
    if(ret.data.status === 200) {
      setType1List(ret.data.data)
      defaultform.level1Type = ret.data.data[0].value
      setDefaultform(defaultform)
    } else {
      message.error('请求特征类型1失败，请重试');
    }
    if(ret2.data.status === 200) {
      setType2List(ret2.data.data)
      defaultform.level2Type = ret2.data.data[0].value
      setDefaultform(defaultform)
    } else {
      message.error('请求特征类型2失败，请重试');
    }
  }
  const column = [{
    title: '特征ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '特征中文',
    dataIndex: 'featureCnName',
    key: 'featureCnName',
    width: 150,
  }, {
    title: '特征英文',
    dataIndex: 'featureEnName',
    key: 'featureEnName',
    width: 150,
  // }, {
  //   title: '特征说明',
  //   dataIndex: 'calMethod',
  //   key: 'calMethod',
  //   width: 150,
  }, {
    title: '特征维度',
    dataIndex: 'level1Type',
    key: 'level1Type',
    width: 150,
  render: (text: any, record) => (<Tag>{text}/{record.level2Type}</Tag>),
  }, {
    title: '创建人',
    dataIndex: 'createUser',
    key: 'createUser',
    width: 100,
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 120,
    render: (text: any) => moment(text).format(dateFormat2),
  }, {
    title: '特征状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: any) => {
      let dom:any;
      statusList.map((item)=>{
        if (item.value && item.value === text && item.color) {
          dom = <Tag color={item.color}>{text}</Tag>
        }
      })
      return dom
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text: any, record: { status: string; }) => {
      return(
        <div>
          <Button size="small" icon="inbox" style={{marginBottom: '2px',marginRight: '5px'}} onClick={ ()=>{viewFeatureModal(record)} }>查看</Button>
          <Button size="small" icon="form" style={{marginBottom: '2px',marginRight: '5px'}} type="primary" onClick={ ()=>{editFeature(record)} }>编辑</Button>
          { record.status === '已废弃' ? 
            <Popconfirm
              title="确定生效本特征吗？"
              placement="topRight"
              okText="确认"
              cancelText="取消"
              onConfirm={ () => {updateStatus(record.id, '已上线')}}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <Button size="small" icon="caret-right" style={{backgroundColor:'#87d068', borderColor: '#87d068'}} type="primary">生效</Button>
            </Popconfirm>
            :
            record.status === '已上线' ? 
              <Popconfirm
                title="是否要废弃本特征，这将会影响风控策略？"
                placement="topRight"
                okText="确认"
                cancelText="取消"
                onConfirm={ () => {updateStatus(record.id, '已废弃')}}
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              >
                <Button size="small" icon="poweroff" style={{backgroundColor:'#f50', borderColor: '#f50'}} type="primary">废弃</Button>
              </Popconfirm>
            :
            record.status === '未处理' ?
              <Popconfirm
                title="是否要处理本特征？"
                placement="topRight"
                okText="确认"
                cancelText="取消"
                onConfirm={ () => {updateStatus(record.id, '处理中')}}
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              >
                <Button size="small" icon="pushpin" style={{backgroundColor:'#9F79EE', borderColor: '#9F79EE'}} type="primary">处理</Button>
              </Popconfirm>
            :
              <Popconfirm
                title="确定生效本特征吗？"
                placement="topRight"
                okText="确认"
                cancelText="取消"
                onConfirm={ () => {updateStatus(record.id, '已上线')}}
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              >
                <Button size="small" icon="caret-right" style={{backgroundColor:'#87d068', borderColor: '#87d068'}} type="primary">生效</Button>
              </Popconfirm>
          }
        </div>
      )
    },
  }];
  
  const updateStatus = async(id,status) => {
    const ret = await axios.post(`/api/proxy/${appConfig.API_HOST}/feature/updateStatus`, {id: id, status: status});
    if(ret.data.status === 200) {
      let newFeatureList: any[] = [];
      newFeatureList = newFeatureList.concat(featureList); 
      newFeatureList.map((item)=>{
        if (item.id === id) {
          item.status = status
        }
      })
      setFeatureList(newFeatureList)
      message.success('修改成功');
    } else {
      message.error(ret.data.message);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = Object.assign({},seachPms)
        const mapData = ['featureCnName', 'featureEnName', 'level1Type', 'level2Type','status']
        mapData.map((item)=> {
          data[item] = values[item]
        })
        setSeachPms(data)
        setSearch(!search)
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

  const addNewFeature = () => {
    setAdddrawervisible(true);
    setDefaultform(defaultFeatureFormValue);
  }

  const viewFeatureModal = (record) => {
    setViewpopvisible(true);
    setViewFeature(record);
  }

  const editFeature = (record) => {
    setAdddrawervisible(true);
    setDefaultform(record);
  }
  const children = <Button type="primary" icon="plus" onClick={addNewFeature}>创建特征</Button>

  return (
    <> 
      <div className="main-content">
        <PageHeader current="特征管理" home="配置中心" children={children}/>
        <Card bordered={false} style={{ minHeight: 380 , marginTop: '-25px'}}>
          <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
            <Form.Item label="创建时间">
              {getFieldDecorator('creat_time', {
                initialValue: [moment().subtract(30, "days"), moment()],
              })(
                <RangePicker
                  format={dateFormat}
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeTime}
                  onOk={onOkTime}
                  style={{width: '240px'}}
                />
              )}
            </Form.Item>
            <Form.Item label="特征中文搜索">
              {getFieldDecorator('featureCnName', {
                initialValue: seachPms.featureCnName,
              })(
                <Input style={{width: 140}} placeholder="请输入策略集中文"/>
              )}
            </Form.Item>
            <Form.Item label="特征英文搜索">
              {getFieldDecorator('featureEnName', {
                initialValue: seachPms.featureEnName,
              })(
                <Input style={{width: 140}} placeholder="请输入策略集英文"/>
              )}
            </Form.Item>
            <Form.Item label="特征类型1">
              {getFieldDecorator('level1Type', {
                initialValue: seachPms.level1Type,
              })(
                <Select style={{width: 100}}>
                  <Option value='' key='all'>全部</Option>
                  {type1List.map(item => <Option value={item.value} key={item.value}>{item.value}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="特征类型2">
              {getFieldDecorator('level2Type', {
                initialValue: seachPms.level2Type,
              })(
                <Select style={{width: 100}}>
                  <Option value='' key='all'>全部</Option>
                  {type2List.map(item => <Option value={item.value} key={item.value}>{item.value}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="特征状态">
              {getFieldDecorator('status', {
                initialValue: seachPms.status,
              })(
                <Select style={{width: 100}}>
                  {statusList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
          </Form>
          <Table
            columns={column}
            loading = {loading}
            dataSource={featureList}
            rowKey={record => record.id}
          />
          <AddFeatureForm
            adddrawervisible={adddrawervisible}
            setAdddrawervisible={setAdddrawervisible}
            setFeatureList={setFeatureList}
            featureList={featureList}
            defaultform={defaultform}
            type1List={type1List}
            type2List={type2List}
          />
          <ViewFeature
            viewpopvisible={viewpopvisible}
            setViewpopvisible={setViewpopvisible}
            viewFeature={viewFeature}
          />
        </Card>
      </div>
    </>
  );
}
const WrappedDemo = Form.create({ name: 'validate_other' })(FeaturePage);
export default WrappedDemo;
