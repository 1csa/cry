import React, { useState, useCallback, memo, useEffect, ReactText } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';

import { appConfig } from '@/config/app.config';
import { MainMenu } from '@/types/app';
import { IconType } from '@/types/comp';
import { YIcon } from '@/components';

import './index.less';

interface SiderProps {
  authMenus?: string[];
}

interface MenuTitle {
  icon?: IconType;
  title?: string;
}

const MenuTitle: React.FC<MenuTitle> = ({ icon, title }) => (
  <span>
    {icon && <YIcon type={icon} />}
    <span>{title}</span>
  </span>
);

const HOME_KEY = '/home';

const Sider: React.FC<SiderProps> = ({ authMenus = [] }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>(HOME_KEY);
  const { pathname } = useLocation();
  const { menus } = appConfig;

  useEffect(() => {
    const match = pathname.match(/(\/\w+)(\/.*)?/);
    match && setSelectedMenu(match[1]);
  }, [pathname]);

  const genMenus = useCallback(
    (menus: MainMenu[]) => {
      const siderMenus = menus.filter(menu => menu.authed !== true || authMenus.includes(menu.key));

      return siderMenus.map(menu => {
        if (menu.subMenu && menu.subMenu.length > 0) {
          return (
            <Menu.SubMenu key={menu.key} title={<MenuTitle title={menu.name} icon={menu.icon} />}>
              {genMenus(menu.subMenu)}
            </Menu.SubMenu>
          );
        } else {
          return (
            <Menu.Item key={menu.key}>
              <Link to={menu.key}>
                <MenuTitle title={menu.name} icon={menu.icon} />
              </Link>
            </Menu.Item>
          );
        }
      });
    },
    [authMenus],
  );

  const handleMenuClick: Required<MenuProps>['onClick'] = useCallback(({ key }) => {
    setSelectedMenu(key + '');
  }, []);

  return (
    // 这里的SelectedKeys是为了在路由切换时能保证路由和菜单匹配
    <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]} onClick={handleMenuClick}>
      {genMenus(menus)}
    </Menu>
  );
};

export default memo(Sider);
