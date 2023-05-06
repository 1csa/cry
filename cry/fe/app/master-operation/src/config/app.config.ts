import { AppConfig } from './app.d';
const isProd = process.env.NODE_ENV === 'production';
const appConfig: AppConfig = {
  appId: 'master-operation',
  appName: '主端运营工具',
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
      key: '/diversion-configuration',
      icon: 'line-chart',
      name: '主端本地导流配置',
    },
  ],
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
  uploadAction: ` http://${
    isProd ? 'zeus.v.yidian-inc.com' : 'dev.yidian-inc.com:5000'
  }/api/app/common/upload`,
  // 思文提供 int/test
  diversion_HOST: `http://operationtoolservice.${isProd ? 'int' : 'test'}.yidian-inc.com`,
};

export default appConfig;
