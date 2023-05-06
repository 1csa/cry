import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { connect, routerRedux } from 'dva'
import { Card, Form, Input, Select, Table, message, Button, Icon, Divider, Popconfirm } from 'antd';

import { getPoliciesList, saveOrUpdate } from '@/services/risk'
import { changeNumToDateString } from '@/utils/common'

import { FormProps, searchValues, itemData } from './typing'

const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';

const FeaturePage: FC<FormProps> = (props: FormProps) => {

  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = props.form;
  const { deviceType, strategyType, sceneType, activeNameList  } = props

  const [loading, setLoading] = useState<boolean>(false);
  const [tableList, setTableList]  = useState([]);

  useEffect(() => {
    triggerSearch()
  }, [])

  const stopData = async (record: itemData, flag: number) => {
    record.status = flag
    const res = await saveOrUpdate(record)
    if (res.data.status === 200) {
      if (flag === 1) {
        message.success('启用成功')
      } else {
        message.success('停用成功')
      }
      triggerSearch()
    } else {
      message.error(res.data.message)
    }
  }

  const triggerSearch = () => {
    validateFieldsAndScroll((err: any, values: searchValues) => {
      if (!err) {
        if (values.riskType === '') {
          delete values.riskType
        }
        if (values.sceneType === '') {
          delete values.sceneType
        }
        getList(values)
      }
    });
  }

  const column = [{
    title: '策略ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '策略名',
    dataIndex: 'codeName',
    key: 'codeName',
  },
  {
    title: '应用端',
    dataIndex: 'appNames',
    key: 'appNames',
    render: (text: string) => (
      <div>
        {text ? text : '全部'}
      </div>)
  },
  {
    title: '策略类型',
    dataIndex: 'riskType',
    key: 'riskType',
    width: '95px',
    render: (text: string) => (
      <div>
        {text ? text : '全部'}
      </div>)
  },
  {
    title: '场景类型',
    dataIndex: 'sceneType',
    key: 'sceneType',
    width: '95px',
    render: (text: string) => (
      <div>
        {text ? text : '全部'}
      </div>)
  },
  {
    title: '策略分数',
    dataIndex: 'score',
    key: 'score',
    width: '90px'
  },
  {
    title: '灰度比例',
    dataIndex: 'proportion',
    key: 'proportion',
    width: '95px'
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    width: '95px',
    render: (text: number) => (
      <div>
        {text === 1 ? '已启用' : '已停用'}
      </div>)
  },
  {
    title: '最后操作人',
    dataIndex: 'updateUser',
    key: 'updateUser',
    render: (text: string, record: any) => (
      <div>
        {text} <br/> 
        {changeNumToDateString(record.updateTime)}
      </div>)
  },
  // {
  //   title: '最后操作时间',
  //   dataIndex: 'updateTime',
  //   key: 'updateUser',
  //   render: (text: string, record: any) => (
  //     <div>
  //       {text} - {changeNumToDateString(record.updateTime)}
  //     </div>)
  // },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: '150px',
    render: (text: any, record: itemData) => {
      return(
        <div>
          <a onClick={()=>{viewFeatureModal(record)}}>查看</a>
          <Divider type="vertical" />
          <a type="primary" onClick={() => {editFeature(record)}}>编辑</a>
          <Divider type="vertical" />
          {
            record.status === 1 ?
            <Popconfirm
              title="停用后该策略将失效，是否确认停用"
              placement="topRight"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {stopData(record, -1)}}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <a>停用</a>
            </Popconfirm> :
            <Popconfirm
              title="是否启用"
              placement="topRight"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {stopData(record, 1)}}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <a>启用</a>
            </Popconfirm>
          }
          {/* <Popconfirm
            title="停用后该策略将失效，是否确认停用"
            placement="topRight"
            okText="确认"
            cancelText="取消"
            onConfirm={() => {stopData(record,)}}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a>停用</a>
          </Popconfirm> */}
          {/* <Divider type="vertical" /> */}
          {/* <Popconfirm
            title="是否确认删除？"
            placement="topRight"
            okText="确认"
            cancelText="取消"
            onConfirm={() => {updateStatus(record.id, '已上线')}}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a>删除</a>
          </Popconfirm> */}
        </div>
      )
    },
  }];
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    validateFieldsAndScroll((err: any, values: searchValues) => {
      if (!err) {
        if (values.riskType === '') {
          delete values.riskType
        }
        if (values.sceneType === '') {
          delete values.sceneType
        }
        getList(values)
      }
    });
  }

  const getList = async (obj: searchValues) => {
    const res = await getPoliciesList({...obj, ...{offset: 0, limit: 10000}})
    setLoading(false);
    if (res.status === 200) {
      if (res.data.data.list.length) {
        setTableList(res.data.data.list)
      } else {
        setTableList([])
        message.warning('没有匹配的内容')
      }
    }
  }

  const goToConfigureDetailPage = (flag: string, obj = {}) => {
    const { dispatch } = props
    dispatch(routerRedux.push({
      pathname: '/dispose/configureDetail',
      state: { flag: flag, record: obj }
    }))
  }

  const viewFeatureModal = (record: itemData) => {
    goToConfigureDetailPage('look', record)
  }

  const editFeature = (record: itemData) => {
    goToConfigureDetailPage('edit', record)
  }
  const children = <Button type="primary" icon="plus" onClick={() => {goToConfigureDetailPage('new')}}>
    新建策略
  </Button>
  console.log(deviceType)
  return (
    <>
      <div className="main-content">
        <PageHeader current="配置管理" home="配置中心" children={children}/>
        <Card bordered={false} style={{ minHeight: 380 , marginTop: '-25px'}}>
          <Form layout="inline" onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
          <Form.Item label="应用端">
              {getFieldDecorator('appId', {
                initialValue: ''
              })(
                <Select style={{width: 100}}>
                  <Option value='' key='all'>全部</Option>
                  {
                    deviceType.map(item => {
                      return <Option value={item.value} key={item.id}>{item.cnValue}</Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
          <Form.Item label="策略类型">
            {getFieldDecorator('riskType', {
              initialValue: ''
            })(
              <Select style={{width: 100}}>
                <Option value='' key='all'>全部</Option>
                {
                  strategyType.map(item => {
                    return <Option value={item.value} key={item.id}>{item.value}</Option>
                  })
                }
              </Select>
              )}
            </Form.Item>
          <Form.Item label="场景类型">
            {getFieldDecorator('sceneType', {
              initialValue: ''
            })(
              <Select style={{width: 100}}>
                <Option value='' key='all'>全部</Option>
                {
                  sceneType.map(item => {
                    return <Option value={item.cnValue} key={item.id}>{item.cnValue}</Option>
                  })
                }
              </Select>
              )}
            </Form.Item>
            <Form.Item label="策略ID">
              {getFieldDecorator('policiesId', {})(
                <Input style={{width: 140}} placeholder="请输入策略id"/>
              )}
            </Form.Item>
            <Form.Item label="策略名称">
              {getFieldDecorator('codeName', {})(
                <Input style={{width: 140}} placeholder="请输入策略名称"/>
              )}
            </Form.Item>
            <Form.Item label="启用状态">
            {getFieldDecorator('status', {
              initialValue: ''
            })(
              <Select style={{width: 100}}>
                <Option value='' key='all'>全部</Option>
                <Option value='1' key='1'>已启用</Option>
                <Option value='-1' key='-1'>已停用</Option>
              </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={() => { resetFields() }}>重置</Button>
            </Form.Item>
          </Form>
          <Table
            columns={column}
            scroll={{ x: 1400 }}
            loading={loading}
            dataSource={tableList}
          />
        </Card>
      </div>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    deviceType: state.global.deviceType,
    strategyType: state.global.strategyType,
    sceneType: state.global.sceneType,
    activeNameList: state.global.activeNameList,
  }
}

const WrappedDemo = connect(mapStateToProps)(Form.create()(FeaturePage));
export default WrappedDemo;

