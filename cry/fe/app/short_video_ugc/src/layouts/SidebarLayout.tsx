import React, { Component } from 'react';
import { Layout, Result, Button } from 'antd';
import axios from 'axios';
import { LayoutProps } from '@/config/app.d';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';

const defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './SidebarLayout.less';
import { TOOL_ID } from '@/services/common';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: false,
    permission: 0, // 0: 初始状态 1: 有权限 2: 无权限
  };
  async componentDidMount(){
    const { data} = await axios.get(`/api/proxy/http://pandora.yidian-inc.com/tools/auth/index`, {
      params: {
        tool: TOOL_ID
      }
    });
    const {status, result} = data;
    const permission = this.havePermission(status, result)? 1 : 2;
    this.setState({
      permission
    })
  }

  havePermission(status: string, result: any[] ): boolean{
    if(status !== 'success' || !result){
      return false;
    }
    return result.includes('write') && result.includes('access');
  }

  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  _renderChild(){
    const {permission} = this.state;
    if(permission === 1){
      return <>
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
      </>;
    }
    if(permission === 2){
      return <Result
        status="403"
        title="403"
        subTitle={<div>Sorry, 当前用户无相关权限, 申请完权限后刷新页面; <span style={{color:'red'}}>工具名称: </span>小视频话题管理</div>}
        extra={<a href="http://pandora.yidian-inc.com/tools/admin/manage" target="__blank">申请权限</a>}
      />
    }
    return '';
  }
  render() {

    return (
      <Layout className="sidebar-layout">
        {this._renderChild()}
      </Layout>
    );
  }
}

export default SidebarLayout;
