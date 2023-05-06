import React, { Component } from 'react';
import { Layout,Result } from 'antd';
import axios from 'axios';
import { LayoutProps } from '@/config/app/app';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSider from '@/components/GlobalSider';
import GlobalFooter from '@/components/GlobalFooter';
import appConfig from '@/config/app/app.config';
import getCurrentRoute from '@/utils/get_current_route';

const defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;

import './SidebarLayout.less';

interface SidebarLayoutProps extends LayoutProps {}

class SidebarLayout extends Component<SidebarLayoutProps> {
  state = {
    collapsed: false,
    permission: [],
    menus: [],
    location: ''
  };
  componentDidMount() {
    axios.get('/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=5cb18c5fa54d75553ac3268b')
    .then(res => {
      if (res.data.status === 'success') {
        let permission = res.data.result
        if (!permission.includes('portrait') && !permission.includes('blacklist')) { 
          appConfig.menus.splice(2,2)
        } else if (!permission.includes('portrait')) {
          appConfig.menus.splice(2,1)
        } else if (!permission.includes('blacklist')) {
          appConfig.menus.splice(3,1)
        }
        this.setState({
          permission: permission,
          menus: appConfig.menus,
          location: defaultSelectedKeys[0].split('/')[1]
        })
      }
    })
  }
  toggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  _renderDom(){
    const {permission, location} = this.state;
    if(permission.includes(location) || location === '' || location === 'info'){
      return <>
        <Layout className="sidebar-layout">
          <GlobalSider
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
            menus = {this.state.menus}
          />
          <Layout>
            <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider} />
            {this.props.children}
            <GlobalFooter />
          </Layout>
        </Layout>
      </>;
    } else {
      return <Result
        status="403"
        title="403"
        subTitle={<div>Sorry, 您暂时无相关权限, 申请完权限后刷新页面; <span style={{color:'red'}}>工具名称: </span>User Info - 用户信息</div>}
        extra={<a href="http://pandora.yidian-inc.com/tools/admin/manage" target="__blank">申请权限</a>}
      />
    }
  }
  render() {
    return (
      <Layout>
        {this._renderDom()}
      </Layout>
    );
  }
}

export default SidebarLayout;
