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

// // 菜单权限
// // 审核菜单
// 1.用户资料审核： contentReview
// 2.图文安全审核：pictureArticleReview
// 3.视频安全审核：videoReview
// 4.短文本安全审核：shortContent
// 5. 用户行为审核： privateMessage
// 6. 认证审核：studentCard
// 7.图文分类标注：imageClassification
// 8.视频分类标注：videoClassification
// 9.图文质量标注: imageQuality
// 10.视频质量标注: videoQuality
// // 系统管理员菜单
// x.质检系统 inspection
// 1.特征内容： featureContent
// 2.数据统计：dataStatistics
// 3.业务配置:businessConfiguration
// 4.系统管理: systemManagement
const menus = [
  {
    key: '/',
    icon: 'iconhome',
    name: '首页',
  },
  {
    key: '/pictureArticleReview',
    icon: 'icontupian',
    name: '图文安全审核',
    subMenu: [
      {
        key: '/pictureArticleReview/mediaContentReview',
        icon: 'iconshenhe',
        name: '审核任务',
      },
      {
        key: '/pictureArticleReview/historicalContentList',
        icon: 'iconrenwujincheng',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/videoReview',
    icon: 'iconshipin',
    name: '视频安全审核',
    subMenu: [
      {
        key: '/videoReview/mediaContentReview',
        icon: 'iconshenhe',
        name: '审核任务',
      },
      {
        key: '/videoReview/historicalContentList',
        icon: 'iconrenwujincheng',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/shortContent',
    icon: 'iconcontent-typing-machine',
    name: '短文本安全审核',
    subMenu: [
      {
        key: '/shortContent/commentReview',
        icon: 'iconweixinliaotian',
        name: '短文本审核',
      },
      {
        key: '/shortContent/historicalContentList',
        icon: 'iconshu',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/contentReview',
    icon: 'iconyonghu',
    name: '用户资料审核',
    subMenu: [
      {
        key: '/contentReview/userprofile',
        icon: 'iconcredentials_icon',
        name: '用户资料审核',
      },
      {
        key: '/contentReview/historicalContentList',
        icon: 'icongerenxinxi',
        name: '用户资料审核列表',
      },
    ],
  },
  {
    key: '/privateMessage',
    icon: 'iconweixinliaotian',
    name: '用户行为审核',
    subMenu: [
      {
        key: '/privateMessage/messageReview',
        icon: 'iconshenhe',
        name: '审核任务',
      },
      {
        key: '/privateMessage/historyContentList',
        icon: 'iconrenwujincheng',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/studentCard',
    icon: 'iconcredentials_icon',
    name: '认证审核',
    subMenu: [
      {
        key: '/studentCard/studentReview',
        icon: 'iconshenhe',
        name: '审核任务',
      },
      {
        key: '/studentCard/historyContentList',
        icon: 'iconrenwujincheng',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/imageClassification',
    icon: 'iconicon',
    name: '图文分类标注',
    subMenu: [
      {
        key: '/imageClassification/marking',
        icon: 'iconlashen',
        name: '标注任务',
      },
      {
        key: '/imageClassification/historicalContentList',
        icon: 'iconyouyong',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/videoClassification',
    icon: 'icontiaosheng',
    name: '视频分类标注',
    subMenu: [
      {
        key: '/videoClassification/marking',
        icon: 'icondapingpangqiu',
        name: '标注任务',
      },
      {
        key: '/videoClassification/historicalContentList',
        icon: 'icontiqiu',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/imageQuality',
    icon: 'icondangang',
    name: '图文质量标注',
    subMenu: [
      {
        key: '/imageQuality/marking',
        icon: 'icontiaomaan1',
        name: '标注任务',
      },
      {
        key: '/imageQuality/historicalContentList',
        icon: 'iconticao',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/videoQuality',
    icon: 'icontiaowu',
    name: '视频质量标注',
    subMenu: [
      {
        key: '/videoQuality/marking',
        icon: 'iconbenpao',
        name: '标注任务',
      },
      {
        key: '/videoQuality/historicalContentList',
        icon: 'iconticao',
        name: '历史内容列表',
      },
    ],
  },
  {
    key: '/inspection',
    icon: 'iconinspection',
    name: '质检系统',
    subMenu: [
      {
        key: '/inspection/create',
        icon: 'iconcreate',
        name: '创建质检任务',
      },
      {
        key: '/inspection/pull',
        icon: 'iconpull',
        name: '领取质检任务',
      },
      {
        key: '/inspection/taskList',
        icon: 'iconlist',
        name: '历史质检任务列表',
      },
      {
        key: '/inspection/contentList',
        icon: 'iconrenwulingquchi',
        name: '历史质检内容列表',
      },
    ],
  },
  {
    key: '/featureContent',
    icon: 'iconguize',
    name: '特征内容',
    subMenu: [
      {
        key: '/featureContent/keywordManagement',
        icon: 'icondangan',
        name: '关键词管理',
      },
      {
        key: '/featureContent/whitelistManagement',
        icon: 'iconbaimingdan',
        name: '白名单管理',
      },
    ],
  },
  {
    key: '/dataStatistics',
    icon: 'iconzhexiantu1',
    name: '数据统计',
    subMenu: [
      {
        key: '/dataStatistics/businessDataStatistics',
        icon: 'icondashuju',
        name: '业务数据',
      },
      {
        key: '/dataStatistics/manualReviewDataStatistics',
        icon: 'iconzongheyewutongji',
        name: '人审数据',
      },
      {
        key: '/dataStatistics/sensitiveDataStatistics',
        icon: 'iconshujutubiao',
        name: '敏感词统计',
      },
    ],
  },
  {
    key: '/businessConfiguration',
    icon: 'icon-peizhishujuyuan',
    name: '业务配置',
    subMenu: [
      {
        key: '/businessConfiguration/subConfiguration',
        icon: 'iconnavicon-bspz',
        name: '子业务配置',
      },
      {
        key: '/businessConfiguration/tagGroupConfiguration',
        icon: 'iconpeizhi',
        name: '业务标签配置',
      },
      {
        key: '/businessConfiguration/partitionConfiguration',
        icon: 'iconxitongpeizhi',
        name: '审核分区配置',
      },
    ],
  },
  {
    key: '/systemManagement',
    icon: 'iconicon-test',
    name: '系统管理',
    subMenu: [
      {
        key: '/systemManagement/operationLog',
        icon: 'iconrizhiguanli1',
        name: '操作日志',
      },
      {
        key: '/systemManagement/staff',
        icon: 'iconyonghu',
        name: '审核员管理',
      },
    ],
  },
];

const appConfig: AppConfig = {
  appId: 'audit-system',
  appName: '暴雪系统',
  logo: 'https://si1.go2yd.com/get-image/0l8IsE9aUfg',
  menus,
  MANUAL_AUDIT_URL: isProd ? 'http://api-website-manual-audit-dataplatform.int.yidian-inc.com' : checkHostDebug('MANUAL_AUDIT_URL'),
  SENSWORD_URL: isProd ? `http://sensword.yidian-inc.com` : checkHostDebug('SENSWORD_URL'),
  SCREENSHOT_URL: `http://video-snapshot-service.int.yidian-inc.com/async/screenshot`,
  openMock: false,
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
