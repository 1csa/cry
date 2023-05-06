import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';

import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';

import { LayoutProps } from '@/config/app.d';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {
  user: UserModelState;
  dispatch: Dispatch;
  children: React.ReactNode;
}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: this?.props.user.collapsed,
  };

  toggleSider = () => {
    this.setState(
      {
        collapsed: !this.state.collapsed,
      },
      () => {
        this.props.dispatch({
          type: 'user/toggleCollapsed',
          payload: {
            collapsed: this.state.collapsed,
          },
        });
      },
    );
  };

  render() {
    return (
      <Layout className="sidebar-layout">
        <GlobalSider theme={this.props.theme} collapsed={this.state.collapsed!} />
        <Layout className="yd-layout">
          <GlobalHeader collapsed={this.state.collapsed!} toggleSider={this.toggleSider} />
          {this.props.children}
          <GlobalFooter />
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  user,
}))(SidebarLayout);
