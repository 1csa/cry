import React, { Component } from 'react';
import { Layout, Card, Breadcrumb, Form, Select, Button, Table, Modal, Upload, Icon, DatePicker, Popconfirm, Input, InputNumber, message } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';
import axios from 'axios';
import moment from 'moment'
import XLSX from 'xlsx'

import './index.less';

const { Option } = Select
const { RangePicker } = DatePicker

// const API_HOST = 'http://test.operationtoolservice.go2yd.int.yidian-inc.com'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  user: UserModelState;
  auth: AuthModelState;
}

interface State {
  history: Object []
  addingModalvisible: boolean
  importingModalvisible: boolean
  targets: any []
  importedFileName: string
  importedTargets: any[]
  type: string
  account_id: string
  status: number
  offset: number
  total: number
}

class TimingFans extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    const currentUser = this.props.user.currentUser

    this.state = {
      history: [],
      addingModalvisible: false,
      importingModalvisible: false,
      targets: [{
        id: 0,
        account_id: '',
        type: 'UGC',
        target_fans_count: 10000,
        start_time: "2020-02-10 00:00:00",
        end_time: "2020-03-10 00:00:00",
        operator_uid: currentUser && currentUser.userId || '',
        operator_name: currentUser && currentUser.name || '',
      }],
      importedFileName: '',
      importedTargets: [],
      type: '',
      account_id: '',
      status: -1,
      offset: 0,
      total: 0
    }
  }

  historyColumns: Object[] = [{
      title: '自媒体ID/UID',
      dataIndex: 'account_id',
      key: 'account_id',
    }, {
      title: '账号类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '目标粉丝数',
      dataIndex: 'target_fans_count',
      key: 'target_fans_count',
    }, {
      title: '当前粉丝数',
      dataIndex: 'fans_count',
      key: 'fans_count',
    }, {
      title: '起止时间',
      dataIndex: 'operation_period',
      key: 'operation_period',
      render: (text: string, record: any) => (
        <div>
          <p>{record.start_time}</p>
          <p>至</p>
          <p>{record.end_time}</p>
        </div>
      ),
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <span>
          {
            state === 0 ? '未开始' :
            state === 1 ? '进行中' :
            state === 2 ? '已结束' :
            state === 3 ? '已取消' : '其它'
          }
        </span>
      ),
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }, {
      title: '创建人',
      dataIndex: 'operator_name',
      key: 'operator_name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: string, record: any) =>
        this.state.history.length >= 1 ? (
          <Popconfirm disabled={!(record.state === 0 || record.state === 1)} title="确定停止该条定时定量涨粉任务?" onConfirm={() => this.handleStopTask(record.id)}>
            <Button type="link" disabled={!(record.state === 0 || record.state === 1)}>停止</Button>
          </Popconfirm>
        ) : null
    }
  ]

  targetsColumns: Object[] = [{
      title: '自媒体ID/UID',
      dataIndex: 'account_id',
      key: 'account_id',
      render: (account_id: string, record: any, index: number) => <Input value={ account_id } onChange={ (e) => this.handleChangeTargetAccountId(e.target.value, index) }/>,
    }, {
      title: '账号类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: any, index: number) => {
        return <Select value={type} style={{ width: 90 }} onChange={(val: any) => this.handleChangeTargetType(val, index)}>
          <Option value="UGC">UGC</Option>
          <Option value="PGC">PGC</Option>
        </Select>
      },
    }, {
      title: '目标粉丝数',
      dataIndex: 'target_fans_count',
      key: 'target_fans_count',
      render: (target_fans_count: number, record: any, index: number) => <InputNumber value={ target_fans_count } onChange={ (val) => this.handleChangeTargetCount(val, index) }/>,
    }, {
      title: '起止时间',
      dataIndex: 'period',
      key: 'period',
      render: (text: string, record: any, index: number) => {
        return <RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={['开始时间', '结束时间']}
          value={[moment(record.start_time), moment(record.end_time)]}
          onChange={(dates, dateStrings) => this.handleChangeTargetPeriod(dateStrings, index)}
          style={{width: 400}}
        />
      },
    }, {
      key: 'action',
      render: (text: any, record: any, index: number) => (
        <Button disabled={ this.state.targets.length === 1} type="danger" size="small" onClick={ () => this.handleRemoveTarget(index) }>删除</Button>
      ),
    },
  ]

  async fetchHistory () {
    const {type, account_id, status, offset} = this.state

    const res = await axios.get(`${API_HOST}/interact/get-fake-configs?type=${type}&account_id=${account_id.trim().length === 0 ? -1 : account_id.trim()}&state=${status}&offset=${offset}&count=10`)

    if (res.data.code === 0) {
      this.setState({
        history: res.data.result,
        total: res.data.total
      })
    } else {
      message.error(`获取失败：${res.data.reason}`)
    }
  }

  handleStopTask = async (id: number) => {
    const res = await axios.get(`${API_HOST}/interact/update-fake-config?id=${id}&enable=false`)

    if (res.data.code === 0) {
      this.fetchHistory()

      message.success(`停止成功`)
    } else {
      message.error(`停止失败：${res.data.reason}`)
    }
  }

  handleShowAddingModal = () => {
    this.setState({
      addingModalvisible: true
    })
  }

  handleHideAddingModal = () => {
    this.setState({
      addingModalvisible: false
    })
  }

  handleChangeTargetAccountId (val: any, index: number) {
    const targets = this.state.targets

    targets[index].account_id = val

    this.setState({
      targets
    })
  }

  handleChangeTargetType (val: any, index: number) {
    const targets = this.state.targets

    targets[index].type = val

    this.setState({
      targets
    })
  }

  handleChangeTargetCount (val: any, index: number) {
    const targets = this.state.targets

    targets[index].target_fans_count = val

    this.setState({
      targets
    })
  }

  handleChangeTargetPeriod (val: any, index: number) {
    const targets = this.state.targets

    targets[index].start_time = val[0]
    targets[index].end_time = val[1]

    this.setState({
      targets
    })
  }

  handleRemoveTarget (index: number) {
    const targets = this.state.targets

    targets.splice(index, 1)

    this.setState({
      targets
    })
  }

  handleAddTarget = () => {
    const targets = this.state.targets
    const currentUser = this.props.user.currentUser

    targets.push({
      id: this.state.targets.length,
      account_id: '',
      type: 'UGC',
      target_fans_count: 10000,
      start_time: "2020-02-10 00:00:00",
      end_time: "2020-03-10 00:00:00",
      operator_uid: currentUser && currentUser.userId || '',
      operator_name: currentUser && currentUser.name || '',
    })

    this.setState({
      targets
    })
  }

  saveTargets = async (targets: any []) => {
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      console.log(target)

      if (target.account_id.trim().length === 0) {
        message.error('不能包含空自媒体ID/UID')

        return
      }
    }

    const res = await axios.post(`${API_HOST}/interact/add-fake-configs`, {
      data: targets.map(item => {
        item.account_id = +item.account_id
        item.operator_uid = +item.operator_uid

        delete item.id

        return item
      })
    })

    if (res.data.code === 0) {
      message.success('新增成功')
    } else {
      message.error(`新增失败：${res.data.reason}`)
    }

    const currentUser = this.props.user.currentUser

    this.setState({
      targets: [{
        id: 0,
        account_id: '',
        type: 'UGC',
        target_fans_count: 10000,
        start_time: "2020-02-10 00:00:00",
        end_time: "2020-03-10 00:00:00",
        operator_uid: currentUser && currentUser.userId || '',
        operator_name: currentUser && currentUser.name || '',
      }],
      importedFileName: '',
      importedTargets: []
    })

    setTimeout(() => this.fetchHistory(), 10)
  }

  handleAddingModalOK = async () => {
    await this.saveTargets(this.state.targets)

    this.handleHideAddingModal()
  }

  handleChangeType = (val: string) => {
    this.setState({
      type: val
    })
  }

  handleChangeAccountId = (val: string) => {
    this.setState({
      account_id: val
    })
  }

  handleChangeStatus = (val: number) => {
    this.setState({
      status: val
    })
  }

  handleShowImportingModal = () => {
    this.setState({
      importingModalvisible: true
    })
  }

  handleHideImportingModal = () => {
    this.setState({
      importingModalvisible: false
    })
  }

  handleImportTargets = (file: any) => {
    const currentUser = this.props.user.currentUser

    const reader = new FileReader()

    reader.onload = (e: any) => {
      const data = e.target.result;

      const wb = XLSX.read(data, {
          type: 'binary'
      })

      const tableData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: ['account_id', 'type', 'target_fans_count', 'period'], defval: ''})

      console.log(tableData)

      this.setState({
        importedFileName: file.name,
        importedTargets: tableData.slice(1).map((item: any) => {
          const period = item.period.split('至')

          item.account_id = `${item.account_id}`
          item.start_time = period[0]
          item.end_time = period[1]
          item.operator_uid = currentUser && currentUser.userId || '',
          item.operator_name = currentUser && currentUser.name || '',

          delete item.period

          return item
        })
      })
    }

    reader.readAsBinaryString(file)
  }

  handleImportingModalOK = async () => {
    await this.saveTargets(this.state.importedTargets)

    this.handleHideImportingModal()
  }

  handleChangePage = (page: number) => {
    console.log(page)

    this.setState({
      offset: (page - 1) * 10
    }, async () => await this.fetchHistory())
  }

  async componentDidMount () {
    const currentAuth = this.props.auth.currentAuth

    if (!currentAuth?.childAuths.includes('timing_fans')) {
      this.props.history.push('/no_auth')
    }

    this.fetchHistory()
  }

  render () {
    const { state } = this

    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>账号粉丝数</Breadcrumb.Item>
            <Breadcrumb.Item>定时定量涨粉</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <div style={{overflow: 'hidden' }}>
            <Button type="primary" icon="plus" onClick={ this.handleShowAddingModal } style={{ float: 'right' }}>
              新增操作
            </Button>
            <Button type="primary" icon="import" onClick={ this.handleShowImportingModal } style={{ float: 'right', marginRight: '15px' }}>
              批量导入
            </Button>

            <Form layout="inline">
              <Form.Item label="账号类型">
                <Select value={state.type} style={{ width: 90 }} onChange={this.handleChangeType}>
                  <Option value="">全部</Option>
                  <Option value="UGC">UGC</Option>
                  <Option value="PGC">PGC</Option>
                </Select>
              </Form.Item>
              <Form.Item label="自媒体ID/UID">
                <Input value={state.account_id} onChange={ (e) => this.handleChangeAccountId(e.target.value) }/>
              </Form.Item>
              <Form.Item label="状态">
                <Select value={state.status} style={{ width: 90 }} onChange={this.handleChangeStatus}>
                  <Option value={-1}>全部</Option>
                  <Option value={0}>未开始</Option>
                  <Option value={1}>进行中</Option>
                  <Option value={2}>已结束</Option>
                  <Option value={3}>已取消</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => this.fetchHistory()}>查询</Button>
              </Form.Item>
            </Form>
          </div>
          <Table dataSource={state.history} columns={this.historyColumns} rowKey={ (record: any): string => record.id } pagination={{total: state.total, onChange: this.handleChangePage, showTotal: (total, range) => `共${total}条`}} style={{ marginTop: '15px'}}/>
          <Modal
            title="新增操作"
            visible={this.state.addingModalvisible}
            onOk={this.handleAddingModalOK}
            onCancel={this.handleHideAddingModal}
            okText="确认"
            cancelText="取消"
            width={1000}
          >
            <Table columns={this.targetsColumns} dataSource={this.state.targets} pagination={ false } rowKey={ (record: any): string => record.id } />
            <Button disabled={ this.state.targets.length >= 20 } type="primary" icon="plus" size="small" onClick={ this.handleAddTarget } style={{ marginTop: '15px', marginLeft: '15px'}}>
              新增
            </Button>
          </Modal>
          <Modal
            title="批量导入定时定量涨粉任务"
            visible={this.state.importingModalvisible}
            onOk={this.handleImportingModalOK}
            onCancel={this.handleHideImportingModal}
            okText="确认"
            cancelText="取消"
          >
            <div>
              <span>模版：</span>
              <a href={'/static/assets/批量导入定时定量涨粉任务.xlsx'} target="_blank" rel="noopener noreferrer">批量导入定时定量涨粉任务.xlsx</a>
            </div>

            <div>{state.importedFileName}</div>
            <Upload disabled={state.importedTargets.length > 0} beforeUpload={ this.handleImportTargets }>
              <Button style={{marginTop: '15px'}}>
                <Icon type="upload" />上传文件
              </Button>
            </Upload>,
          </Modal>
        </Card>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(TimingFans);
