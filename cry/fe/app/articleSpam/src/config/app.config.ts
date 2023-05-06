import { AppConfig } from './app.d';

const isPrd = () => {
  if (
    location.host.includes('venus.int.yidian-inc.com:5000') ||
    location.host.includes('zeus.v.yidian-inc.com')
  ) {
    return true;
  } else if (
    location.host.includes('venus.int.yidian-inc.com') ||
    location.host.includes('dev.yidian-inc.com')
  ) {
    return false;
  }
};

const appConfig: AppConfig = {
  appId: 'articleSpam',
  appName: '文章审核工具',
  // appId: 'simple-demo',
  // appName: 'Simple App Demo',
  // 红 logo
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  // TODO:
  // menus: [],
  layout: {
    hasSidebar: true,
    theme: 'dark',
    // hasSidebar: false,
    // theme: 'dark',
    // theme: 'light',
  },
  API_HOST: 'http://10.120.46.4:8041',
  API_TOOLS_HOST: isPrd()
    ? 'http://operationtoolservice.go2yd.int.yidian-inc.com'
    : 'http://10.120.18.31:8810',
  // ? 'http://operationtoolservice.go2yd.int.yidian-inc.com'
  // : 'http://10.120.18.31:8810',
  // API_k8s_HOST: "http://cl-k8s-staging.yidian-inc.com/apis/cpp-doc", // 测试
  API_k8s_HOST: isPrd()
    ? 'http://cl-k8s.yidian-inc.com/apis/cpp-doc'
    : 'http://cl-k8s-staging.yidian-inc.com/apis/cpp-doc',
};
// // 测试
// const env = process.env
// if(env && env.NODE_ENV !== "production"){
//   appConfig.API_TOOLS_HOST = "http://test.operationtoolservice.go2yd.int.yidian-inc.com";
// }
export default appConfig;
