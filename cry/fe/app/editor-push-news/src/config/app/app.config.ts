import { AppConfig } from './app.d';
import DOMAIN from './domain.config';
import { Auth_Account_Manager } from '@/config/account/account.config';

const appConfig: AppConfig = {
  appId: 'editor-push-news',
  appName: '推送管理系统',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    // {
    //   key: '/',
    //   icon: 'home',
    //   name: 'push 列表',
    // },
    // {
    //   key: '/setting',
    //   icon: 'bars',
    //   name: '设置',
    //   subMenu: [{
    //     key: '/setting/tag',
    //     icon: 'tags',
    //     name: '常用标签管理'
    //   }, {
    //     key: '/setting/userset',
    //     icon: 'usergroup-add',
    //     name: '圈定人群管理',
    //   }, {
    //     key: '/setting/account',
    //     icon: 'form',
    //     name: '账号管理',
    //   }, {
    //     key: '/setting/gid',
    //     icon: 'paper-clip',
    //     name: 'gid 管理',
    //   }, {
    //     key: '/setting/pushtype',
    //     icon: 'setting',
    //     name: 'pushtype 管理',
    //   }]
    // },
    {
      key: '/analyse',
      icon: 'bar-chart',
      name: 'CASE 分析',
    },
    {
      key: '/competitor',
      icon: 'team',
      name: '竞品 PUSH',
      subMenu: [
        {
          key: '/competitor/monitor',
          icon: 'monitor',
          name: '竞品 PUSH 监控',
        },
        // {
        //   key: '/competitor/cpa',
        //   icon: 'reconciliation',
        //   name: '竞品 PUSH 分析'
        // }
      ],
      // }, {
      //   key: '/experiment',
      //   icon: 'experiment',
      //   name: 'PUSH 实验'
    },
    {
      key: '/setting/usercover',
      icon: 'usergroup-add',
      name: '圈定人群管理',
    },
    {
      key: '/setting/userpackage',
      icon: 'folder',
      name: '人工用户包管理',
    },
    {
      key: 'push',
      icon: 'compass',
      name: '编辑推送管理',
      subMenu: [
        {
          //   key: "/push/temp",
          //   name: "模版管理",
          // }, {
          key: '/push/editor',
          name: '编辑推送',
        },
        {
          key: '/push/history',
          name: '推送历史',
        },
        {
          key: '/setting/account',
          name: '账号管理',
          authKey: Auth_Account_Manager,
        },
      ],
    },
    {
      key: '/charts',
      icon: 'line-chart',
      name: '数据统计',
      subMenu: [
        {
          key: '/charts/token',
          name: '数据统计',
        },
      ],
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/x/pkHFAw',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
  // API_HOST: 'http://10.120.196.19:18082/api', // 圈人群相关测试
  API_HOST: 'http://pushtag-apiserver.int.yidian-inc.com/api', // 圈人群相关线上
  PUSH_TYPE_HOST: 'http://10.136.134.27:18081', // gid pushtype 管理相关
  // PUSH_USER_COUNT_HOST: 'http://push.yidian.com/channel/channel-user-count', // 人数统计相关
  PUSH_CHANNEL_SEARCH_HOST: 'http://lion-assistant.int.yidian-inc.com/service/assistant2', // 搜索频道相关
  APOLLO_HOST: 'http://apollo-configcenter.ha.in.yidian.com:8108', // apollo 相关枚举配置
  NEW_PUSH_API_HOST: 'http://push.yidian.com', // 新的 push 项目 api
  // NEW_PUSH_API_HOST: 'http://10.126.42.14', // 新的 push 项目 api 测试环境
  OLD_PUSH_API_HOST: 'http://push_task.ha.in.yidian.com:8703', // 老的 push 项目 api
  PAUSE_HOST: 'http://infoflow-push-keep-intercept-api-prod.yidian-inc.com', // 暂停 恢复推送 api
  PUSH_MANNAGER: 'http://push-manage.int.yidian-inc.com',
  // PUSH_MANNAGER: "http://10.60.110.120:8080"
  PUSH_CHARTS_DATA_HOST: 'http://push-data.int.yidian-inc.com',
  PUSH_USER_TAG_HOST: DOMAIN.PUSH_USER_TAG_HOST,
};

export default appConfig;
