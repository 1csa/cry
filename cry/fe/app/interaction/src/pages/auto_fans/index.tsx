import React, { Component } from 'react';
import { Card, Breadcrumb, Form, Switch, message } from 'antd';
import axios from 'axios';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';

// const API_HOST = 'http://test.operationtoolservice.go2yd.int.yidian-inc.com'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  user: UserModelState;
  auth: AuthModelState;
}

interface State {
  enable: Boolean,
  loading: Boolean
}

class AutoFans extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      enable: true,
      loading: true
    }
  }

  async fetchFakeGlobalEnableConfig () {
    const res = await axios.get(`${API_HOST}/interact/fake-global-enable`)

    if (res.data.code === 0) {
      this.setState({
        enable: res.data.enable,
        loading: false
      })
    }
  }

  handleChangeFakeGlobalEnableConfig = async (enable: Boolean) => {
    this.setState({
      enable
    })

    const res = await axios.get(`${API_HOST}/interact/fake-global-enable?enable=${enable}`)

    if (res.data.code === 0) {
      this.setState({
        enable
      })

      message.success('切换成功')
    } else {
      message.error('切换失败')
    }
  }

  async componentDidMount () {
    const currentAuth = this.props.auth.currentAuth

    if (!currentAuth?.childAuths.includes('auto_fans')) {
      this.props.history.push('/no_auth')
    }

    this.fetchFakeGlobalEnableConfig()
  }

  render() {
    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>账号粉丝数</Breadcrumb.Item>
            <Breadcrumb.Item>自动涨粉</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <Form layout="inline">
            <Form.Item label="全量自动涨粉开关">
              <Switch disabled={this.state.loading} defaultChecked checked={this.state.enable} onChange={this.handleChangeFakeGlobalEnableConfig} checkedChildren="开" unCheckedChildren="关"></Switch>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(AutoFans)
