import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'filtertools',
  appName: '过滤工具',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'home',
      name: '首页',
      permission: -1, //-1代表不要权限
    },
    {
      key: '/threshold',
      icon: 'dashboard',
      name: '过滤阈值设置',
      permission: 254,
      subMenu: [{
        key: '/threshold/news',
        name: '图文过滤阈值设置',
      },{
        key: '/threshold/video',
        name: '视频过滤阈值设置',
      }]
    },
    {
      key: '/rule',
      icon: 'filter',
      name: '过滤规则设置',
      permission: 253,
      subMenu: [{
        key: '/rule/news',
        name: '图文过滤规则设置',
      },{
        key: '/rule/video',
        name: '视频过滤规则设置',
      }]
    },
    {
      key: '/usercover',
      icon: 'team',
      name: '过滤策略覆盖用户设置',
      permission: 252,
    },
    {
      key: '/oplog',
      icon: 'area-chart',
      name: '操作日志',
      permission: -1,
    },{
      key: '/check',
      icon: 'fund',
      name: '过滤规则校验工具',
      permission: -1,
    },{
      key: '/Generation',
      icon: 'credit-card',
      name: 'SQL生成工具',
      permission: -1,
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=51398723',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
  toolId: 1023069301,
  isDev: process.env.NODE_ENV === 'development',
};

export default appConfig;
