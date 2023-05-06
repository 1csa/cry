import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import classnames from 'classnames';

import { Layout, Dropdown, Menu, Avatar, Tooltip } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';

import { LayoutProps, MainMenus, MainMenu } from '@/config/app.d';
import appConfig from '@/config/app.config';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

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

const GenerateMenuItems = (menus: MainMenus) =>
  menus.map((menu: MainMenu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      return (
        <SubMenu
          key={menu.key}
          icon={<Iconfont name={menu.icon!} />}
          title={<span>{menu.name}</span>}
        >
          {GenerateMenuItems(menu.subMenu)}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={menu.key} icon={<Iconfont name={menu.icon!} />}>
          <Link to={menu.key}>
            <span>{menu.name}</span>
          </Link>
        </MenuItem>
      );
    }
  });

class GlobalHeader extends React.Component<GlobalHeaderProps, {}> {
  render() {
    const { currentUser = {}, theme, defaultSelectedKeys } = this.props;
    const menu = (
      <Menu className="action-menu-dropdown">
        <MenuItem>
          <Iconfont name="iconcredentials_icon" className="mr20" />
          {currentUser.email}
        </MenuItem>
        <Menu.Divider />
        <MenuItem>
          <Iconfont name="iconfanhui" className="mr20" />
          <a href="//pandora.yidian-inc.com">返回 Pandora 工具平台</a>
        </MenuItem>
      </Menu>
    );

    const headerClassName = classnames({
      'global-header': true,
      'global-header-dark': theme === 'dark',
      'global-header-light': theme === 'light',
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
            defaultSelectedKeys={defaultSelectedKeys}
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
                  <Iconfont name="iconbangzhu" className="mr20" />
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
