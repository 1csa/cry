import React, { Component } from 'react';
import { Layout } from 'antd';
import axios from 'axios';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';

let defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: false,
  };

  UNSAFE_componentWillUpdate() {
    // render之前更新路由
    defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;
  }
  componentDidMount() {
    axios
      .get('/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=3253174172')
      .then(res => {
        if (res.data.status === 'success') {
          // let permission = res.data.result;
          // console.log('permission', permission);
        }
      });
  }

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout className="sidebar-layout">
        <GlobalSider
          defaultSelectedKeys={defaultSelectedKeys}
          theme={this.props.theme}
          collapsed={this.state.collapsed}
        />
        <Layout>
          <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider} />
          {this.props.children}
          <GlobalFooter />
        </Layout>
      </Layout>
    );
  }
}

export default SidebarLayout;
