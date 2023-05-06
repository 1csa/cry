import React, { Component } from 'react';
import { Layout, Result } from 'antd';
import axios from 'axios';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeaderWithMenu';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';

let defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './BasicLayout.less';

const { Content } = Layout;

interface BasicLayoutProps extends LayoutProps {}

class BasicLayout extends Component<BasicLayoutProps> {
  state = {
    collapsed: false,
    permission: [],
    menus: [],
    location: '',
  };
  UNSAFE_componentWillUpdate() {
    // render之前更新路由
    defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;
  }
  componentDidMount() {
    axios
      .get('/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=2568660512')
      .then(res => {
        if (res.data.status === 'success') {
          let permission = res.data.result;
          // let permission = ['access','userlist']
          if (!permission.includes('userlist') && !permission.includes('namelist')) {
            appConfig.menus.splice(1, 2);
          } else if (!permission.includes('userlist')) {
            appConfig.menus.splice(1, 1);
          } else if (!permission.includes('namelist')) {
            appConfig.menus.splice(2, 1);
          } else if (!permission.includes('userCertification')) {
            appConfig.menus.splice(3, 1);
          }
          this.setState({
            permission: permission,
            menus: appConfig.menus,
            location: defaultSelectedKeys[0].split('/')[1],
          });
        }
      });
  }
  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  _renderDom() {
    const { permission, location } = this.state;
    if (permission.includes(location) || location === '') {
      return (
        <>
          <GlobalHeader
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
            toggleSider={this.toggleSider}
            menus={this.state.menus}
          />
          <Content className="basic-layout-content">{this.props.children}</Content>
          <GlobalFooter />
        </>
      );
    } else {
      return (
        <Result
          status="403"
          title="403"
          subTitle={
            <div>
              Sorry, 您暂时无相关权限, 申请完权限后刷新页面;{' '}
              <span style={{ color: 'red' }}>工具名称: </span>UGC内容管理平台
            </div>
          }
          extra={
            <a href="http://pandora.yidian-inc.com/tools/admin/manage" target="__blank">
              申请权限
            </a>
          }
        />
      );
    }
  }
  render() {
    return <Layout className="basic-layout">{this._renderDom()}</Layout>;
  }
}

export default BasicLayout;
