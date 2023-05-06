import React, { Component } from 'react';
import { Layout, Result } from 'antd';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';
import axios from 'axios';

let defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: false,
    menus: [],
    hasLocation: [],
    location: '',
  };
  UNSAFE_componentWillUpdate() {
    // render之前更新路由
    defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;
  }

  componentDidMount() {
    axios
      .get(`/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=${appConfig.toolId}`)
      .then(res => {
        if (res.data.status === 'success') {
          let hasPermission = res.data.result;
          // hasPermission = [252, 253, 254];
          let hasLocation: string[] = [];
          appConfig.menus.map(item => {
            if (hasPermission.includes(item.permission) || item.permission === -1) {
              hasLocation.push(item.key.split('/')[1])
            }
            if ((item.permission && !hasPermission.includes(item.permission)) && item.permission !== -1) {
              item.disabled = true
            }
          })
          // console.log(hasLocation);
          this.setState({
            menus: appConfig.menus,
            hasLocation: hasLocation,
            location: defaultSelectedKeys[0].split('/')[1],
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
    const { hasLocation, location } = this.state;
    if (hasLocation.includes(location) || location === '') {
      return (
        <>
          <GlobalSider
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
            menus={this.state.menus}
          />
          <Layout>
            <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider} />
            {this.props.children}
            <GlobalFooter />
          </Layout>
        </>
      );
    } else {
      return (
        <>
          <GlobalSider
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
            menus={this.state.menus}
          />
          <Layout>
            <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider} />
            <Result
              status="403"
              title="403"
              subTitle={
                <div>
                  <p>Sorry, 您暂无此页面权限, 申请完权限后刷新页面;</p>
                  <p><span style={{ color: 'red' }}>工具名称: </span>过滤工具</p>
                </div>
              }
              extra={
                <a href="http://pandora.yidian-inc.com/tools/admin/manage" target="__blank">
                  申请权限
                </a>
              }
            />
            <GlobalFooter />
          </Layout>
        </>
      );
    }
  }
  render() {
    return <Layout className="sidebar-layout">{this._renderDom()}</Layout>;
  }
}

export default SidebarLayout;
