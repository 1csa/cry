import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'local-groundpush',
  appName: '身边.地推管理平台',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0bUUxwSrgMi',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'dashboard',
      name: '全局数据',
    },
    {
      key: '/statistic',
      icon: 'file-text',
      name: '详情数据',
      subMenu: [{
        key: '/statistic',
        name: '团队/区域统计',
      },{
        key: '/statistic/user',
        name: '用户统计',
      }]
    },
    {
      key: '/auth',
      icon: 'control',
      name: '权限管理',
      subMenu: [{
        key: '/auth',
        name: '团队管理',
      }, {
        key: '/auth/member',
        name: '地推员管理',
      }]
    },
    {
      key: '/sign',
      icon: 'compass',
      name: '签到统计',
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
