import { AppConfig } from './app.d';

const appConfig: AppConfig = {
  appId: 'interaction',
  appName: '互动运营平台',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      name: '人工干预',
      icon: 'control',
      subMenu: [{
        key: '/fans',
        name: '账号粉丝数',
        icon: 'user',
        subMenu: [{
          key: '/query_fans',
          name: '查询粉丝数',
          icon: 'bulb',
        },{
          key: '/follow_media',
          name: '一键涨粉',
          icon: 'to-top',
        }, {
          key: '/auto_fans',
          name: '自动涨粉',
          icon: 'switcher',
        }, {
          key: '/timing_fans',
          name: '定时定量涨粉',
          icon: 'switcher',
        }]
      }, {
        key: '/like_news',
        name: '文章点赞数',
        icon: 'file-text',
      }, {
        key: '/like_comment',
        name: '评论点赞数',
        icon: 'message',
      }, {
        key: '/play_times',
        name: '视频内容播放数',
        icon: 'play-circle',
      }, {
        key: '/tui_switch',
        name: '推一推开关',
        icon: 'rocket',
      }]
    }
  ],
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
