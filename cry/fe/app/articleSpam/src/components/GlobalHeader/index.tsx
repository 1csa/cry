import React from 'react';
import { Layout, Icon, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';

import './index.less';

const { Header } = Layout;
const MenuItem = Menu.Item;

interface GlobalHeaderProps {
  collapsed: boolean;
  toggleSider: () => void;
  user: UserModelState;
}

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
      <Icon
        className="sider-trigger"
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={props.toggleSider}
      />
      <div className="action-menus">
        <Dropdown className="action-menu" overlay={menu}>
          <span>
            <Avatar
              size="small"
              src={currentUser.avatar || '//s.go2yd.com/a/thead_meiguoduizhang.png'}
            />
            <span>{currentUser.name}</span>
          </span>
        </Dropdown>
        <Tooltip placement="bottom" title="需求文档">
          <a
            className="action-menu"
            href="//ydwiki.yidian-inc.com/pages/viewpage.action?pageId=38461035"
            target="__blank"
          >
            <Icon type="question-circle" />
          </a>
        </Tooltip>
      </div>
    </Header>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(GlobalHeader);
