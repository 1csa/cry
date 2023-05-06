import React, { Component } from 'react';
import { Card, Breadcrumb, Form, Select, Button, Table, Modal, Input, message, Radio } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';
import axios from 'axios';
import { saveLog } from '../../../../common/Logger.js';

import './index.less';

const { Option } = Select

// const API_HOST = 'http://test.operationtoolservice.go2yd.int.yidian-inc.com'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  user: UserModelState;
  auth: AuthModelState;
}

interface Adding {
  type: string
  account_ids: string
  state: number
}

interface State {
  accounts: Object []
  addingModalvisible: boolean
  type: string
  account_id: string
  state: number
  offset: number
  total: number
  adding: Adding
}

class TuiConfig extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      accounts: [],
      addingModalvisible: false,
      type: '',
      account_id: '',
      state: -1,
      offset: 0,
      total: 0,
      adding: {
        type: 'UGC',
        account_ids: '',
        state: 1,
      }
    }
  }

  accountsColumns: Object[] = [{
      title: '自媒体ID/UID',
      dataIndex: 'account_id',
      key: 'account_id',
    }, {
      title: '账号类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '当前粉丝数',
      dataIndex: 'fans_count',
      key: 'fans_count',
    }, {
      title: '文章推一推美化/篇',
      dataIndex: 'tui_range',
      key: 'tui_range',
      render: (tui_range: number[]) => (
        `[${tui_range[0]}, ${tui_range[1]}]`
      ),
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <span>
          {
            state === 0 ? '已停止' :
            state === 1 ? '已开始' : '其它'
          }
        </span>
      ),
    }, {
      title: '操作时间',
      dataIndex: 'update_time',
      key: 'update_time',
    }, {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      render: (text: string, record: any) => (
        <div>
          <div>{record.operator_name}</div>
          <div>UID: {record.operator_uid}</div>
        </div>
      ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: string, record: any) => (
        <div>
          <Button type="primary" disabled={record.state === 1} onClick={() => this.handleUpdateTask(record.account_id, 1)}>启动</Button>
          <Button type="danger" disabled={record.state === 0} onClick={() => this.handleUpdateTask(record.account_id, 0)} style={{marginLeft: 10}}>停止</Button>
        </div>
      )
    }
  ]

  async fetchAccounts () {
    const {type, account_id, state, offset} = this.state

    const res = await axios.get(`${API_HOST}/interact/get-tui-accounts?type=${type}&account_id=${account_id.trim().length === 0 ? -1 : account_id.trim()}&state=${state}&offset=${offset}&count=10`)

    if (res.data.code === 0) {
      this.setState({
        accounts: res.data.result,
        total: res.data.total
      })
    } else {
      message.error(`获取失败：${res.data.reason}`)
    }
  }

  handleUpdateTask = async (id: number, state: number) => {
    const currentUser = this.props.user.currentUser

    const res = await axios.get(`${API_HOST}/interact/update-tui-account?account_id=${id}&state=${state}&operator_name=${currentUser?.name}&operator_uid=${currentUser?.userId}`)

    if (res.data.code === 0) {
      this.fetchAccounts()

      message.success(`${state === 1 ? '启动' : '停止'}成功`)
    } else {
      message.error(`${state === 1 ? '启动' : '停止'}失败：${res.data.reason}`)
    }

    saveLog({
      log_source: { tag: 'interaction' },
      action_method: 'update-tui-account',
      target_data: {
        account_id: id,
        state: state,
        operator_name: currentUser?.name,
        operator_uid: currentUser?.userId,
        res: res.data
      }
    })
  }

  handleGotoSwitchConfig = () => {
    this.props.history.push('/tui_config')
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

  handleAddTask = async () => {
    const { adding } = this.state
    const currentUser = this.props.user.currentUser

    const res = await axios.get(`${API_HOST}/interact/add-tui-accounts?type=${adding.type}&account_ids=${adding.account_ids}&state=${adding.state}&operator_name=${currentUser?.name}&operator_uid=${currentUser?.userId}`)

    if (res.data.code === 0) {
      this.fetchAccounts()

      this.setState({
        adding: {
          type: 'UGC',
          account_ids: '',
          state: 1,
        }
      })

      message.success(`新增成功`)
    } else {
      message.error(`新增失败：${res.data.reason}`)
    }

    saveLog({
      log_source: { tag: 'interaction' },
      action_method: 'add-tui-account',
      target_data: {
        type: adding.type,
        account_ids: adding.account_ids,
        state: adding.state,
        operator_name: currentUser?.name,
        operator_uid: currentUser?.userId,
        res: res.data
      }
    })
  }

  handleAddingModalOK = async () => {
    await this.handleAddTask()

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
      state: val
    })
  }

  handleChangePage = (page: number) => {
    this.setState({
      offset: (page - 1) * 10
    }, async () => await this.fetchAccounts())
  }

  handleChangeAddingType = (val: string) => {
    const { adding } = this.state

    adding.type = val

    this.setState({
      adding
    })
  }

  handleChangeAddingAccountId = (val: string) => {
    const { adding } = this.state

    adding.account_ids = val

    this.setState({
      adding
    })
  }

  handleChangeAddingState = (e: any) => {
    const { adding } = this.state

    adding.state = e.target.value

    this.setState({
      adding
    })
  }

  async componentDidMount () {
    const currentAuth = this.props.auth.currentAuth

    if (!currentAuth?.childAuths.includes('tui')) {
      this.props.history.push('/no_auth')
    }

    this.fetchAccounts()
  }

  render () {
    const { state } = this
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    }

    console.log(this.props.user.currentUser)

    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>推一推开关</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <div style={{overflow: 'hidden' }}>
            <Button type="primary" onClick={ this.handleGotoSwitchConfig } style={{ float: 'right' }}>
              配置推一推
            </Button>
            <Button type="primary" icon="plus" onClick={ this.handleShowAddingModal } style={{ float: 'right', marginRight: '10px' }}>
              新增操作
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
                <Select value={state.state} style={{ width: 90 }} onChange={this.handleChangeStatus}>
                  <Option value={-1}>全部</Option>
                  <Option value={0}>已停止</Option>
                  <Option value={1}>已开始</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => this.fetchAccounts()}>查询</Button>
              </Form.Item>
            </Form>
          </div>
          <Table dataSource={state.accounts} columns={this.accountsColumns} rowKey={ (record: any): string => `${record.account_id}${Math.random()}` } pagination={{total: state.total, onChange: this.handleChangePage, showTotal: (total, range) => `共${total}条`}} style={{ marginTop: '15px'}}/>
          <Modal
            title="账号推一推"
            visible={this.state.addingModalvisible}
            onOk={this.handleAddingModalOK}
            onCancel={this.handleHideAddingModal}
            okText="确认"
            cancelText="取消"
            width={500}
          >
            <Form {...formItemLayout}>
              <Form.Item label="账号类型">
                <Select value={state.adding.type} style={{ width: 90 }} onChange={this.handleChangeAddingType}>
                  <Option value="UGC">UGC</Option>
                  <Option value="PGC">PGC</Option>
                </Select>
              </Form.Item>
              <Form.Item label="UID">
                <Input value={state.adding.account_ids} onChange={ (e) => this.handleChangeAddingAccountId(e.target.value) }/>
              </Form.Item>
              <Form.Item label="达人推一推">
                <Radio.Group onChange={this.handleChangeAddingState} value={state.adding.state}>
                  <Radio value={1}>开始</Radio>
                  <Radio value={0}>停止</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(TuiConfig);
