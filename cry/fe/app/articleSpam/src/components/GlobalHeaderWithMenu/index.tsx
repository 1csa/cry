import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Icon, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';

import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import appConfig from '@/config/app.config';
import { LayoutProps } from '@/config/app.d';

import './index.less';

const { Header } = Layout;
const MenuItem = Menu.Item;

interface GlobalHeaderProps extends LayoutProps {
  collapsed: boolean;
  toggleSider: () => void;
  currentUser?: CurrentUser;
}

class GlobalHeader extends React.Component<GlobalHeaderProps, {}> {
  state = {
    activeMenu: 'home',
  };

  handleClickMenu = () => {};

  render() {
    const { currentUser = {} } = this.props;

    const menu = (
      <Menu className="action-menu-dropdown">
        <MenuItem>
          <Icon type="mail" />
          {currentUser.email}
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <Icon type="rollback" />
          <a href="//pandora.yidian-inc.com">返回 Pandora 工具平台</a>
        </MenuItem>
      </Menu>
    );

    const headerClassName = classnames({
      'global-header': true,
      'global-header-dark': this.props.theme === 'dark',
      'global-header-light': this.props.theme === 'light',
    });

    return (
      <Header className={headerClassName}>
        <div className="global-header-inner">
          <div className="logo">
            <Link to="/">
              {appConfig.logo ? <img src={appConfig.logo.toString()} alt="" /> : null}
              <h1>{appConfig.appName}</h1>
            </Link>
          </div>
          <Menu
            className="main-menu"
            theme={this.props.theme}
            mode="horizontal"
            defaultSelectedKeys={[this.state.activeMenu]}
            selectedKeys={[this.state.activeMenu]}
            onClick={this.handleClickMenu}
          >
            <MenuItem key="home">
              <Link to="/">
                <Icon type="home" />
                <span>首页</span>
              </Link>
            </MenuItem>
            <MenuItem key="documents">
              <Link to="/documents">
                <Icon type="file-text" />
                <span>使用文档</span>
              </Link>
            </MenuItem>
            <MenuItem key="about">
              <Link to="/about">
                <Icon type="profile" />
                <span>关于</span>
              </Link>
            </MenuItem>
          </Menu>
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
        </div>
      </Header>
    );
  }
}

export default connect((state: ConnectState) => ({
  currentUser: state.user.currentUser,
}))(GlobalHeader);
