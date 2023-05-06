import React, { Component } from 'react';
import { Layout,Result } from 'antd';
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
    menus: [],
    hasLocation: [],
    location: '',
    flag : true
  };

  UNSAFE_componentWillUpdate() {
    // render之前更新路由
    defaultSelectedKeys = getCurrentRoute(appConfig.appId).splited;
  }

  componentDidMount() {
    axios.get('/api/proxy/http://pandora.yidian-inc.com/tools/auth/index?tool=3230116050').then(res => {
      this.setState({
        flag : res.data.status === 'success' ? true : false
      })
      console.log(res , 'res')
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
        <>
          <GlobalSider
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
          />
          <Layout>
            <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider}/>
            {this.props.children}
            <GlobalFooter/>
          </Layout>
        </>
      );
    } else {
      return  (
        <>
          <GlobalSider
            defaultSelectedKeys={defaultSelectedKeys}
            theme={this.props.theme}
            collapsed={this.state.collapsed}
          />
          <Layout>
            <GlobalHeader collapsed={this.state.collapsed} toggleSider={this.toggleSider} />
              <Result
                status="403"
                title="403"
                subTitle={
                  <div>
                    <p>Sorry, 您暂无此页面权限, 申请完权限后刷新页面;</p>
                    <p><span style={{color: 'red'}}>工具名称: </span>Metis-推荐debug平台</p>
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
        </>)
        }
  }
  render() {
    return <Layout className="sidebar-layout">{this._renderDom()}</Layout>;
  }
}
export default SidebarLayout;
