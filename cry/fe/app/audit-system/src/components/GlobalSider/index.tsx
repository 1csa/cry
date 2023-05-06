import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'dva';

import { Layout, Menu, notification } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';
import { LayoutProps, MainMenus, MainMenu } from '@/config/app.d';
import appConfig from '@/config/app.config';
import getCurrentRoute from '@/utils/get_current_route';
import { getCookie } from '@/utils/dev_helper';

import { getApolloSetting } from '@/services/apolloSetting';

import './index.less';

const { Sider } = Layout;
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

const PREHOST = `venus.int.yidian-inc.com:5000`;

type TypeMenus = {
  [K: string]: string;
};

interface menuPermissionProps {
  code: string;
  description: string;
}

// 菜单组件
const GenerateMenuItems = (menus: MainMenus, collapsed: boolean, menuPermissionList?: menuPermissionProps[]) =>
  menus.map((menu: MainMenu) => {
    // 需要兼容不存在人很权限的情况
    const menuItem = menuPermissionList?.find((menuPermissionItem: menuPermissionProps) => {
      const menuKey = menu.key.split('/')[1];
      // TODO: 首页
      if (menuKey === '') return menu;
      return menuPermissionItem?.code === menuKey;
    });
    if (menuItem) {
      // if (menuItem || menuPermissionList?.length === 0) {
      if (menu.subMenu && menu.subMenu.length > 0) {
        const { code, description } = menuItem;
        const path = code ? `/${code}` : menu.key;
        return (
          <SubMenu key={path} title={description} icon={<Iconfont name={menu.icon!} className={collapsed ? 'mr40' : 'mr20'} />}>
            {/* <SubMenu key={menu.key} title={menu.name} icon={<Iconfont name={menu.icon!} className={collapsed ? 'mr40' : 'mr20'} />}> */}
            {GenerateMenuItems(menu.subMenu, collapsed, menuPermissionList)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={menu.key} icon={<Iconfont name={menu.icon!} className={collapsed ? 'mr40' : 'mr20'} />}>
            <Link to={menu.key}>{menu.name}</Link>
          </MenuItem>
        );
      }
    }
  });

interface GlobalSiderProps extends LayoutProps {
  collapsed: boolean;
  globalAdminMenu: menuPermissionProps[];
}

const GlobalSider: React.FC<GlobalSiderProps> = ({ theme, collapsed, globalAdminMenu }) => {
  const dispatch = useDispatch();
  const [menuList, setMenuList] = useState<Array<any>>(appConfig.menus);

  const path = getCurrentRoute(appConfig.appId).original;

  const defaultSelectedKeys = [path || '/'];
  const defaultOpenKeys = [`/${path.split('/')[1] || ''}`];

  /**
   * 设置预发白名单
   */
  const setMenus = () => {
    getApolloSetting().then(res => {
      const data = res['pre-whitelist'];
      if (data && typeof data === 'string') {
        const whiteList = JSON.parse(data);
        if (!whiteList.includes(+getCookie('userid'))) {
          setMenuList(menuList.slice(0, 1));
        }
      }
    });
  };

  /**
   *
   * @param value 点击菜单获取的对象key
   */
  const handleMenuItem = (value: any) => {
    const currentBreadcrumbName: string = menuList
      .map(item => {
        if (item.subMenu && Array.isArray(item.subMenu)) {
          return item.subMenu.map((ele: TypeMenus) => {
            return {
              key: ele.key,
              name: `${item.name},${ele.name}`,
            };
          });
        } else {
          return [
            {
              key: item.key,
              name: item.name,
            },
          ];
        }
      })
      ?.flat(5)
      ?.find((ele: TypeMenus) => ele.key === value.key).name;

    // 发送数据到dva 在header中使用
    dispatch({
      type: 'synchronizeState/currentBreadcrumbName',
      payload: {
        currentBreadcrumb: currentBreadcrumbName,
      },
    });
  };

  useEffect(() => {
    if (location.host === PREHOST) {
      setMenus();
    }
  }, []);

  const { pathname } = useLocation();
  const history = useHistory();

  //  菜单权限列表数据
  const [menuPermissionList, setMenuPermissionList] = useState<menuPermissionProps[]>([]);

  useEffect(() => {
    if (globalAdminMenu.length > 0) {
      // TODO: menu 新增
      // const newMenu: any = [
      //   {
      //     description: '新menu...',
      //     code: 'inspection',
      //   },
      // ];
      // const _globalAdminMenu = [...globalAdminMenu, ...newMenu];
      const key = pathname.split('/')[1] ?? '';
      setMenuPermissionList(globalAdminMenu);

      // 路由权限控制
      const permissionObject = globalAdminMenu.find((item: any) => item?.code === key);
      if (key && permissionObject === undefined) {
        notification.error({
          message: '暂无权限',
          description: '暂无此页面权限，即将跳转首页！',
          onClose: () => history.replace('/'),
        });
      }
    }
  }, [JSON.stringify(globalAdminMenu)]);

  return (
    <Sider theme={theme} width="260" trigger={null} collapsible={true} collapsed={collapsed}>
      <div className="logo">
        <Link to="/">
          {appConfig.logo ? <img src={appConfig.logo.toString()} alt="" /> : null}
          <h1>{appConfig.appName}</h1>
        </Link>
      </div>
      <Menu theme={theme} mode="inline" defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} onClick={handleMenuItem}>
        {GenerateMenuItems(menuList, collapsed, menuPermissionList)}
      </Menu>
    </Sider>
  );
};

export default connect((store: any) => ({
  globalAdminMenu: store.commonLogic.globalAdminMenu,
}))(GlobalSider);
