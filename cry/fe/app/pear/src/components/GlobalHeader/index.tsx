import React from 'react';
import { connect } from 'dva';

import { Layout, Icon, Dropdown, Menu, Avatar, Button, notification } from 'antd';
import { ConnectState, UserModelState } from '@/models/connect';

import './index.less';

const { Header } = Layout;
const MenuItem = Menu.Item;

interface GlobalHeaderProps {
  collapsed: boolean;
  toggleSider: () => void;
  user: UserModelState;
}
const openNotification = () => {
  notification.open({
    message: 'factor=model2news,性能状态警告',
    // description: '性能状态警告',
    onClick: () => {
      console.log('Notification Clicked!');
    },
    style: {
      // backgroundColor: 'red',
      marginTop: 60,
      // width: 250,
    },
  });
};
const GlobalHeader: React.FC<GlobalHeaderProps> = props => {
  const { currentUser = {} } = props.user;
  const menu = (
    <Menu className="action-menu-dropdown">
      <MenuItem>
        <Icon type="mail" />
        {currentUser.email}
      </MenuItem>
      <Menu.Divider />
      <MenuItem>
        <Icon type="rollback" />
        <a href="/">返回 Pandora 工具平台</a>
      </MenuItem>
    </Menu>
  );
  return (
    <Header className="global-header">
      <Icon className="sider-trigger" type={props.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={props.toggleSider} />

      <div className="action-menus">
        <Button shape="circle" icon="bell" style={{ fontSize: 20, marginRight: 15, border: 0 }} onClick={openNotification} />
        <Dropdown className="action-menu" overlay={menu}>
          <span>
            <Avatar size="small" src={currentUser.avatar || '//s.go2yd.com/a/thead_meiguoduizhang.png'} />
            <span>{currentUser.name}</span>
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(GlobalHeader);
