import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'userinfo',
  appName: 'userInfo用户查询工具',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'home',
      name: '用户基础信息',
    }, {
      key: '/info',
      icon: 'user',
      name: '用户详细信息'
    }, {
      key: '/portrait',
      icon: 'meh',
      name: '用户画像'
    }, {
      key: '/blacklist',
      icon: 'lock',
      name: '黑名单设置',
    },
  ],
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
  API_HOST: 'http://a4.go2yd.com',
  API_OPPO_HOST: 'http://api-oppobrowser-o4.ha.in.yidian.com:8001',
};

export default appConfig;
