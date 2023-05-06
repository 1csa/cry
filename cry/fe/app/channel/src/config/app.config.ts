import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'channel',
  appName: 'channel',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'HomeOutlined',
      name: '频道运营',
    },
    // {
    //   key: '/logs',
    //   icon: 'BarChartOutlined',
    //   name: '操作日志',
    // },
    // {
    //   key: '/heart',
    //   icon: 'heart',
    //   name: '频道数据',
    // },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=59696875',
  layout: {
    hasSidebar: false,
    theme: 'dark',
  },
};

export default appConfig;
