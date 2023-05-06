import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'short_video_ugc',
  appName: '小视频话题管理工具',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [{
    key: '/',
    icon: 'icon-yemian',
    name: '首页',
  },{
    key: '/topic',
    name: '话题管理',
    icon: 'icon-huatiguanli'
  },{
    key: '/square',
    name: '活动广场',
    icon: 'icon-huodongguangchang'
  },
  // {
  //   key: '/slide',
  //   name: '轮播图',
  //   icon: 'icon-ziyuan'
  // },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
