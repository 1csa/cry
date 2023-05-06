import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'access-content',
  appName: '内容获取平台',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    // {
    //   key: '/',
    //   icon: 'home',
    //   name: '首页',
    // },
    // {
    //   key: '/task',
    //   icon: 'file-text',
    //   name: '新建任务',
    // },
    // {
    //   key: '/filter',
    //   icon: 'file-text',
    //   name: '通用过滤条件',
    //   subMenu: [
    //     {
    //       name: '关键词',
    //       key: '/filter/keyword'
    //     },
    //     {
    //       name: '账号',
    //       key: '/filter/account'
    //     },
    //   ]
    // },
    // {
    //   key: '/taskManager',
    //   icon: 'heart',
    //   name: '任务管理',
    // },
    // {
    //   key: '/taskManager/detail',
    //   icon: 'heart',
    //   name: '任务详情',
    // },
    {
      key: '/pqconfig',
      icon: 'file-ppt',
      name: '内容获取配置'
    },
    {
      key: '/chain',
      icon: 'heart',
      name: '爬取链路维护'
    },
    {
      key: '/putConfig',
      icon: 'file-text',
      name: '内容投放配置'
    }
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=36083891',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
