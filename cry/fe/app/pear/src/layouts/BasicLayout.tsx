import React, { Component } from 'react';
import { Layout,Result } from 'antd';
import axios from 'axios';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeaderWithMenu';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';

const defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './BasicLayout.less';
import GlobalSider from "@/components/GlobalSider";

const { Content } = Layout;

interface BasicLayoutProps extends LayoutProps {}

class BasicLayout extends Component<BasicLayoutProps> {
  state = {
    collapsed: false,
    flag : true
  };
  componentDidMount() {
    axios.get('/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=2803730886').then(res => {
      if (res.data.status === 'success') {
        this.setState({
          flag : res.data.status == "success" ? true :false
        })
      }
    });
  }
  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  _renderDom() {
    const {flag} = this.state;
    if (flag) {
      return (
        <Layout className="basic-layout">
          <GlobalHeader
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
            toggleSider={this.toggleSider}
          />
          <Content className="basic-layout-content">{this.props.children}</Content>
          <GlobalFooter/>
        </Layout>
      );
    }else {
      return <Result
              status="403"
              title="403"
              subTitle={
                <div>
                  <p>Sorry, 您暂无此页面权限, 申请完权限后刷新页面;</p>
                  <p><span style={{color: 'red'}}>工具名称: </span>Pear-索引平台</p>
                </div>
              }
              extra={
                <a href="http://pandora.yidian-inc.com/tools/admin/manage" target="__blank">
                  申请权限
                </a>
              }
            />
      }
  }

  render() {
    return (
      <Layout className="basic-layout">
        {this._renderDom()}
      </Layout>
    );
  }
}

export default BasicLayout;
