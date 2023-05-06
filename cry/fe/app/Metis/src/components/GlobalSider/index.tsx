import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu,  } from 'antd';
import { useHistory } from "react-router-dom";
import { LayoutProps, MainMenus, MainMenu } from '@/config/app.d';
import appConfig from '@/config/app.config';
import './index.less';
import * as Icon from '@ant-design/icons'
const { Sider } = Layout;
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

interface GlobalSiderProps extends LayoutProps {
  collapsed: boolean;
  defaultSelectedKeys: string[];
}


const GenerateMenuItems = (menus: MainMenus) =>

  menus.map((menu: MainMenu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      return (
        <SubMenu
          key={menu.key}
          icon={iconBC(menu.icon)}
          title={
            <span >
              <span>{menu.name}</span>
            </span>
          }
        >
          {GenerateMenuItems(menu.subMenu)}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={menu.key} icon={iconBC(menu.icon)}>
          <Link to={menu.key}>
            <span>{menu.name}</span>
          </Link>
        </MenuItem>
      );
    }
  });
  function iconBC(name:any){
    return React.createElement(Icon[name]);
  }
const GlobalSider: React.FC<GlobalSiderProps> = props => {
  const history = useHistory();
  const [selectKey, setSelectKey] = useState('');
  useEffect(() => {
      history.listen((routeInfo) => {
        const pathname = routeInfo.pathname.split('/');
        const paths =  '/' + pathname[pathname.length - 1];
        const path = '/' + pathname[pathname.length -2] + '/' + pathname[pathname.length - 1];
        setSelectKey(path == "//" ? paths : path);
      });
    },[])
  const handleClick = (e) => {
    setSelectKey(e.key);
    history.push(e.key);
  };
  return (
    <Sider
      theme={props.theme}
      width="260"
      trigger={null}
      collapsible={true}
      collapsed={props.collapsed}
    >
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
      <Menu  theme={props.theme} onClick={handleClick} mode="inline" selectedKeys={[selectKey]} defaultSelectedKeys={props.defaultSelectedKeys}>
        {GenerateMenuItems(appConfig.menus)}
      </Menu>
    </Sider>
  );
};

export default GlobalSider;
