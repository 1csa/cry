import React, { useState, useEffect, ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import { Form, Select, Input } from 'formik-antd'
import { Card, Button, Table, Row, Col, Tooltip, Icon, Divider, Modal, Spin, message, Drawer } from 'antd'
import PageHeader from '@/components/PageHeader'
import { ColumnProps } from 'antd/es/table'
import { user_layer_list } from '@/data'
import { ExperimentDetailListProps, ExperimentSearchProps, ExperimentSettingProps, ExperimentIndicatorDetailListProps } from '@/config/experiment/experiment'
import { getExperimentList, getPushtypeList, getDaysByBucketName, getBucketSetting, submitTask, queryTaskProgress, 
  getTaskResult, updateBucketSetting, submitTasks, queryTasksProgress, getTasksResult } from '@/services/experimentService'
import { getCookieByName } from '@/utils/utils'

import 'antd/dist/antd.css'
import "./index.less";

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const { confirm } = Modal

interface GidPushtypeOptionsProps {
  id: string
  name: string
}

interface OtherOptionsProps {
  key: string
  value: string
}

const formItemLayout = {
  labelCol: { sm: { span: 6 }},
  wrapperCol: { sm: { span: 18 }},
}

const formItemLayout1 = {
  labelCol: { sm: { span: 5 }},
  wrapperCol: { sm: { span: 18 }},
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 18, offset: 6 }}
}

const tailFormItemLayout1 = {
  wrapperCol: { sm: { span: 18, offset: 5 }}
}

const ExperimentDetail: React.FC = () => {
  // list
  const [experimentDetailList, setExperimentDetailList] = useState<Array<ExperimentDetailListProps>>([])
  const [experimentIndicatorDetailList, setExperimentIndicatorDetailList] = useState<Array<ExperimentIndicatorDetailListProps>>([])
  // visible
  const [visible, setVisible] = useState<boolean>(false)
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  // current experiment detail
  const [currentExperimentDetail, setCurrentExperimentDetail] = useState<ExperimentDetailListProps>({})
  // bucket name options
  const [bucketNameOptions, setBucketNameOptions] = useState<Array<OtherOptionsProps>>([])
  // bucket mode options
  const [bucketModeOptions, setBucketModeOptions] = useState<Array<OtherOptionsProps>>([])
  // gid options
  const [gidOptions, setGidOptions] = useState<Array<GidPushtypeOptionsProps>>([])
  // pushtype options
  const [pushtypeOptions, setPushtypeOptions] = useState<Array<GidPushtypeOptionsProps>>([])
  // candidate days options
  const [daysOptions, setDaysOptions] = useState<Array<string>>([])
  // loading
  const [loading, setLoading] = useState<boolean>(false)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  // loading text
  const [loadingText, setLoadingText] = useState<string>('')
  const [drawerLoadingText, setDrawerLoadingText] = useState<string>('')
  // p_day filters
  const [pDayFilter, setPDayFilter] = useState<Array<{text: string, value: string}>>([])

  const { detail } = useParams()

  const columns: ColumnProps<ExperimentDetailListProps>[] = [{
    title: '数据生成时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 190
  }, {
    title: '实验名称',
    dataIndex: 'bucket_name',
    key: 'bucket_name',
    width: 200
  }, {
    title: '实验组',
    dataIndex: 'bucket_mode',
    key: 'bucket_mode',
    width: 100
  }, {
    title: '用户分层',
    dataIndex: 'user_layer',
    key: 'user_layer',
    width: 100
  }, {
    title: '观察期',
    dataIndex: 'days',
    key: 'days',
    width: 200,
  }, {
    title: 'gid',
    dataIndex: 'gid',
    key: 'gid',
    width: 100
  }, {
    title: 'push_type',
    dataIndex: 'push_type',
    key: 'push_type',
    width: 100
  }, {
    title: '时效性',
    dataIndex: 'priority',
    key: 'priority',
    width: 100
  }, {
    title: 'CTR',
    dataIndex: 'ctr_pv',
    key: 'ctr_pv',
    width: 100
  }, {
    title: '真实 CTR',
    dataIndex: 'real_ctr_pv',
    key: 'real_ctr_pv',
    width: 100
  }, {
    title: '转化率',
    dataIndex: 'transform_pv',
    key: 'transform_pv',
    width: 100
  }, {
    title: '关闭率',
    dataIndex: 'noti_off_uv',
    key: 'noti_off_uv',
    width: 100
  }, {
    title: '真实转化率',
    dataIndex: 'real_transform_pv',
    key: 'real_transform_pv',
    width: 110
  }, {
    title: 'PUSH 拉活率',
    dataIndex: 'pushLhl',
    key: 'pushLhl',
    width: 130
  }, {
    title: '操作',
    key: 'operate',
    width: 100,
    fixed: 'right',
    render: (text: any, record: ExperimentDetailListProps): ReactNode => {
      return (
        <span>
          <a onClick={ () => openObservationSetting(record) }><Tooltip placement="top" title="观察期设置"><Icon style={{ fontSize: '16px' }} type="setting" /></Tooltip></a>
          <Divider type="vertical" />
          <a onClick={ () => openIndicatorDetail(record) }><Tooltip placement="top" title="指标明细查看"><Icon style={{ fontSize: '16px' }} type="eye" /></Tooltip></a>
          {/* <Divider type="vertical" />
          <a onClick={}><Tooltip placement="top" title="指标预警"><Icon style={{ fontSize: '16px' }} type="warning" /></Tooltip></a> */}
        </span>
      )
    }
  }]

  const indicatorDetailColumns: ColumnProps<ExperimentIndicatorDetailListProps>[] = [{
    title: '日期',
    dataIndex: 'p_day',
    key: 'p_day',
    width: 130,
    fixed: 'left',
    filters: pDayFilter,
    onFilter: (value: string, record: ExperimentIndicatorDetailListProps) => record.p_day.indexOf(value) === 0
  }, {
    title: '召回次数',
    children: [{
      title: '对照组',
      dataIndex: 'recall_pv.base',
      key: 'recall_pv.base',
    }, {
      title: '实验组',
      dataIndex: 'recall_pv.exp',
      key: 'recall_pv.exp',
    }]
  }, {
    title: '策略次数',
    children: [{
      title: '对照组',
      dataIndex: 'strategy_pv.base',
      key: 'strategy_pv.base',
    }, {
      title: '实验组',
      dataIndex: 'strategy_pv.exp',
      key: 'strategy_pv.exp',
    }]
  }, {
    title: '推送次数',
    children: [{
      title: '对照组',
      dataIndex: 'push_pv.base',
      key: 'push_pv.base',
    }, {
      title: '实验组',
      dataIndex: 'push_pv.exp',
      key: 'push_pv.exp',
    }]
  }, {
    title: '到达次数',
    children: [{
      title: '对照组',
      dataIndex: 'arrive_pv.base',
      key: 'arrive_pv.base',
    }, {
      title: '实验组',
      dataIndex: 'arrive_pv.exp',
      key: 'arrive_pv.exp',
    }]
  }, {
    title: 'DAU',
    dataIndex: 'dau',
    key: 'dau'
  }, {
    title: '关闭率(全局)',
    dataIndex: 'noti_off_rate',
    key: 'noti_off_rate'
  }]

  useEffect(() => {
    getBucketOptions()
    getPushtypeOptions()
    getDaysOptions()
    search({ bucket_name: detail! })
  }, [])

  useEffect(() => {
    initExperimentDetail()
  }, [currentExperimentDetail])

  const getBucketOptions = async () => {
    const { status, data } = await getExperimentList(detail)

    if (status === 'success') {
      let tempBucketNameOptions = [{
        key: data[0].id, 
        value: data[0].bucket_name
      }]
      let tempBucketModeOptions = data[0].bucket_config.map((item: any) => ({ key: item.bucket_mode_id, value: item.bucket_mode }))
      
      setBucketNameOptions(tempBucketNameOptions)
      setBucketModeOptions(tempBucketModeOptions)
    }
  }

  const getPushtypeOptions = async () => {
    const { status, push_type, gid } = await getPushtypeList()
    if (status === 'success') {
      gid.unshift({ id: '全部', name: '全部'})
      push_type.unshift({ id: '全部', name: '全部'})

      setGidOptions(gid)
      setPushtypeOptions(push_type)
    }
  }

  const getDaysOptions = async () => {
    const { status, data: { candidate_days } } = await getDaysByBucketName(detail!)
    if (status === 'success') {
      setDaysOptions(candidate_days)
    }
  }

  // init search form
  const initSearch = (): ExperimentSearchProps => {
    const init = {
      bucket_name: detail || '',
      bucket_mode: '',
      user_layer: '',
      gid: '',
      push_type: '',
      priority: ''
    }
    // console.log(init)
    return init
  }

  // search experiment detail data
  const search = async (values: ExperimentSearchProps) => {
    setLoading(true)
    const { query_id, task_id } = await submitTask(values)
    let interval = setInterval(async () => {
      const { status, progress, state } = await queryTaskProgress(query_id, task_id)
      setLoadingText(`${progress}%, ${state}`)
      // console.log(progress, '-----', state)
      if (progress === '100') {
        clearInterval(interval)
        const { status, data } = await getTaskResult(query_id, task_id)
        if (status === 'success') {
          setExperimentDetailList(data)
          setLoading(false)
        } else {
          message.error(`获取实验列表失败!`)
        }
      }
    }, 1000)
  }

  // open observation setting modal
  const openObservationSetting = async (record: ExperimentDetailListProps) => {
    let { bucket_name, bucket_mode } = record
    const { status, data } = await getBucketSetting(bucket_name, bucket_mode)
    
    // record 这个类型定义 都是字符串 所以还得把数组 转成字符串 在 初始化的时候再转成数组
    if (status === 'success') {
      if (data.length) {
        record.user_layer = data[0].user_layer.join(',')
        record.gid = data[0].gid.join(',')
        record.push_type = data[0].push_type.join(',')
        record.priority = data[0].priority.join(',')
        record.days = data[0].days.join(',')
      } else {
        record.days = ''
      }
    } else {
      message.error(`获取观察期数据失败！`)
    }
    
    setVisible(true)
    setCurrentExperimentDetail(record)
  }

  // get indicator detail
  const getIndicatorDetail = async (values: ExperimentSearchProps) => {
    setDrawerLoading(true)
    const { app_query_id, app_task_id, index_query_id, index_task_id } = await submitTasks(values)
    let interval = setInterval(async () => {
      const { progress, state } = await queryTasksProgress(app_query_id, app_task_id, index_query_id, index_task_id)
      setDrawerLoadingText(`${progress}%, ${state}`)
      if (progress === '100') {
        clearInterval(interval)
        const { status, data } = await getTasksResult(app_query_id, app_task_id, index_query_id, index_task_id)
        if (status === 'success') {
          // format p_day filter
          let tempArr = [...new Set(data.map((item: ExperimentIndicatorDetailListProps) => item.p_day))] as Array<string>
          let tempFilter = tempArr.map((item: string) => ({ text: item, value: item }))
          setPDayFilter(tempFilter)

          setExperimentIndicatorDetailList(data)
          setDrawerLoading(false)
        } else {
          message.error(`获取指标明细失败!`)
        }
      }
    }, 1000)
  }

  // open indicator detail drawer
  const openIndicatorDetail = (record: ExperimentDetailListProps) => {
    setDrawerVisible(true)
    setCurrentExperimentDetail(record)
    getIndicatorDetail(record)
  }

  // render bucket name options
  const renderBucketNameOptions = (): ReactNode => {
    return bucketNameOptions.map((item: any) => {
      return <Option key={ item.key }>{ item.value }</Option>
    })
  }

  // render bucket mode options
  const renderBucketModeOptions = (): ReactNode => {
    return bucketModeOptions.map((item: any) => {
      return <Option key={ item.key } value={ item.value }>{ item.value }</Option>
    })
  }

  // render gid options
  const renderGidOptions = (): ReactNode => {
    return gidOptions.map((item: GidPushtypeOptionsProps) => {
      return <Option key={ item.id } value={ item.id }>{ item.name }</Option>
    })
  }

  // render pushtype options
  const renderPushtypeOptions = (): ReactNode => {
    return pushtypeOptions.map((item: GidPushtypeOptionsProps) => {
      return <Option key={ item.id } value={ item.id }>{ item.name }</Option>
    })
  }

  // render user layer options
  const renderUserLayerOptions = (): ReactNode => {
    return user_layer_list.map((item: any) => {
      return <Option key={ item.value } value={ item.label }>{ item.label }</Option>
    })
  }

  // render priority options
  const renderPriorityOptions = (): ReactNode => {
    return ['全部', 'break', '非break'].map((item: string) => {
      return <Option key={ item }>{ item }</Option>
    })
  }

  // render days options
  const renderDaysOptions = (): ReactNode => {
    return daysOptions.map((item: string) => {
      return <Option key={ item }>{ item }</Option>
    })
  }

  // init experiment detail
  const initExperimentDetail = (): ExperimentSettingProps => {
    let temp: ExperimentSettingProps = {
      email: getCookieByName('JEMAILID'),
      days: [],
      bucket_name: detail,
      bucket_mode: [],
      user_layer: [],
      gid: [],
      push_type: [],
      priority: [],
    }

    if (Object.keys(currentExperimentDetail).length) {
      temp.days = currentExperimentDetail.days.split(',') || []
      temp.bucket_mode = currentExperimentDetail.bucket_mode.split(',') || []
      temp.user_layer = currentExperimentDetail.user_layer.split(',') || []
      temp.gid = currentExperimentDetail.gid.split(',') || []
      temp.push_type = currentExperimentDetail.push_type.split(',') || []
      temp.priority = currentExperimentDetail.priority.split(',') || []
    }
    return temp
  }

  // save
  const save = async (values: ExperimentSettingProps) => {
    const { status } = await updateBucketSetting(values)
    if (status === 'success') {
      confirm({
        title: '提示',
        content: '是否按照新设置观察期计算显著性数据？',
        onOk () {
          message.info('数据正在计算，请稍后刷新页面进行查看', 5)
        },
        onCancel () {
          message.info('从明天开始，先属性数据将按照新设置的观察周期进行计算', 5)
        }
      })
    }
  }

  return (
    <div className="experiment">
      <PageHeader currentMenu="实验列表" currentSubMenu="实验详情" />
      <Card className="experiment-content">
        <Formik
          initialValues={ initSearch() }
          onSubmit={ (values: ExperimentSearchProps) => search(values) }
          enableReinitialize={ true }
        >
          {
            () => (
              <Form>
                <Row gutter={ 24 }>
                  <Col span={ 8 }>
                    <FormItem name="bucket_name" label="实验名称" {...formItemLayout}>
                      <Select 
                        name="bucket_name"
                        placeholder="请选择实验名称"
                      >
                        { renderBucketNameOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="bucket_mode" label="实验组" {...formItemLayout}>
                      <Select 
                        name="bucket_mode"
                        placeholder="请选择实验组"
                        allowClear
                      >
                        { renderBucketModeOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="user_layer" label="用户分层" {...formItemLayout}>
                      <Select 
                        name="user_layer"
                        placeholder="请选择用户分层"
                        allowClear
                      >
                        { renderUserLayerOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="gid" label="gid" {...formItemLayout}>
                      <Select 
                        name="gid"
                        placeholder="请选择 gid"
                        allowClear
                      >
                        { renderGidOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="push_type" label="push_type" {...formItemLayout}>
                      <Select 
                        name="push_type"
                        placeholder="请选择 push_type"
                        allowClear
                      >
                        { renderPushtypeOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="priority" label="时效性" {...formItemLayout}>
                      <Select 
                        name="priority"
                        placeholder="请选择时效性"
                        allowClear
                      >
                        { renderPriorityOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="operate" {...tailFormItemLayout}>
                      <Button type="primary" icon="search" htmlType="submit">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            )
          }
        </Formik>
        <Spin spinning={ loading } tip={ loadingText }>
        <Table 
          columns={ columns }
          dataSource={ experimentDetailList }
          rowKey={ (render: ExperimentDetailListProps, index: number) => `${render.create_time}_${render.bucket_mode}_${render.push_type}_${render.priority}_${render.user_layer}_${render.gid}_${render.push_type}_${index}` }
          scroll={{ x: '100%' }}
          bordered
        />
        </Spin>
      </Card>
      <Modal 
        title={ `${detail} 观察期设置` }
        visible={ visible }
        width={ 800 }
        footer={ null }
        onCancel={ () => setVisible(false) }
      >
        <Formik
          initialValues={ initExperimentDetail() }
          onSubmit={ (values: ExperimentSettingProps) => save(values) }
          enableReinitialize={ true }
        >
          {
            () => (
              <Form {...formItemLayout1}>
                <FormItem name="days" label="设置观察日期">
                  <Select
                    name="days"
                    mode="multiple"
                    placeholder="请选择观察期"
                  >
                    { renderDaysOptions() }
                  </Select>
                </FormItem>
                <FormItem name="bucket_mode" label="实验组">
                  <Select
                    name="bucket_mode"
                    mode="multiple"
                    placeholder="请选择实验组"
                  >
                    { renderBucketModeOptions() }
                  </Select>
                </FormItem>
                <FormItem name="user_layer" label="用户分层">
                  <Select
                    name="user_layer"
                    mode="multiple"
                    placeholder="请选择用户分层"
                  >
                    { renderUserLayerOptions() }
                  </Select>
                </FormItem>
                <FormItem name="gid" label="gid">
                  <Select
                    name="gid"
                    mode="multiple"
                    placeholder="请选择 gid"
                  >
                    { renderGidOptions() }
                  </Select>
                </FormItem>
                <FormItem name="push_type" label="push_type">
                  <Select
                    name="push_type"
                    mode="multiple"
                    placeholder="请选择 pushtype"
                  >
                    { renderPushtypeOptions() }
                  </Select>
                </FormItem>
                <FormItem name="priority" label="时效性">
                  <Select
                    name="priority"
                    mode="multiple"
                    placeholder="请选择时效性"
                  >
                    { renderPriorityOptions() }
                  </Select>
                </FormItem>
                <FormItem name="operate1" {...tailFormItemLayout1}>
                  <Button type="primary" icon="save" htmlType="submit">保存</Button>
                  <Button icon="rollback" style={{ marginLeft: '20px' }} onClick={ () => setVisible(false) }>取消</Button>
                </FormItem>
              </Form>
            )
          }
        </Formik>
      </Modal>
      <Drawer
        title=""
        placement="bottom"
        closable={ false }
        onClose={ () => setDrawerVisible(false) }
        visible={ drawerVisible }
        height={ 550 }
      >
        <Formik
          initialValues={ currentExperimentDetail }
          onSubmit={ (values: ExperimentSearchProps) => getIndicatorDetail(values) }
          enableReinitialize={ true }
        >
          {
            () => (
              <Form>
                <Row gutter={ 24 }>
                  <Col span={ 4 }>
                    <FormItem name="bucket_name" label="实验名称" {...formItemLayout}>
                      <Select 
                        name="bucket_name"
                        placeholder="请选择实验名称"
                      >
                        { renderBucketNameOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="bucket_mode" label="实验组" {...formItemLayout}>
                      <Select 
                        name="bucket_mode"
                        placeholder="请选择实验组"
                        allowClear
                      >
                        { renderBucketModeOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="user_layer" label="用户分层" {...formItemLayout}>
                      <Select 
                        name="user_layer"
                        placeholder="请选择用户分层"
                        allowClear
                      >
                        { renderUserLayerOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="gid" label="gid" {...formItemLayout}>
                      <Select 
                        name="gid"
                        placeholder="请选择 gid"
                        allowClear
                      >
                        { renderGidOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="push_type" label="push_type" {...formItemLayout}>
                      <Select 
                        name="push_type"
                        placeholder="请选择 push_type"
                        allowClear
                      >
                        { renderPushtypeOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="priority" label="时效性" {...formItemLayout}>
                      <Select 
                        name="priority"
                        placeholder="请选择时效性"
                        allowClear
                      >
                        { renderPriorityOptions() }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={ 4 }>
                    <FormItem name="operate3" {...tailFormItemLayout}>
                      <Button type="primary" icon="search" htmlType="submit">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            )
          }
        </Formik>
        <Spin spinning={ drawerLoading } tip={ drawerLoadingText }>
        <Table 
          columns={ indicatorDetailColumns }
          dataSource={ experimentIndicatorDetailList }
          rowKey={ (render: ExperimentIndicatorDetailListProps, index: number) => `${index}` }
          scroll={{ y: '300px' }}
          bordered
        />
        </Spin>
      </Drawer>
    </div>
  )
}

export default ExperimentDetail