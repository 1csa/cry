import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'demo',
  appName: 'demo',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'home',
      name: '首页',
    },
    {
      key: '/documents',
      icon: 'file-text',
      name: '使用文档',
    },
    {
      key: '/about',
      icon: 'heart',
      name: '关于',
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: false,
    theme: 'dark',
  },
};

export default appConfig;
