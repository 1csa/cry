import React, { Component } from 'react';
import { Card, Breadcrumb, Tabs, Row, Col, Select, Button, Table, Modal, InputNumber, message, Radio } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';
import axios from 'axios';
import { saveLog } from '../../../../common/Logger.js';

import './index.less';

const { TabPane } = Tabs;

// const API_HOST = 'http://test.operationtoolservice.go2yd.int.yidian-inc.com'
const API_HOST = 'http://operationtoolservice.go2yd.int.yidian-inc.com'

interface Props {
  user: UserModelState;
  auth: AuthModelState;
}

interface State {
  ugc_config: any[],
  pgc_config: any[],
}

class TuiConfig extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      ugc_config: [],
      pgc_config: [],
    }
  }

  async fetchTuiConfig () {
    const res = await axios.post(`${API_HOST}/interact/tui-config?op=get`, {})

    if (res.data.code === 0) {
      const result = res.data.result

      const ugc_config = result.ugc_config.map(item => {
        item.key = Math.random()

        return item
      })

      const pgc_config = result.pgc_config.map(item => {
        item.key = Math.random()

        return item
      })

      this.setState({
        ugc_config,
        pgc_config,
      })
    } else {
      message.error(`获取失败：${res.data.reason}`)
    }
  }

  handleUpdateTuiConfig = async () => {
    const { ugc_config, pgc_config } = this.state

    const res = await axios.post(`${API_HOST}/interact/tui-config?op=update`, {
      ugc_config,
      pgc_config
    })

    if (res.data.code === 0) {
      this.fetchTuiConfig()

      message.success(`保存成功`)
    } else {
      message.error(`保存失败：${res.data.reason}`)
    }

    saveLog({
      log_source: { tag: 'interaction' },
      action_method: 'tui-config',
      target_data: {
        ugc_config,
        pgc_config,
        res: res.data
      }
    })
  }

  handleChangeTab = (val: string) => {
    this.fetchTuiConfig()
  }

  handleChangeFansRange = (type: string, index: number, rangeIndex: number, val?: number) => {
    const config = this.state[`${type}_config`]

    config[index].fans_count[rangeIndex] = val

    if (type === 'ugc') {
      this.setState({
        ugc_config: config
      })
    } else {
      this.setState({
        pgc_config: config
      })
    }
  }

  handleChangeTuiRange = (type: string, index: number, rangeIndex: number, val?: number) => {
    const config = this.state[`${type}_config`]

    config[index].tui_count[rangeIndex] = val

    if (type === 'ugc') {
      this.setState({
        ugc_config: config
      })
    } else {
      this.setState({
        pgc_config: config
      })
    }
  }

  handleAddLevel = (type: string) => {
    const config = this.state[`${type}_config`]

    config.push({
      fans_count: [0, 0],
      tui_count: [0, 0],
      key: Math.random()
    })

    if (type === 'ugc') {
      this.setState({
        ugc_config: config
      })
    } else {
      this.setState({
        pgc_config: config
      })
    }
  }

  handleRemoveLevel = (type: string, index: number) => {
    const config = this.state[`${type}_config`]

    config.splice(index, 1)

    if (type === 'ugc') {
      this.setState({
        ugc_config: config
      })
    } else {
      this.setState({
        pgc_config: config
      })
    }
  }

  handleBack = () => {
    this.props.history.push('/tui_switch')
  }

  async componentDidMount () {
    const currentAuth = this.props.auth.currentAuth

    console.log(currentAuth)

    if (!currentAuth?.childAuths.includes('tui')) {
      this.props.history.push('/no_auth')
    }

    this.fetchTuiConfig()
  }

  render () {
    const { ugc_config, pgc_config } = this.state

    const operations = <Button icon="left" onClick={this.handleBack} style={{marginLeft: 10}}>返回</Button>

    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>推一推配置</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
        <Tabs defaultActiveKey="ugc_config" onChange={this.handleChangeTab} tabBarExtraContent={operations}>

          <TabPane tab="UGC" key="ugc_config">
            {
              ugc_config.length > 0 ? ugc_config.map((config, index) => {
                return <Row gutter={16} key={config.key} style={{marginTop: '15px', lineHeight: '32px'}}>
                  <Col span={2}>
                    档位{index + 1}:
                  </Col>
                  <Col span={8}>
                    <span style={{marginRight: 10}}>粉丝数:</span>
                    <InputNumber defaultValue={config.fans_count[0]} onChange={(val) => this.handleChangeFansRange('ugc', index, 0, val)}></InputNumber>
                    <span style={{margin: '2px'}}>-</span>
                    <InputNumber defaultValue={config.fans_count[1]} onChange={(val) => this.handleChangeFansRange('ugc', index, 1, val)}></InputNumber>
                    <span style={{marginLeft: '2px'}}>个</span>
                  </Col>
                  <Col span={8}>
                    <span style={{marginRight: 10}}>单篇推数:</span>
                    <InputNumber defaultValue={config.tui_count[0]} onChange={(val) => this.handleChangeTuiRange('ugc', index, 0, val)}></InputNumber>
                    <span style={{margin: '2px'}}>-</span>
                    <InputNumber defaultValue={config.tui_count[1]} onChange={(val) => this.handleChangeTuiRange('ugc', index, 1, val)}></InputNumber>
                    <span style={{marginLeft: '2px'}}>推</span>
                  </Col>
                  <Col span={2}>
                    <Button type="danger" onClick={() => this.handleRemoveLevel('ugc', index)}>删除</Button>
                  </Col>
                </Row>
              }) : null
            }

            <Row style={{marginTop: 20}}>
              <Button type="primary" onClick={() => this.handleAddLevel('ugc')}>新增</Button>
            </Row>

            <Row style={{marginTop: 40}}>
              <Button type="primary" onClick={this.handleUpdateTuiConfig}>保存</Button>
            </Row>
          </TabPane>
          <TabPane tab="一点号" key="pgc_config">
            {
              pgc_config.length > 0 ? pgc_config.map((config, index) => {
                return <Row gutter={16} key={config.key} style={{marginTop: '15px', lineHeight: '32px'}}>
                  <Col span={2}>
                    档位{index + 1}:
                  </Col>
                  <Col span={8}>
                    <span style={{marginRight: 10}}>粉丝数:</span>
                    <InputNumber defaultValue={config.fans_count[0]} onChange={(val) => this.handleChangeFansRange('pgc', index, 0, val)}></InputNumber>
                    <span style={{margin: '2px'}}>-</span>
                    <InputNumber defaultValue={config.fans_count[1]} onChange={(val) => this.handleChangeFansRange('pgc', index, 1, val)}></InputNumber>
                    <span style={{marginLeft: '2px'}}>个</span>
                  </Col>
                  <Col span={8}>
                    <span style={{marginRight: 10}}>单篇推数:</span>
                    <InputNumber defaultValue={config.tui_count[0]} onChange={(val) => this.handleChangeTuiRange('pgc', index, 0, val)}></InputNumber>
                    <span style={{margin: '2px'}}>-</span>
                    <InputNumber defaultValue={config.tui_count[1]} onChange={(val) => this.handleChangeTuiRange('pgc', index, 1, val)}></InputNumber>
                  </Col>
                  <Col span={2}>
                    <Button type="danger" onClick={() => this.handleRemoveLevel('pgc', index)}>删除</Button>
                  </Col>
                </Row>
              }) : null
            }

            <Row style={{marginTop: 20}}>
              <Button type="primary" onClick={() => this.handleAddLevel('pgc')}>新增</Button>
            </Row>

            <Row style={{marginTop: 40}}>
              <Button type="primary" onClick={this.handleUpdateTuiConfig}>保存</Button>
            </Row>
          </TabPane>
        </Tabs>,
        </Card>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(TuiConfig);
