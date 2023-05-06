import { AppConfig, CardMenu } from "@/types/app";
import { CardType } from '@/types/card';
import { SelectOption } from "@/types/comp";

export const BATH_PATH = "/app/inscription";
export const HOME_PATH = "/home";
export const CARD_PATH = "/card";
export const STRAT_PATH = "/strategy";
export const LAUNCH_PATH = '/launch';
export const HISTORY_PATH = "/history";

export const AUTH_CARD_EDIT = "";
export const AUTH_STRAT_EDIT = "";
export const AUTH_FEEDBACK_EDIT = "";

export const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";                               // 统一的时间定义格式

export const appConfig: AppConfig = {
  appId: 'inscription',
  appName: 'Inscription',
  logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  // 约定menu的key值对应路由值，新增路由需双方确定
  menus: [
    {
      key: '/home',
      icon: 'area-chart',
      name: '投放概览',
    },
    {
      key: '/card',
      icon: 'credit-card',
      name: '卡片管理',
      // subMenu: [{
      //   key: "/info",
      //   name: "信息流卡片"
      // }, {
      //   key: "/activity",
      //   name: "活动卡片"
      // }]
    },
    {
      key: '/strategy',
      icon: 'form',
      name: '策略管理',
    }, {
      key: '/launch',
      icon: 'compass',
      name: '投放管理',
    }, {
      key: '/history',
      icon: 'history',
      name: '操作日志',
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=59703093',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export const cardMenus: CardMenu[] = [{
  name: "信息流卡片",
  key: CardType.info,
}, {
  name: "特征卡片",
  key: CardType.feature
}];
