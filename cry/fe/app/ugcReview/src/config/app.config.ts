import { AppConfig } from './app.d';
const isProd = process.env.NODE_ENV === 'production';

const appConfig: AppConfig = {
  appId: 'ugcReview',
  appName: 'UGC内容管理平台',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'file-text',
      name: '内容管理',
    },
    {
      key: '/userlist',
      icon: 'user',
      name: '用户管理',
    },
    {
      key: '/namelist/white',
      icon: 'unlock',
      name: '黑白名单管理',
      subMenu: [
        {
          key: '/namelist/white',
          name: '白名单',
          icon: 'smile',
        },
        {
          key: '/namelist/black',
          name: '黑名单',
          icon: 'robot',
        },
      ],
    },
    {
      key: '/userCertification',
      icon: 'contacts',
      name: '达人认证',
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: false,
    theme: 'dark',
  },
  // 测试和生产是同一个库 请谨慎操作
  API_HOST: `http://${isProd ? 'a4' : 'a4-1'}.go2yd.com`,
  CPP_HOST: `http://${isProd ? 'cl-k8s' : 'cl-k8s-staging'}.yidian-inc.com/apis/cpp-doc`,
  API_SERVER_A4: 'http://a4.go2yd.com/Website',

  UPLOAD_HOST: isProd ? `http://zeus.v.yidian-inc.com` : `http://dev.yidian-inc.com:5000`,
  // 王靖提供 a4, a4-1
  API_SERVER_A1: `http://${isProd ? 'a4' : 'a4-1'}.go2yd.com`,
  // 炎久提供 int/test
  CATEGORIES_HOST: `http://operationtoolservice.${isProd ? 'int' : 'test'}.yidian-inc.com`, // 本地local 否则就是yidian
  // 思文提供 测试库独立 int/test
  CERT_HOST: `http://usergradeservice.${isProd ? 'int' : 'test'}.yidian-inc.com`,
};

export default appConfig;
