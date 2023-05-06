import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import { HomeOutlined, BarChartOutlined, AppstoreOutlined, MailOutlined, RollbackOutlined, QuestionCircleOutlined } from '@ant-design/icons'
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
}

const renderIcon = (name: string): ReactNode => {
  let tempNode = null
  switch (name) {
    case 'HomeOutlined':
      tempNode = <HomeOutlined />
      break
    case 'BarChartOutlined':
      tempNode = <BarChartOutlined />
      break
    default: 
      tempNode = <AppstoreOutlined />
      break
  }
  return tempNode
}

const GenerateMenuItems = (menus: MainMenus) =>
  menus.map((menu: MainMenu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      return (
        <SubMenu
          key={menu.key}
          title={
            <span>
              { renderIcon(menu.icon!) }
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
            { renderIcon(menu.icon!) }
            <span>{menu.name}</span>
          </Link>
        </MenuItem>
      );
    }
  });

class GlobalHeader extends Component<GlobalHeaderProps, {}> {
  render() {
    const props = this.props;
    const { currentUser = {} } = this.props;

    const menu = (
      <Menu className="action-menu-dropdown">
        <MenuItem>
          <MailOutlined />
          {currentUser.email}
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <RollbackOutlined />
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
            defaultSelectedKeys={props.defaultSelectedKeys}
          >
            {GenerateMenuItems(appConfig.menus)}
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
                  <QuestionCircleOutlined />
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
