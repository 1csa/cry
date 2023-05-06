import { AppConfig } from './app.d';
import { isProdEnv } from '@/utils/dev_helper';

/**
 * 做一些线上和是不是debug判断
 */
let isProd: boolean = isProdEnv();
const checkHostDebug = (hostName: string) => {
  // 如果是测试环境的话就允许debug
  if (!isProd) {
    const hasDebugHost = localStorage.debugHost;
    const hostMap = {
      MANUAL_AUDIT_URL: () =>
        // hasDebugHost ? `http://${hasDebugHost}` : `http://10.60.108.43:6261`,
        // hasDebugHost ? `http://${hasDebugHost}` : `http://10.60.103.178:6261`,
        hasDebugHost ? `http://${hasDebugHost}` : `http://10.120.18.31:6261`, // dev 环境
      // hasDebugHost ? `http://${hasDebugHost}` : `http://10.60.106.89:6261`, // 尚政宇 机器
      // hasDebugHost ? `http://${hasDebugHost}` : `http://10.60.103.174:6261`, // 刘哲 机器
      SENSWORD_URL: () => (hasDebugHost ? `http://${hasDebugHost}` : `http://10.120.18.31:8080`),
    };
    return hostMap[hostName]();
  }
};

const appConfig: AppConfig = {
  appId: 'image',
  appName: '图片视频小工具',
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
    //   key: '/documents',
    //   icon: 'file-text',
    //   name: '使用文档',
    // },
    // {
    //   key: '/about',
    //   icon: 'heart',
    //   name: '关于',
    // },
  ],
  // MANUAL_AUDIT_URL: isProd
  //   ? 'http://api-website-manual-audit-dataplatform.int.yidian-inc.com'
  //   : checkHostDebug('MANUAL_AUDIT_URL'),
  MANUAL_AUDIT_URL: 'http://10.126.154.120:8001',
  SCREENSHOT_URL: `http://video-snapshot-service.int.yidian-inc.com/async/screenshot`,
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
