import { ColumnType } from 'antd/es/table';

import { StrategyList, FeedbackList, StrategyForm, FeedbackForm } from '@/types/strat';
import { parseTimekey, parseEmailName } from '@/utils';

// 策略基础配置
export const FORM_ID = "strat_id";                                // 策略ID
export const FORM_TITLE = "strat_title";                          // 策略标题
export const FORM_REMARK = "strat_remark";                        // 策略说明

// 策略用户配置
export const FORM_APPID = "strat_appid";                          // appid
export const FORM_DEVICE = "strat_device";                        // 设备
export const FORM_VERSION_MIN = "strat_min_api";                  // 版本号
export const FORM_VERSION_MAX = "strat_max_api";                  // 版本号
export const FORM_CHANNEl = "strat_distribution";                 // 渠道号
export const FORM_SOURCE = "strat_source";                        // 投放app
export const FORM_DISTRI = "strat_region";                        // 展示地区

// 策略展示配置
export const FORM_FROMID = "strat_channel";                       // 投放频道
export const FORM_RANK = "strat_position"                         // 投放位次
export const FORM_WEIGHT = "card_weight";                         // 展示权重，这个权重是和广告之间的pk，为1表示超ad权重
export const FORM_PRIORITY = "strat_priority";                    // 展示优先级
export const FORM_STRAT = "strat_display_strategy";               // 展示策略
export const FORM_MAX = "strat_display_max";                      // 最大展示次数
export const FORM_INTERVAL = "strat_display_interval";            // 展示间隔
export const FORM_PULL_UP_DOWN = "strat_pull_mode";               // 上下拉方式
export const FORM_IS_FEEDBACK = "strat_is_feedback";              // 是否支持负反馈， 但是负反馈这个是给到策略那边的配置，不对运营开放
export const FORM_FEEDBACK = "strat_feedback_id";                 // 选用的负反馈策略

// 策略用户圈选
export const FORM_PACKAGE = "strat_user_packid";                  // 用户包ID
export const FORM_BUCKET = "strat_user_bucket";                   // 用户bucket
export const FORM_WHITELIST = "strat_user_whitelist";             // 用户白名单

// 负反馈策略
export const FORM_FBID = "feedback_id";
export const FORM_ACTION = "card_action_type";                    // 负反馈针对的跳转类型
export const FORM_DAY = "feedback_forbidden_days";                // 负反馈禁用天数
export const FORM_DOWN = "feedback_downright";                    // 无点击后是否降权
export const FORM_COUNT = "feedback_downright_count";             // 无点击后强权次数
export const FORM_DAYS = "feedback_downright_days";               // 无点击后强权天数
export const FORM_NAME = "feedback_name";                         // 负反馈名称

// 策略 list key
export const LIST_ID = "strat_id";                                // 策略ID
export const LIST_APPID = "strat_appid";                          // APPID
export const LIST_TITLE = "strat_title";                          // 策略名称
export const LIST_REMARK = "strat_remark";                        // 策略说明
export const LIST_STATUS = "strat_status";                        // 状态
export const LIST_CREATE = "create_timekey";                      // 创建时间
export const LIST_CREATOR = "strat_creator";                      // 创建人
export const LIST_UPDATE = "update_timekey";                      // 更新时间
export const LIST_UPDATER = "strat_updater";                      // 更新人

// 负反馈 list key
export const LIST_FEEDBACK_ID = "feedback_id";
export const LIST_FEEDBACK_NAME = "feedback_name";
export const LIST_FEEDBACK_CREATOR = "feedback_creator";
export const LIST_FEEDBACK_TIMEKEY = "create_timekey";
export const LIST_FEDDBACK_DAY = "feedback_day";
export const LIST_FEEDBACK_DOWN = "feedback_downright";
export const LIST_FEEDBACK_COUNT = "feedback_downright_count";
export const LIST_FEEDNACK_DAYS = "feedback_downright_days";

// 筛选 key
export const SCREEN_ID = "strat_id";
export const SCREEN_APPID = "strat_appid";
export const SCREEN_NAME = "strat_title";
export const SCREEN_STATUS = "strat_status";
export const SCREEN_CREATE_START = "create_start";
export const SCREEN_CREATE_END = "create_end";

// 状态常量
export const STATUS_ALL = 0;
export const STATUS_ENABLE = 1;
export const STATUS_UNABLE = 2;

// 展示策略常量
export const DISPLAY_ONCE = "ONCE";
export const DISPLAY_MULTI = "MULTI";
export const DISPLAY_FOREVER = "FOREVER";
export const DISPLAY_LAUNCHSHOW = "LAUNCHSHOW";

// 上下拉方式常量
export const PULL_ALL = "all";
export const PULL_UP = "";
export const PULL_DOWN = "";

export const WeightOptions = [
  { value: 1, label: "高级权重" },
  { value: 2, label: "普通权重" }
]

// 设备
export const DeviceOptions = [
  { value: 'all', label: "全部" },
  { value: 'ios', label: "IOS" },
  { value: 'android', label: "Android" },
]

// app 版本
export const AppOptions = [
  { value: "default", label: "主APP" },
  { value: "bendihua", label: "本地化" }
]

// 地区
export const DistriOptions = [
  { value: "default", label: "主APP" },
  { value: "bendihua", label: "本地化" }
]

// 状态
export const StatusOptions = [
  { value: STATUS_ALL, label: "全部" },
  { value: STATUS_ENABLE, label: "启用" },
  { value: STATUS_UNABLE, label: "未启用" }
]

// 展示策略
export const StratOptions = [
  { value: DISPLAY_ONCE, label: "单次" },
  { value: DISPLAY_MULTI, label: "多次" },
  { value: DISPLAY_FOREVER, label: "永久" },
  { value: DISPLAY_LAUNCHSHOW, label: "每次启动app展示" },
]

// 上下拉方式
export const PullupOptions = [
  { value: "all", label: "上下拉均出现" },
  { value: "pullUp", label: "仅上拉出现" },
  { value: "pullDown", label: "仅下拉出现" }
]

export const IsFeedbackOptions = [
  { value: 1, label: '是' },
  { value: 0, label: '否' },
]

// 是否选项
export const YesNoOptions = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

// 策略列表
export const StratListColumn: ColumnType<StrategyList>[] = [
  {
    dataIndex: LIST_ID,
    key: LIST_ID,
    title: "策略ID",
  },
  {
    dataIndex: LIST_APPID,
    key: LIST_APPID,
    title: "AppID",
    render: text => text ? text : '--'
  },
  {
    dataIndex: LIST_STATUS,
    key: LIST_STATUS,
    title: "状态",
    width: 80,
    render: (value) => value ? StatusOptions.find(option => option.value === value)?.label : '--'
  },
  {
    dataIndex: LIST_CREATOR,
    key: LIST_CREATOR,
    title: "创建者",
    ellipsis: true,
    width: 100,
    render: text => text ? parseEmailName(text) : '--'// 只保留邮箱前缀
  },
  {
    dataIndex: LIST_UPDATER,
    key: LIST_UPDATER,
    title: "更新者",
    ellipsis: true,
    width: 100,
    render: text => text ? parseEmailName(text) : '--' // 只保留邮箱前缀
  }
];

export const FeedbackListColumn: ColumnType<FeedbackList>[] = [
  {
    dataIndex: LIST_FEEDBACK_ID,
    key: LIST_FEEDBACK_ID,
    title: "负反馈ID",
  },
  {
    dataIndex: LIST_FEEDBACK_NAME,
    key: LIST_FEEDBACK_NAME,
    title: "负反馈名称",
  },
  {
    dataIndex: LIST_FEEDBACK_CREATOR,
    key: LIST_FEEDBACK_CREATOR,
    title: "创建人",
    render: text => text ? parseEmailName(text) : '--',
  },
  {
    dataIndex: LIST_FEEDBACK_TIMEKEY,
    key: LIST_FEEDBACK_TIMEKEY,
    title: "创建时间",
    render: text => text ? parseTimekey(text) : '--'
  }
];

// 非必填defaultValue给的默认值需与数据库对齐, 其余用null值填充
export const defaultStrat: StrategyForm = {
  [FORM_ID]: null,
  [FORM_TITLE]: null,
  [FORM_REMARK]: "",

  [FORM_APPID]: "",
  [FORM_DEVICE]: "all",
  [FORM_VERSION_MAX]: null,
  [FORM_VERSION_MIN]: null,
  [FORM_CHANNEl]: "",

  [FORM_FROMID]: "",
  [FORM_RANK]: null,
  [FORM_WEIGHT]: 2,
  [FORM_PRIORITY]: null,
  [FORM_STRAT]: DISPLAY_ONCE,
  [FORM_MAX]: null,
  [FORM_INTERVAL]: "",
  [FORM_PULL_UP_DOWN]: "",
  [FORM_IS_FEEDBACK]: 1,
  [FORM_FEEDBACK]: null,

  [FORM_PACKAGE]: "",
  [FORM_BUCKET]: "",
  [FORM_WHITELIST]: "",
}

export const defaultFeedbacks: FeedbackForm = {
  [FORM_FBID]: null,
  [FORM_NAME]: "",
  [FORM_DAY]: 15,
  [FORM_DOWN]: true,
  [FORM_COUNT]: 10,
  [FORM_DAYS]: 15
}
