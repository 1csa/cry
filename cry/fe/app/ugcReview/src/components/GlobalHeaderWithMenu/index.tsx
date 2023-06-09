import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Icon, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import axios from 'axios';
import classnames from 'classnames';

import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import appConfig from '@/config/app.config';
import { LayoutProps, MainMenus, MainMenu } from '@/config/app.d';

import './index.less';

const { Header } = Layout;
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

interface GlobalHeaderProps extends LayoutProps {
  collapsed: boolean;
  toggleSider: () => void;
  currentUser?: CurrentUser;
  defaultSelectedKeys: string[];
  menus: Array<any>;
}
const GenerateMenuItems = (menus: MainMenus) =>
  menus.map((menu: MainMenu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      return (
        <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon} />
              <span>{menu.name}</span>
            </span>
          }
        >
          {GenerateMenuItems(menu.subMenu)}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={menu.key}>
          <Link to={menu.key}>
            <Icon type={menu.icon} />
            <span>{menu.name}</span>
          </Link>
        </MenuItem>
      );
    }
  });
class GlobalHeader extends React.Component<GlobalHeaderProps, {}> {
  state = {
    current: '',
  };
  handleClick = (e: any) => {
    this.setState({
      current: e.key,
    });
  };
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    // 将数组路径序列化为字符串
    let current = nextProps.defaultSelectedKeys.join('');
    if (nextProps.defaultSelectedKeys.join('') !== this.state.current) {
      this.setState({
        current,
      });
    }
  }
  render() {
    const props = this.props;
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
            onClick={this.handleClick}
            className="main-menu"
            theme={this.props.theme}
            mode="horizontal"
            selectedKeys={[this.state.current]}
          >
            {GenerateMenuItems(props.menus)}
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
            {appConfig.helpDoc ? (
              <Tooltip placement="bottom" title="使用文档">
                <a className="action-menu" href={appConfig.helpDoc} target="__blank">
                  <Icon type="question-circle" />
                </a>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </Header>
    );
  }
}

export default connect((state: ConnectState) => ({
  currentUser: state.user.currentUser,
}))(GlobalHeader);
