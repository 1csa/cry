import React, { Component } from 'react';
import { Layout } from 'antd';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: false,
  };

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout className="sidebar-layout">
        <GlobalSider theme={this.props.theme} collapsed={this.state.collapsed} />
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
