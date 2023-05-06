import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { LayoutProps } from '@/config/app.d';
import appConfig from '@/config/app.config';

import './index.less';

const { Sider } = Layout;
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

interface GlobalSiderProps extends LayoutProps {
  collapsed: boolean;
}
interface SIDE_MENU_CHILDREN{
  path: string;
  name: string;
  key: string;
}
interface SIDE_MENU_PROPS {
  key: string;
  icon: string;
  name: string;
  children: Array<SIDE_MENU_CHILDREN>
}

const SIDE_MENU: Array<SIDE_MENU_PROPS> = [{
    key: "sub1",
    name: "评论召回",
    icon: "edit",
    children: [
      {
        key: "home",
        name: "待审核文章",
        path: "/"
      },
      {
        key: "documents",
        name: "已审核文章",
        path: "/norec"
      },
    ]
},{
  key: "sub2",
  name: "主端内容召回",
  icon: "book",
  children: [
    {
      key: "toparticle",
      name: "待审核文章",
      path: "/toparticle"
    },
    {
      key: "finisharticle",
      name: "已审核文章",
      path: "/checked"
    },
  ]
},{
  key: "sub4",
  name: "全端内容召回",
  icon: "global",
  children: [{
    key: "alltoparticle",
    name: "待审核文章",
    path: "/alltoparticle"
  },{
    key: "allchecked",
    name: "已审核文章",
    path: "/allchecked"
  }]
},{
  key: "sub5",
  name: "高曝光内容召回",
  icon: "bulb",
  children: [
    {
      key: "highArticle",
      name: "待审核文章",
      path: "/highArticle"
    },
    {
      key: "highCheckedArticle",
      name: "已审核文章",
      path: "/highCheckedArticle"
    },
  ]
},{
  key: "sub3",
  name: "oppo文章召回",
  icon: "android",
  children: [
    {
      key: "oppoarticle",
      name: "待审核文章",
      path: "/oppoarticle"
    },
    {
      key: "oppochecked",
      name: "已审核文章",
      path: "/oppochecked"
    },
  ]
},{
  key: "sub6",
  name: "虚假新闻审核",
  icon: "frown",
  children: [
    {
      key: "fake_news",
      name: "待审核文章",
      path: "/fake_news"
    },
    {
      key: "fake_news_checked",
      name: "已审核文章",
      path: "/fake_news_checked"
    }, {
      key: "fake_news_statics",
      name: "数据统计",
      path: "/fake_news_statics"
    },
  ]
}];


export default class GlobalSider extends React.PureComponent<GlobalSiderProps> {
  constructor(props:any) {
    super(props);
    const {key, openKey} = this.computeCurrentKeys();
    this.state = {
      selectedKeys: [key],
      defaultOpenKeys: [openKey]
    }
  }
  componentWillMount() {
    const current = window.location.href.split('/');
    const {key, openKey} = this.computeCurrentKeys(current);
    this.setState({
      selectedKeys: [key],
      defaultOpenKeys: [openKey],
    });
  }
  // 获取当前的selectedKeys、defaultOpenKeys
  computeCurrentKeys(current?: any){
    if(!!current){
      for(var i = 0; i < SIDE_MENU.length; ++i){
        const {key, children} = SIDE_MENU[i];
        for(var j = 0; j < children.length; ++j){
          if(children[j].path.slice(1) && current.includes(children[j].path.slice(1))){
            return {openKey: key, key: children[j].key};
          }
        }
      }
    }
    return {openKey: "sub1", key: 'home'}
  }
  render() {
    return (
      <Sider
        theme={this.props.theme}
        width="260"
        trigger={null}
        collapsible={true}
        collapsed={this.props.collapsed}
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
        <Menu theme={this.props.theme} mode="inline" defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.defaultOpenKeys}>
          {SIDE_MENU.map((menu: SIDE_MENU_PROPS) => {
            return (
              <SubMenu
                key={menu.key}
                title={
                  <span>
                    <Icon type={menu.icon}/>
                    {menu.name}
                  </span>
                }
              >
                {menu.children.map((child: SIDE_MENU_CHILDREN) => {
                  return (
                    <MenuItem
                      key={child.key}
                    >
                      <Link to={child.path}>
                        <span>{child.name}</span>
                      </Link>
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </Sider>
    );
  }
};

// export default GlobalSider;
