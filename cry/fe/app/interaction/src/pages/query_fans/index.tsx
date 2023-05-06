import React, { Component } from 'react';
import { Card, Breadcrumb, Form, Select, Button, Table, Modal, Input, message, Radio } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';
import axios from 'axios';

import './index.less';

const { Option } = Select

// const API_HOST = 'http://test.operationtoolservice.go2yd.int.yidian-inc.com'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  user: UserModelState;
  auth: AuthModelState;
}

interface State {
  account_id: string,
  type: string,
  fans_count: number,
  fetchingComplate: boolean,
}

class QueryFans extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      account_id: '',
      type: 'UGC',
      fans_count: 0,
      fetchingComplate: false
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
    }
  ]

  async fetchAccounts () {
    const {account_id, type} = this.state

    this.setState({
      fetchingComplate: false
    })

    if (account_id.trim().length === 0) {
      message.error('自媒体ID/UID不能为空')

      return;
    }

    const res = await axios.get(`${API_HOST}/interact/fans-count?account_id=${account_id.trim()}&type=${type}`)

    if (res.data.code === 0) {
      this.setState({
        fans_count: res.data.fans_count,
        fetchingComplate: true
      })
    } else {
      message.error(`获取失败：${res.data.reason}`)
    }
  }

  handleChangeAccountId = (val: string) => {
    this.setState({
      account_id: val
    })
  }

  handleChangeType = (val: string) => {
    this.setState({
      type: val
    })
  }

  render () {
    const { account_id, type, fans_count, fetchingComplate } = this.state

    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>账号粉丝数</Breadcrumb.Item>
            <Breadcrumb.Item>粉丝数查询</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <div style={{overflow: 'hidden' }}>

            <Form layout="inline">
              <Form.Item label="自媒体ID/UID" required>
                <Input value={account_id} onChange={ (e) => this.handleChangeAccountId(e.target.value) }/>
              </Form.Item>
              <Form.Item label="账号类型">
                <Select value={type} style={{ width: 90 }} onChange={this.handleChangeType}>
                  <Option value="UGC">UGC</Option>
                  <Option value="PGC">PGC</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={() => this.fetchAccounts()}>查询</Button>
              </Form.Item>
            </Form>
          </div>
          <Table dataSource={fetchingComplate ? [{account_id, type, fans_count}] : []} columns={this.accountsColumns} rowKey={ (record: any): string => `${record.account_id}${Math.random()}` } pagination={{showTotal: (total, range) => `共${total}条`}} style={{ marginTop: '15px'}}/>

        </Card>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(QueryFans);
