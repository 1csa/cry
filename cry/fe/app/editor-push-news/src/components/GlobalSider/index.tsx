import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { LayoutProps, MainMenus, MainMenu } from '@/config/app/app.d';
import appConfig from '@/config/app/app.config';
import { sendLog } from '@/services/sendLog';
import { connect } from 'dva'
import { AuthModelState, ConnectState } from '@/models/connect';

import './index.less';

const { Sider } = Layout;
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

interface GlobalSiderProps extends LayoutProps {
  collapsed: boolean;
  defaultOpenKeys: string[];
  defaultSelectedKeys: string[];
  auth: AuthModelState;
}

const GenerateMenuItems = (menus: MainMenus, toolsAuth: (string | number | undefined)[]) =>
  menus.map((menu: MainMenu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      const subMenuComponent = (
        <SubMenu
          key={menu.key}
          title={
            <span>
              {menu.icon ? <Icon type={menu.icon} /> : null}
              <span>{menu.name}</span>
            </span>
          }
        >
          {GenerateMenuItems(menu.subMenu, toolsAuth)}
        </SubMenu>
      )

      if (!menu.authKey) {
        return subMenuComponent
      } else if (toolsAuth.includes(menu.authKey)) {
        return subMenuComponent
      }
    } else {
      const menuItemComponent = (
        <MenuItem key={menu.key}>
          <Link to={menu.key}>
            {menu.icon ? <Icon type={menu.icon} /> : null}
            <span>{menu.name}</span>
          </Link>
        </MenuItem>
      )

      if (!menu.authKey) {
        return menuItemComponent
      } else if (toolsAuth.includes(menu.authKey)) {
        return menuItemComponent
      }
    }
  });

const GlobalSider: React.FC<GlobalSiderProps> = props => {
  const toolsAuth = props?.auth?.currentAuth?.childAuths || []

  return (
    <Sider theme={props.theme} width="200" trigger={null} collapsible={true} collapsed={props.collapsed}>
      <div className="logo">
        {/* <a href="/">
          <img src="http://si1.go2yd.com/get-image/0Z8vMt5u4kS" alt="" />
          <h1>Eris Simple App</h1>
        </a> */}
        <Link to="/">
          {appConfig.logo ? <img src={appConfig.logo.toString()} alt="" /> : null}
          <h1>{appConfig.appName}</h1>
        </Link>
      </div>
      <Menu
        theme={props.theme}
        mode="inline"
        defaultOpenKeys={props.defaultOpenKeys}
        defaultSelectedKeys={props.defaultSelectedKeys}
        onClick={() => {
          sendLog({
            page: 'editor_push_news',
            action_id: 'competitor',
          });
        }}
      >
        {GenerateMenuItems(appConfig.menus, toolsAuth)}
      </Menu>
    </Sider>
  );
};

export default connect(({ auth }: ConnectState) => ({
  auth
}))(GlobalSider);