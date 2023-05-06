import { AppConfig } from './app.d';
import pearImg from '../../pubic/pear.png';
export const isPrd = () => {
  if (location.host.includes('zeus.v.yidian-inc.com')) {
    return true;
  } else if (location.host.includes('dev.yidian-inc.com')) {
    return false;
  }
};
const appConfig: AppConfig = {
  appId: 'pear',
  appName: 'pear',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  // logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: "http://si1.go2yd.com/get-image/0Z8vMt5u4kS",
  logo: pearImg,

  menus: [
    {
      key: '/',
      icon: 'home',
      name: '首页',
    },
    {
      key: '/knnAutomation',
      icon: 'dashboard',
      name: 'KNN索引',
      subMenu: [
        {
          icon: 'setting',
          key: '/knnAutomation/TheIndex',
          name: '总览',
        },
        // ,{
        //   icon: 'global',
        //   key: '/knnAutomation/circle',
        //   name: '圈库',
        // }
        {
          icon: 'control',
          key: '/knnAutomation/management',
          name: '库管理',
        },
        {
          icon: 'tool',
          key: '/knnAutomation/building',
          name: '历史构建',
        },
        {
          icon: 'tool',
          key: '/knnAutomation/factor',
          name: 'factor管理',
        },
        {
          icon: 'tool',
          key: '/knnAutomation/machine',
          name: '机器管理',
        },
      ],
    },
    // {
    //   key: '/kvAutomation',
    //   icon: 'area-chart',
    //   name: 'KV索引',
    //   subMenu: [
    //     {
    //     icon: 'bank',
    //     key: '/kvAutomation/overview',
    //     name: '总览',
    //   },
    //    {
    //     icon: 'tool',
    //     key: '/kvAutomation/historybuilding',
    //     name: '历史构建',
    //   },

    //   {
    //     icon: 'database',
    //     key: '/kvAutomation/management',
    //     name: '库管理',
    //   }
    // ]
    // },
    // {
    //     icon: 'setting',
    //     key: '/meta',
    //     name: 'META配置',
    //     subMenu:[
    //         {
    //     icon: 'bank',
    //     key: '/meta/allIndex',
    //     name: '全局配置',
    //   },
    //        {
    //     icon: 'control',
    //     key: '/meta/kvindex',
    //     name: 'kv索引配置',
    //   },
    //    {
    //     icon: 'control',
    //     key: '/meta/knnindex',
    //     name: 'knn索引配置',
    //   },
    //     ]
    // },  
    {
      icon: 'tool',
      key: '/filterRules',
      name: '过滤规则配置',
      subMenu: [
        {
          icon: 'bank',
          key: '/filterRules/index',
          name: '规则首页',
        },
        {
          icon: 'rocket',
          key: '/filterRules/scene',
          name: '业务场景管理',
        },
        {
          icon: 'book',
          key: '/filterRules/ruleMapping',
          name: '工具规则映射管理',
        },
      ]
    },
    {
      icon: 'bug',
      key: '/filterDebug',
      name: '过滤debug工具',
      subMenu: [
        {
          icon: 'bank',
          key: '/filterDebug/allTasks',
          name: '所有任务',
        },
      ]
    }
  ],
  // 帮助文档，如果不需要注释掉即可
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  TheEnvironment: isPrd() ? 'http://pear.int.yidian-inc.com' : 'http://10.126.11.28:8060',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
