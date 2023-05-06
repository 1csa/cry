/**
 * TODO 可以将同业务或者页面的放在一个对象下
 */

import { SelectOptionsType, BtnGroupTypes } from '@/types';
import { inspectionVideo as inspectionVideoBusinessUnitType, inspectionArticleQualityBusinessUnitId } from '@/pages/inspection/components/config';

// 机审能力
export const machinePower: Array<SelectOptionsType> = [
  {
    label: '敏感词服务',
    value: 'sensitive',
  },
];

// 审核阶段
export const audit_level: Array<SelectOptionsType> = [
  {
    label: '一审',
    value: 1,
  },
  {
    label: '二审',
    value: 2,
  },
  {
    label: '三审',
    value: 3,
  },
];
// 审核阶段 兼容阶段的代码
export const stage: Array<SelectOptionsType> = [
  {
    label: '一审',
    value: 100,
  },
  {
    label: '二审',
    value: 200,
  },
  {
    label: '三审',
    value: 300,
  },
];

// 举报类型
export const feedBackReasonsList: Array<SelectOptionsType> = [
  {
    label: '谣言',
    value: '谣言'
  },
  {
    label: '广告',
    value: '广告'
  },
  {
    label: '标题党',
    value: '标题党'
  },
  {
    label: '旧闻',
    value: '旧闻'
  },

  {
    label: '色情',
    value: '色情'
  },
  {
    label: '错别字多',
    value: '错别字多'
  },
  {
    label: '封建迷信',
    value: '封建迷信'
  },
  {
    label: '内容差',
    value: '内容差'
  },
  {
    label: '劣质源',
    value: '劣质源'
  },
  {
    label: '反动',
    value: '反动'
  },
  {
    label: '侵权',
    value: '侵权'
  },
  {
    label: '历史虚无',
    value: '历史虚无'
  },
  {
    label: '涉未成年不良信息',
    value: '涉未成年不良信息'
  },
  {
    label: '网络暴力',
    value: '网络暴力'
  },
  {
    label: '算法推荐不良信息',
    value: '算法推荐不良信息'
  },

  {
    label: '其他',
    value: '其他'
  },
]

// 审核状态映射关系 包括人审和机审的所有状态
export const reviewStatus = (status: number | string) => {
  let obj = {
    3001: '审核通过',
    3002: '审核不通过',
    3003: '审核部分通过',
    3004: '待审核',
    3005: '审核中',
    3010: '审核结束',
    3101: '机审通过',
    3102: '机审不通过',
    3103: '3103',
    3104: '部分通过',
    3105: '3105',
    3106: '通过后先发',
    3109: '未知',
    9999: '已作废',
  };
  return obj[status];
};

export const machineResult: Array<SelectOptionsType> = [
  {
    label: '通过',
    value: 3101,
  },
  {
    label: '不通过',
    value: 3102,
  },
  {
    label: '部分通过',
    value: 3104,
  },
];

// form 人审结果
export const manualResult: Array<SelectOptionsType> = [
  {
    label: '不需要人审',
    value: 0,
  },
  {
    label: '通过',
    value: 3001,
  },
  {
    label: '不通过',
    value: 3002,
  },
  {
    label: '部分通过',
    value: 3003,
  },
];

// 用户资料审核 人审标签
export const btnGroup = () => {
  const arr = ['涉领导人', '政治敏感', '淫秽色情', '血腥恐爆', '广告营销', '其他'];
  return arr;
};

export const userTag: Array<SelectOptionsType> = [
  {
    label: '涉领导人',
    value: 3002,
  },
  {
    label: '政治敏感',
    value: 3002,
  },
  {
    label: '淫秽色情',
    value: 3002,
  },
  {
    label: '血腥恐爆',
    value: 3002,
  },
  {
    label: '广告营销',
    value: 3002,
  },
  {
    label: '其他',
    value: 3002,
  },
];

/**
 * 下拉选项映射
 * 102 文章 10004对应文章的分区
 * 103 视频 10005 视频分区
 * 104 短文本 10003 短文本分区
 */
export const reviewAreaConst = {
  101: 10008,
  102: 10004,
  103: 10005,
  104: 10003,
  131: 1113101,
  132: 1213201,
};

export const reverseReviewAreaConst = {
  10008: 101,
  10004: 102,
  10005: 103,
  10003: 104,
  1113101: 131,
  1213201: 132,
};

// 历史列表 编辑按钮 机审不通过 3102 可人为纠正   主端图文、视频 | 啫喱图文、视频 | 啫喱用户资料
export const canEditBusinessUnitId = [
  100301, // 主端图文
  100701, // 主端视频
  2002, // 啫喱图文
  2006, // 啫喱视频
  2001, // 啫喱用户资料
];

// 历史列表 编辑按钮 子业务不可编辑
export const disabledBusinessUnitId = [
  210101, // 用户/啫喱创作者
];

// 子业务
export enum SubBusinessType {
  dailyTopic = 1010311, //  图文 日报主题
  dailyPush = 1010312, // 图文 日报推送
  nianHuaArticle = 1613101, // 年华 图文
  nianHuaVideo = 1613201, // 年华 视频

  message = 2011103, // 用户行为 私信举报
  user = 211101, // 用户行为 啫喱/用户举报
  groupChat = 211104, // 用户行为 啫喱/群聊举报
  storyImage = 211105, // 用户行为 啫喱/图文举报
  storyVideo = 211106, // 用户行为 啫喱/视频举报

  zenly = 2002, // 啫喱图文 照片墙
  groupPictures = 210205, // 啫喱图文 群空间照片墙
  zenLyGroup = 210501, // 短文本 群信息
  zenLyDynamic = 210601, // 短文本 动态
  zenLyMaterial = 210201, // 图文 啫喱素材
}
// 业务
export enum BusinessType {
  nianHua = 51, // 图文、视频 年华
  inspection = 70, // 质检 一点
}
/**
 * 维护所有的内容类型
 */
export enum ContentType {
  userprofile = 101, // 用户资料
  article = 102, // 图文安审
  video = 103, // 视频安审
  comment = 104,
  articleTags = 131, // 图文分类标注
  videoTags = 132, // 视频分类标注
  articleQuality = 141,
  videoQuality = 142,
  // message = 111, // 私信安审
  userAction = 111, // 用户行为
  student = 122, // 认证安审
  inspection = 171, // 质检审核
}

export const material_type = [
  {
    value: 101,
    label: '用户资料',
  },
  {
    value: 102,
    label: '图文',
  },
  {
    value: 103,
    label: '视频',
  },
  {
    value: 104,
    label: '短文本',
  },
  {
    value: 131,
    label: '图文分类标注',
  },
  {
    value: 132,
    label: '视频分类标注',
  },
  {
    value: 141,
    label: '图文质量标注',
  },
  {
    value: 142,
    label: '视频质量标注',
  },
  {
    value: 111,
    label: '私信',
  },
  {
    value: 122,
    label: '认证',
  },
];

// 时效性 文章非低质  || 负反馈
export const aging = [
  {
    label: '2小时',
    value: '2h',
  },
  {
    label: '6小时',
    value: '6h',
  },
  {
    label: '1天',
    value: '1d',
  },
  {
    label: '3天',
    value: '3d',
  },
  {
    label: '5天',
    value: '5d',
  },
  {
    label: '30天',
    value: '30d',
  },
  {
    label: '90天',
    value: '90d',
  },
  {
    label: '180天',
    value: '180d',
  },
  {
    label: '无时效',
    value: 'nt',
  },
  {
    label: '当天',
    value: 'td',
  },
];

/**
 * 负反馈人审标签
 */
export const negFeedbackUserBtnGroup: Array<BtnGroupTypes> = [
  {
    label: 'not-pass',
    name: '文章下线',
    code: 3002,
    // type: 'primary',
    type: 'default',
    // danger: true,
    danger: false,
    disabled: false,
    loading: false,
  },
  {
    label: 'not-show',
    name: '文章通过不展示',
    code: 3001,
    // type: 'primary',
    type: 'default',
    danger: false,
    disabled: false,
    loading: false,
  },
  {
    label: 'pass',
    name: '无效反馈',
    code: 3001,
    type: 'default',
    danger: false,
    disabled: false,
    loading: false,
    subLabels: aging,
  },
];

/**
 * 评论人审核按钮
 */
export const commentsUserBtnGroup: Array<BtnGroupTypes> = [
  {
    label: 'pass',
    name: '通过',
    code: 3001,
    type: 'primary',
  },
  {
    label: 'delete',
    name: '删除',
    code: 3002,
    type: 'primary',
    danger: true,
  },
  {
    label: 'forbid',
    name: '封禁用户',
    code: 3002,
    type: undefined,
  },
];

/**
 * 用户标签组选择之后的提交按数据
 */
export const userTagSubmitButtonGroup: Array<BtnGroupTypes> = [
  {
    label: 'not-pass',
    name: '驳回',
    code: 3002,
    type: 'primary',
    danger: false,
    loading: false,
  },
  {
    label: 'not-show',
    name: '通过',
    code: 3001,
    type: 'primary',
    danger: true,
    loading: false,
  },
];

/**
 * 列表用来映射列表中人审标签的方法
 */
const userTableTag = (arr: Array<BtnGroupTypes>) => {
  let userReviewTag = {};
  arr
    .map((ele: BtnGroupTypes) => {
      return {
        [ele.label]: ele.name,
      };
    })
    .forEach(item => Object.assign(userReviewTag, item));
  return userReviewTag;
};

export const negFeedbackUserTag = userTableTag(negFeedbackUserBtnGroup);
export const commentUserTag = userTableTag(commentsUserBtnGroup);

export const releaseTypeResult = {
  POSITIVE: '结束审核，XXX主动释放至',
  PASSIVE: '任务未在审核设定时间中操作完成而超时，暴雪系统释放至',
  TIMEOUT: '系统任务超时，暴雪系统释放至',
};

export const videoType = [
  'videoReview/mediaContentReview',
  'videoReview/historicalContentList',
  'videoClassification/marking',
  'videoClassification/historicalContentList',
  'videoQuality/marking',
  'videoQuality/historicalContentList',
];
export const articleType = [
  'pictureArticleReview/mediaContentReview',
  'pictureArticleReview/historicalContentList',
  'imageClassification/marking',
  'imageClassification/historicalContentList',
  'imageQuality/marking',
  'imageQuality/historicalContentList',
];

// 质检业务 视频
export const inspectionVideo = inspectionVideoBusinessUnitType;
export const inspectionArticleQuality = inspectionArticleQualityBusinessUnitId;

/**
 * 机器模型映射
 */
export const featuresCn = {
  security: '涉政、色情',
  scBait: '标题党',
  scSick: '重口味',
  scDirty: '低俗',
  scSpam: '软文',
};

/**
 * 视频标签类型映射
 */
export const videoTitleType = {
  video: '视频',
  other: '其他',
  poster: '封面',
  summary: '简介',
  title: '标题',
  common: '通用',
  quality: '质量',
  timeliness: '时效性',
};

// 标签/标签组
export const tagInfo = {
  action: [
    {
      label: '通过',
      value: 1,
    },
    {
      label: '拒绝',
      value: 2,
    },
  ],
};

/**
 * 白名单一些设置
 */
export const whiteList = {
  whiteListType: [
    {
      label: '图文自媒体高敏白名单',
      value: 8,
    },
    {
      label: '图文获取账号高敏白名单',
      value: 2,
    },
    {
      label: '版权白名单',
      value: 3,
    },
    {
      label: '先发后审白名单',
      value: 4,
    },
    {
      label: '视频获取账号高敏白名单',
      value: 5,
    },
    {
      label: '视频自媒体高敏白名单',
      value: 6,
    },
    {
      label: 'PUSH获取账号白名单',
      value: 7,
    },
    {
      label: '生活圈帖子白名单',
      value: 9,
    },
    {
      label: '媒体涉政白名单',
      value: 10,
    },
    {
      label: '数美豁免白名单',
      value: 11,
    },
    {
      label: "获取账号恶意推广豁免白名单",
      value: 12,
    },
    {
      label: "1v1马甲号",
      value: 13,
    },
    {
      label: "24h自见豁免白名单",
      value: 14,
    }
  ],
  status: [
    {
      label: '生效中',
      value: 1,
    },
    {
      label: '已下线',
      value: 2,
    },
    {
      label: '已过期',
      value: 3,
    },
  ],
  objectType: [
    {
      label: '自媒体',
      value: 1,
    },
  ],
};

/**
 * 系统设置
 */
export const sysConfing = {
  businessType: [
    {
      label: '子业务',
      value: 'business_auth',
    },
    {
      label: '分区',
      value: 'partzone_info',
    },
    {
      label: '审核标签组',
      value: 'audit_label_group',
    },
    {
      label: '审核标签',
      value: 'audit_label',
    },
    {
      label: '白名单',
      value: 'object_allow_list',
    },
  ],
};

/**
 * 业务配置参数
 */
export const businessConf = {
  isEnabledKey: [
    {
      label: '是',
      value: 1,
    },
    {
      label: '否',
      value: 0,
    },
  ],
};

/**
 * 安全性标签提取数据
 */
export const saftyTags = ['不展示', '特殊_低俗', '特殊_重口味'];

export const auditStatus = [
  {
    label: '已审核',
    value: 1,
  },
  {
    label: '待审核',
    value: 0,
  },
  {
    label: '已作废',
    value: 9999,
  },
];

// 1.6.1 机审模型
export const machineModelMapping = {
  malicious: '恶意推广',
  sensitive: '内容敏感',
  title_malicious: '恶意推广',
  summary_malicious: '恶意推广',
  video_sensitive: '敏感政治',
  poster_sensitive: '敏感政治',
};

interface itemOptions {
  label: string;
  code: string | number;
  status: 0 | 1 | 2; // 0-初始状态 1-选中状态 2-disabled状态
}

// 私信审核 违规模块
export const moduleOptions: Array<itemOptions> = [
  {
    label: '违法违规',
    code: 'Illegal_delinquent',
    status: 0,
  },
  {
    label: '色情低俗',
    code: 'erotic',
    status: 0,
  },
  {
    label: '恶意炒作',
    code: 'malicious_speculation',
    status: 0,
  },
  {
    label: '广告卖货',
    code: 'advertisement',
    status: 0,
  },
  {
    label: '谣言欺诈',
    code: 'rumor',
    status: 0,
  },
  {
    label: '侮辱',
    code: 'abuse',
    status: 0,
  },
  {
    label: '侵犯权益',
    code: 'tort',
    status: 0,
  },
  {
    label: '侵犯未成年人权益',
    code: 'Infringing_minors',
    status: 0,
  },
  {
    label: '其他',
    code: 'other',
    status: 0,
  },
];

export const groupChatReportModuleOptions: Array<itemOptions> = [
  {
    label: '时政敏感',
    code: 'sensitive',
    status: 0,
  },
  ...moduleOptions,
];

// 私信审核 违规程度
export const degreeOptions: Array<itemOptions> = [
  {
    label: '轻度',
    code: 'light',
    status: 0,
  },
  {
    label: '中度',
    code: 'moderate',
    status: 0,
  },
  {
    label: '重度',
    code: 'severe',
    status: 0,
  },
];

const degreeNoModerate = degreeOptions.filter(item => item.code !== 'moderate');
const degreeSevere = degreeOptions.filter(item => item.code === 'severe');

const groupChatReportChildren = [
  {
    title: '违规程度',
    required: true,
    options: [...degreeNoModerate],
  },
];

export const userAction = {
  // 群聊举报
  groupChatReport: [
    {
      title: '违规模块',
      required: true,
      options: [
        {
          label: '时政敏感',
          code: 'sensitive',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '违法违规',
          code: 'Illegal_delinquent',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '色情低俗',
          code: 'erotic',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '恶意炒作',
          code: 'malicious_speculation',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '广告卖货',
          code: 'advertisement',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '谣言欺诈',
          code: 'rumor',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '辱骂',
          code: 'abuse',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '侵犯权益',
          code: 'tort',
          status: 0,
          children: [...groupChatReportChildren],
        },

        {
          label: '侵犯未成年权益',
          code: 'Infringing_minors',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '冒充官方或他人',
          code: 'pretend',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '账号被盗',
          code: 'account_stolen',
          status: 0,
          children: [...groupChatReportChildren],
        },
        {
          label: '其他',
          code: 'other',
          status: 0,
          hasInput: true,
          children: [...groupChatReportChildren],
        },
      ],
    },
  ],
};

// 用户行为 违规类型 & 违规程度
export const uerActionTypeDegreeOptions: Array<itemOptions & { degree?: itemOptions[] }> = [
  {
    label: '违法违规',
    code: 'Illegal_delinquent',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '色情低俗',
    code: 'erotic',
    status: 0,
    degree: [...degreeOptions],
  },
  {
    label: '恶意炒作',
    code: 'malicious_speculation',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '广告卖货',
    code: 'advertisement',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '谣言欺诈',
    code: 'rumor',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '辱骂',
    code: 'abuse',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '侵犯权益',
    code: 'tort',
    status: 0,
    degree: [...degreeNoModerate],
  },

  {
    label: '侵犯未成年权益',
    code: 'Infringing_minors',
    status: 0,
    degree: [...degreeNoModerate],
  },
  {
    label: '冒充官方或他人',
    code: 'pretend',
    status: 0,
    degree: [...degreeNoModerate],
  },

  {
    label: '账号被盗',
    code: 'account_stolen',
    status: 0,
    degree: [...degreeSevere],
  },
  {
    label: '其他',
    code: 'other',
    status: 0,
    degree: [...degreeOptions],
  },
];

// 用户行为 违规模块
export const userActionModuleOptions: Array<itemOptions> = [
  {
    label: '头像',
    code: 'avatar',
    status: 0,
  },
  {
    label: '昵称',
    code: 'nick',
    status: 0,
  },
  {
    label: '简介',
    code: 'description',
    status: 0,
  },
  {
    label: '账号',
    code: 'account',
    status: 0,
  },
];

// 学生证审核
export const studentAuditOptions = {
  pass: {
    default: [],
  },
  reject: {
    default: [
      { code: 'non_student_ID', label: '非本校学生证件', desc: '', keyname: '', keycode: '' },
      { code: 'incorrect_student_ID', label: '学生证件不正确', desc: '', keyname: '', keycode: '' },
      { code: 'blurring_student_ID', label: '学生证件不清晰', desc: '', keyname: '', keycode: '' },
      { code: 'covered_student_ID', label: '学生证件有遮挡', desc: '', keyname: '', keycode: '' },
      { code: 'expired_student_ID', label: '学生证件已过期', desc: '', keyname: '', keycode: '' },
      {
        code: 'false_student_ID_photo',
        label: '非学生证件照片页',
        desc: '',
        keyname: '',
        keycode: '',
      },
      // { code: 'other', label: '其他问题', desc: '审核员自定义内容', keyname: '', keycode: '' },
    ],
  },
};

// 日报主题
export const dailyTopicAuditData = [
  {
    code: 3001,
    text: '审核通过',
    labelList: [],
    labelTree: [
      {
        group: 'other',
        groupCn: '驳回',
        order: 0,
        cancelable: true,
        inputType: 'radio',
        colorStyle: 'danger',
        spaceId: '',
        spaceType: '',
        labels: [
          {
            code: 'sensitive',
            label: '内容敏感',
            desc: null,
            keyname: null,
            keycode: 'null',
          },
          {
            code: 'malicious',
            label: '恶意推广',
            desc: null,
            keyname: null,
            keycode: 'null',
          },
          {
            code: 'vulgar',
            label: '色情低俗',
            desc: null,
            keyname: null,
            keycode: 'null',
          },
          {
            code: 'verbal_abuse',
            label: '攻击谩骂',
            desc: null,
            keyname: null,
            keycode: 'null',
          },
          {
            code: 'fake_news',
            label: '虚假消息',
            desc: null,
            keyname: null,
            keycode: 'null',
          },
        ],
      },
    ],
  },
  {
    code: 3002,
    text: '审核不通过',
    labelList: [],
    labelTree: [],
  },
  {
    code: 3003,
    text: '审核部分通过',
    labelList: [],
    labelTree: [],
  },
];

// 日报推送
export const dailyPushAuditData = [
  {
    code: 3001,
    text: '审核通过',
    labelMap: {
      default: [],
    },
    labelList: [],
  },
  {
    code: 3002,
    text: '审核不通过',
    labelMap: {
      default: [
        {
          code: 'sensitive',
          label: '内容敏感',
          desc: '内容敏感',
          keyname: '',
          keycode: '',
        },
        {
          code: 'malicious',
          label: '恶意推广',
          desc: '谢绝恶意推广',
          keyname: '',
          keycode: '',
        },
        {
          code: 'soft_article',
          label: '软文推广',
          desc: '谢绝广告/软文/活动推广',
          keyname: '',
          keycode: '',
        },
        {
          code: 'reactionary_porn',
          label: '反动色情',
          desc: '发布反动、暴力、色情、淫秽和其他违法内容',
          keyname: '',
          keycode: '',
        },
        {
          code: 'vulgar',
          label: '内容低俗',
          desc: '图文或视频含有低俗内容',
          keyname: '',
          keycode: '',
        },
        {
          code: 'content_incompliance',
          label: '图文不合规',
          desc: '图文内容不合规',
          keyname: '',
          keycode: '',
        },
        {
          code: 'fake_news',
          label: '虚假消息',
          desc: '发布虚假消息',
          keyname: '',
          keycode: '',
        },
        {
          code: 'infringement',
          label: '内容侵权',
          desc: '内容侵权',
          keyname: '',
          keycode: '',
        },
        {
          code: 'title_incompliance',
          label: '标题不规范',
          desc: '标题不规范或含有基本语句错误',
          keyname: '',
          keycode: '',
        },
        {
          code: 'title_sensational',
          label: '标题党',
          desc: '标题党或标题夸张',
          keyname: '',
          keycode: '',
        },
        {
          code: 'cover_violation',
          label: '封面图违规',
          desc: '封面图不符合规范',
          keyname: '',
          keycode: '',
        },
        {
          code: 'image_disp_error',
          label: '图片显示错误',
          desc: '图片显示不正常，请手动上传',
          keyname: '',
          keycode: '',
        },
        {
          code: 'low_quality',
          label: '内容低质',
          desc: '内容低质量',
          keyname: '',
          keycode: '',
        },
        {
          code: 'image_watermark',
          label: '图片水印',
          desc: '请去除图片中的水印',
          keyname: '',
          keycode: '',
        },
        {
          code: 'video_irrelevant',
          label: '视频无关',
          desc: '视频与正文内容无关',
          keyname: '',
          keycode: '',
        },
        {
          code: 'video_play_error',
          label: '视频播放错误',
          desc: '视频无法正常播放',
          keyname: '',
          keycode: '',
        },
        {
          code: 'no_masaic',
          label: '未打码',
          desc: '图片或视频未打码',
          keyname: '',
          keycode: '',
        },
        {
          code: 'plagiarism',
          label: '内容抄袭',
          desc: '抄袭',
          keyname: '',
          keycode: '',
        },
        {
          code: 'unusual_language',
          label: '外文少数文',
          desc: '全文为外文、少数民族文字',
          keyname: '',
          keycode: '',
        },
        {
          code: 'outdated_news',
          label: '过时或旧闻',
          desc: '过时和旧闻',
          keyname: '',
          keycode: '',
        },
        {
          code: 'unsuitable',
          label: '不适合收录',
          desc: '不适合收录',
          keyname: '',
          keycode: '',
        },
        {
          code: 'other',
          label: '其他问题',
          desc: '审核员自定义内容',
          keyname: '',
          keycode: '',
        },
      ],
    },
    labelList: [
      {
        group: 'default',
        groupCn: null,
        code: 'sensitive',
        label: '内容敏感',
        desc: '内容敏感',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'malicious',
        label: '恶意推广',
        desc: '谢绝恶意推广',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'soft_article',
        label: '软文推广',
        desc: '谢绝广告/软文/活动推广',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'reactionary_porn',
        label: '反动色情',
        desc: '发布反动、暴力、色情、淫秽和其他违法内容',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'vulgar',
        label: '内容低俗',
        desc: '图文或视频含有低俗内容',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'content_incompliance',
        label: '图文不合规',
        desc: '图文内容不合规',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'fake_news',
        label: '虚假消息',
        desc: '发布虚假消息',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'infringement',
        label: '内容侵权',
        desc: '内容侵权',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'title_incompliance',
        label: '标题不规范',
        desc: '标题不规范或含有基本语句错误',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'title_sensational',
        label: '标题党',
        desc: '标题党或标题夸张',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'cover_violation',
        label: '封面图违规',
        desc: '封面图不符合规范',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'image_disp_error',
        label: '图片显示错误',
        desc: '图片显示不正常，请手动上传',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'low_quality',
        label: '内容低质',
        desc: '内容低质量',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'image_watermark',
        label: '图片水印',
        desc: '请去除图片中的水印',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'video_irrelevant',
        label: '视频无关',
        desc: '视频与正文内容无关',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'video_play_error',
        label: '视频播放错误',
        desc: '视频无法正常播放',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'no_masaic',
        label: '未打码',
        desc: '图片或视频未打码',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'plagiarism',
        label: '内容抄袭',
        desc: '抄袭',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'unusual_language',
        label: '外文少数文',
        desc: '全文为外文、少数民族文字',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'outdated_news',
        label: '过时或旧闻',
        desc: '过时和旧闻',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'unsuitable',
        label: '不适合收录',
        desc: '不适合收录',
        keyname: '',
        keycode: '',
      },
      {
        group: 'default',
        groupCn: null,
        code: 'other',
        label: '其他问题',
        desc: '审核员自定义内容',
        keyname: '',
        keycode: '',
      },
    ],
  },
  {
    code: 3003,
    text: '审核部分通过',
    labelMap: {},
    labelList: [],
  },
];

// antd Image fallback
export const fallback =
  'data:image/png;base64,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';
