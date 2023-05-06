import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'risk-management',
  appName: '风控中心',
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
    {
      key: '/data',
      icon: 'area-chart',
      name: '数据中心',
      subMenu: [
        {
          key: '/data/today',
          name: '今日概览',
        },
        {
          key: '/data/activityData',
          name: '资产监控',
        },
        {
          key: '/data/overview',
          name: '数据概览',
        },
      // {
      //   key: '/dispose/feature',
      //   name: '风险事件',
      // }
      ]
    },
    {
      key: '/dispose',
      icon: 'sliders',
      name: '配置中心',
      subMenu: [
        {
          key: '/dispose/feature',
          name: '特征管理',
        },
        {
          key: '/dispose/configure',
          name: '配置管理',
        },
        // {
        //   key: '/dispose/configureDetail',
        //   name: '新建策略',
        // },
    ]
    },
    {
      key: '/policy',
      icon: 'api',
      name: '决策中心',
      subMenu: [{
        key: '/policy/search',
        name: '风险查询',
      }]
    },
    {
      key: '/userlist',
      icon: 'team',
      name: '黑白名单',
      subMenu: [{
        key: '/userlist/blacklist',
        name: '黑名单管理',
      },{
        key: '/userlist/whitelist',
        name: '白名单管理',
      }]
    },
    {
      key: '/log',
      icon: 'history',
      name: '日志管理',
      subMenu: [{
        key: '/log/blacklog',
        name: '拉黑日志',
      }]
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
  API_HOST: 'http://antispamx.int.yidian-inc.com',
};
// 测试环境API
const env = process.env
if(env && env.NODE_ENV !== "production" || window.location.hostname === 'venus.int.yidian-inc.com'){
  appConfig.API_HOST = "http://10.126.37.20:8081";
}
// appConfig.API_HOST = "http://10.126.37.20:8081";
export default appConfig;
