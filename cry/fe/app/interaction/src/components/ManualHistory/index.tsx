import React, { Component } from 'react';
import { Layout, Card, Button, Table, Modal, Input, InputNumber, message } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import axios from 'axios';

import './index.less';

const { Content } = Layout;

// const API_HOST = 'http://10.126.150.17:8810'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  pathname?: string;
  user: UserModelState;
}

interface State {
  history: Object []
  visible: boolean
  targets: any []
}

class MannualHistory extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      history: [],
      visible: false,
      targets: [{
        id: 0,
        targetId: '',
        count: 0,
      }]
    }
  }

  historyColumns: Object[] = [
    {
      title: '目标id',
      dataIndex: 'target_id',
      key: 'target_id',
    },
    {
      title: '增加数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '操作人',
      dataIndex: 'operator_name',
      key: 'operator_name',
    },
    {
      title: '操作时间',
      dataIndex: 'creatAt',
      key: 'creatAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span>
          { status === 'success' ? '已完成' : '进行中' }
        </span>
      ),
    },
  ]

  targetsColumns: Object[] = [
    {
      title: '目标Id',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (targetId: string, record: any, index: number) => <Input value={ targetId } onChange={ (e) => this.handleTargetIdChange(e.target.value, index) }/>,
    },
    {
      title: '增加数量',
      dataIndex: 'count',
      key: 'count',
      render: (count: number, record: any, index: number) => <InputNumber value={ count } onChange={ (val) => this.handleCountChange(val, index) }/>,
    },
    {
      key: 'action',
      render: (text: any, record: any, index: number) => (
        <Button disabled={ this.state.targets.length === 1} type="danger" size="small" onClick={ () => this.handleRemoveTarget(index) }>删除</Button>
      ),
    },
  ]

  async fetchHistory () {
    const op = this.props.pathname || ''

    const res = await axios.get(`${API_HOST}/interact/get-history?count=200&op=${op}`)

    if (res.data.code === 0) {
      this.setState({
        history: res.data.result
      })
    }
  }

  handleShowModal = () => {
    this.setState({
      visible: true
    })
  }

  handleHideModal = () => {
    this.setState({
      visible: false
    })
  }

  handleTargetIdChange (val: any, index: number) {
    const targets = this.state.targets

    targets[index].targetId = val

    this.setState({
      targets
    })
  }

  handleCountChange (val: any, index: number) {
    const targets = this.state.targets

    targets[index].count = val

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

    targets.push({
      id: this.state.targets.length,
      targetId: '',
      count: 0
    })

    this.setState({
      targets
    })
  }

  handleOK = () => {
    const { props, state } = this
    const currentUser = props.user.currentUser

    const targets = state.targets

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]

      if (target.targetId.trim().length === 0) {
        message.error('不能包含空目标Id')

        return
      }
    }

    targets.forEach(async target => {
      const res = await axios.get(`${API_HOST}/interact/fake-interact`, {
        params: {
          op: props.pathname || '',
          operator_id: currentUser && currentUser.userId || '',
          operator_name: currentUser && currentUser.name || '',
          target_id: target.targetId,
          count: target.count
        }
      })

      const data = res.data

      if (data.code === 0) {
        message.success(`目标${target.targetId}请求发送成功`)
      } else {
        message.error(`目标${target.targetId}请求发送失败：${data.reason}`)
      }
    })

    this.handleHideModal()

    setTimeout(() => this.fetchHistory(), 10)
  }

  async componentDidMount () {
    this.fetchHistory()
  }

  render () {
    const { state } = this;
    const op = this.props.pathname || ''

    return (
      <Content>
        <Card>
          <div style={{overflow: 'hidden' }}>
            <Button type="primary" icon="plus" onClick={ this.handleShowModal } style={{ float: 'right' }}>
              新增操作
            </Button>
            {
              op === 'follow_media' ?
              <p style={{lineHeight: '30px', color: 'red'}}>*操作后则增加粉丝数立即生效</p> :
              null
            }
          </div>
          <Table dataSource={state.history} columns={this.historyColumns} rowKey={ (record: any): string => record.id } pagination={{showTotal: (total, range) => `共${total}条`}} style={{ marginTop: '15px'}}/>
          <Modal
            title="新增操作"
            visible={this.state.visible}
            onOk={this.handleOK}
            onCancel={this.handleHideModal}
            okText="确认"
            cancelText="取消"
          >
            <Table columns={this.targetsColumns} dataSource={this.state.targets} pagination={ false } rowKey={ (record: any): string => record.id } />
            <Button disabled={ this.state.targets.length >= 20 } type="primary" icon="plus" size="small" onClick={ this.handleAddTarget } style={{ marginTop: '15px', marginLeft: '15px'}}>
              新增
            </Button>
          </Modal>
        </Card>
      </Content>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  user,
}))(MannualHistory);
