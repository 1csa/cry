import React, { Component, memo } from 'react';
import { Layout } from 'antd';
import { LayoutProps } from '@/config/app.d';
import appConfig from '@/config/app.config';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import getCurrentRoute from '@/utils/get_current_route';

const defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: true,
  };

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
          <div style={{ height: document.body.clientHeight-124, overflow: 'scroll' }} className="sidebar-layout-content">
            {this.props.children}
          </div>
          <GlobalFooter />
        </Layout>
      </Layout>
    );
  }
}

export default memo(SidebarLayout);
