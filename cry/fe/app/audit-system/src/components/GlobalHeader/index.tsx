import React from 'react';
import { connect } from 'dva';
import { Layout, Dropdown, Menu, Avatar, Tooltip, Breadcrumb } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';
import appConfig from '@/config/app.config';
import { ConnectState, UserModelState } from '@/models/connect';
import { SynchronizeState } from '@/models/synchronizeState';

import './index.less';

const { Header } = Layout;

interface GlobalHeaderProps {
  collapsed: boolean;
  toggleSider: () => void;
  user: UserModelState;
  synchronizeState: SynchronizeState;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = props => {
  const { currentUser = {} } = props.user;
  const { currentBreadcrumb } = props.synchronizeState;

  const menu = (
    <Menu className="action-menu-dropdown">
      <Menu.Item>
        <Iconfont name="iconcredentials_icon" className="mr20" />
        {currentUser.email}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Iconfont name="iconfanhui" className="mr20" />
        <a href="//pandora.yidian-inc.com">返回 Pandora 工具平台</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="global-header">
      <div className="toggle-icon" onClick={props.toggleSider}>
        {props.collapsed ? <Iconfont name="iconzhedie2" /> : <Iconfont name="iconzhedie1" />}
      </div>
      <Breadcrumb style={{ flex: 1 }}>
        {currentBreadcrumb.includes(',') ? (
          currentBreadcrumb.split(',').map((item, index) => {
            return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
          })
        ) : (
          <Breadcrumb.Item>{currentBreadcrumb}</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <div style={{ display: 'flex' }}>
        <div className="action-menus">
          <Dropdown className="action-menu" overlay={menu}>
            <span>
              <Avatar size="small" src={currentUser.avatar || '//s.go2yd.com/a/thead_meiguoduizhang.png'} />
              <span>{currentUser.name}</span>
            </span>
          </Dropdown>
          {appConfig.helpDoc ? (
            <Tooltip placement="bottom" title="使用文档">
              <a className="action-menu" href={appConfig.helpDoc} target="__blank">
                <Iconfont name="iconbangzhu" className="mr20" />
              </a>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Header>
  );
};

export default connect(({ user, synchronizeState }: ConnectState) => ({
  user,
  synchronizeState,
}))(GlobalHeader);
