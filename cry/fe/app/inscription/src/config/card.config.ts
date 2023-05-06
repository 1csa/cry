import { ColumnType } from 'antd/es/table';

import { defaultActions } from '@/config/action.config';
import { SelectOption } from '@/types/comp';
import { CardForm, CardList, FormScreen } from '@/types/card';
import { parseTimekey } from '@/utils';

// 这里其实不是很符合规范，因为状态也有值为1
export const TEMP_1 = 1; // 单图卡片
export const TEMP_2 = 2; // 小图卡片
export const TEMP_3 = 3; // 小图带简介
export const TEMP_4 = 4; // 空白卡
export const TEMP_1002 = 1002; // 两级卡片
export const TEMP_1003 = 1003; // 三级卡片

export const TEMP_2002 = 2002; // 子卡片: 竖图卡片
export const TEMP_2003 = 2003; // 子卡片: 方图卡片
export const TEMP_2004 = 2004; // 子卡片: 多专辑组合卡片
export const TEMP_2005 = 2005; // 子卡片: 主题卡片
export const TEMP_2006 = 2006; // 子卡片: 沸点
export const TEMP_2007 = 2007; // 子卡片: 直播子卡
export const TEMP_2008 = 2008; // 子卡片: 直播pk子卡

/*
 * 表单字段
 */
// 基础信息
export const FORM_ID = 'card_id';
export const FORM_TYPE = 'card_type'; // 推荐类型
export const FORM_TEMP = 'card_temp'; // 卡片类型

// 内容配置
export const FORM_TOPITEM = 'card_topitem'; // 封面内容
export const FORM_TITLE = 'card_title'; // 卡片标题
export const FORM_COVER = 'card_cover'; // 封面图
export const FORM_REMARK = 'card_remark'; // 卡片描述
export const FORM_SHOW_TITLE = 'card_show_title'; // 是否展示标题
export const FORM_IMAGE_HEIGHT = 'card_cover_height'; // 图片高度
export const FORM_IMAGE_WIDTH = 'card_cover_width'; // 图片宽度
export const FORM_BUTTON_LABEL = 'card_button_label'; // 按钮文案
export const FORM_SUMMARY = 'card_summary'; // 简介
export const FORM_RIGHT_ICON = 'card_icon_right'; // 右上角图标
export const FORM_LEFT_ICON = 'card_icon_left'; // 左上角图标
export const FORM_AD_PIC = 'card_ad_pic'; // 冬奥会广告图片
export const FORM_AD_PIC_NIGHT = 'card_ad_pic_night'; // 冬奥会广告图片(夜间模式)
export const FORM_CONTENT = 'card_content';
export const FORM_STYLE = 'card_style';
export const FORM_ACTIONS = 'card_actions';
export const FORM_CSS = 'card_css';
export const FORM_TOP = "topCardNum";

export const FORM_MAIN = 'card_main_title';
export const FORM_SUB = 'card_sub_title';

// 空白卡
export const FORM_BLANK = "card_is_blank";
export const FORM_NEED = "card_is_need";
export const FORM_PATH = "card_need_path";

// 样式：左下角标签
export const FORM_LABEL_IF = 'card_label_ifback'; // 左下角标签是否有颜色
export const FORM_LABEL_BACK = 'card_label_backcolor'; // 左下角标签图标颜色
export const FORM_LABEL_TEXT = 'card_label_text'; // 左下角标签文案
export const FORM_LABEL_COLOR = 'card_label_color'; // 左下角标签文案色值

// 跳转：跳转更多
export const FORM_MORE = 'card_more_if'; // 是否支持跳转更多按钮
export const FORM_MORE_TEXT = 'card_more_text'; // 跳转更多文案
export const FORM_MORE_TOPITEM = 'card_more_topitem'; // 跳转更多的封面内容
export const FORM_MORE_ACTION = 'card_more_action'; // 跳转更多跳转方式
export const FORM_MORE_PARAM = 'card_more_params'; // 跳转更多跳转参数

//跳转： 跳转类型
export const FORM_ACTION = 'card_action'; // 跳转类型
export const FORM_ACTION_PARAM = 'card_action_params'; // 跳转类型参数

// TODO 字段定义到此处
// 子卡片: 子卡片也是一种卡片，有自己的字段，用child来区分是否合理？
export const FORM_CHILDS = 'card_items'; // 子卡片字段
export const FORM_CHILD_ID = 'card_id'; // 子卡片ID
export const FORM_CHILD_TYPE = 'card_template'; // 卡片模版
export const FORM_CHILD_TOPITEM = 'card_topitem'; // 子卡片封面内容
export const FORM_CHILD_MAIN = 'card_main_title'; // 子卡片主标题
export const FORM_CHILD_SUBTITLE = 'card_sub_title'; // 子卡片副标题
export const FORM_CHILD_TEMPLATE = 'card_template'; // 子卡片模版
export const FORM_CHILD_COVER = 'card_cover'; // 子卡片封面图
export const FORM_CHILD_TITLE = 'card_title'; // 子卡片标题
export const FORM_CHILD_LABEL = 'card_label'; // 字卡片标签文案
export const FORM_CHILD_COLOR = 'card_label_color'; // 子卡片标签颜色
export const FORM_BATTLE = 'card_battle'; // 直播pk
export const FORM_BATTLE_TIME = 'card_battle_time'; // 直播时间
export const FORM_BATTLE_TITLE = 'card_battle_title'; // 直播标题
export const FORM_BATTLE_SUB = 'card_battle_subtitle'; // 直播副标题
export const FORM_BATTLE_TEXT = 'card_battle_text'; // 主客队名称
export const FORM_BATTLE_IMAGE = 'card_battle_image'; // 主客队图标
export const FORM_BATTLE_SCORE = 'card_battle_score'; // 主客队比分
export const FORM_BATTLE_POS = 'card_battle_position';
export const FORM_ITEM_NAME = 'card_item_name'; // 子卡片奥运项目名称
export const FORM_ITEM_ICON = 'card_item_icon'; // 子卡片奥运项目icon

// 筛选字段
export const SCREEN_ID = 'card_id';
export const SCREEN_TITLE = 'card_title';
export const SCREEN_TYPE = 'card_temp';
export const SCREEN_STATUS = 'card_status';
export const SCREEN_STRAT = 'create_start';
export const SCREEN_END = 'create_end';

// 列表字段
export const LIST_ID = 'card_id';
export const LIST_TITLE = 'card_title';
export const LIST_TYPE = 'card_temp';
export const LIST_STATUS = 'card_status';
export const LIST_REMARK = 'card_remark';
export const LIST_CREATE = 'create_timekey';
export const LIST_UPDATE = 'update_timekey';
export const LIST_CREATER = 'card_creator';
export const LIST_UPDATER = 'card_updater';

export const card_types: SelectOption[] = [{ label: '信息流卡片', value: 1 }];

// 卡片类型，这里应该还需要其他的默认参数
export const card_temps = [
  {
    key: 'info_1',
    template_id: TEMP_1,
    template_name: '单图卡片',
    preview: 'https://si1.go2yd.com/get-image/0kHEbcgDRei',
  },
  {
    key: 'info_2',
    template_id: TEMP_2,
    template_name: '小图卡片',
    preview: 'https://si1.go2yd.com/get-image/0kHEfcJWa8G',
  },
  {
    key: 'info_3',
    template_id: TEMP_3,
    template_name: '小图卡片(带简介)',
    preview: 'https://si1.go2yd.com/get-image/0kHEpefWG80',
  },
  {
    key: "info_4",
    template_id: TEMP_4,
    template_name: "空白占位卡"
  },
  {
    key: 'info_1002',
    template_id: TEMP_1002,
    template_name: '两级卡片',
    preview: 'https://si1.go2yd.com/get-image/0kHF1sR8TvE',
  },
  {
    key: 'info_1003',
    template_id: TEMP_1003,
    template_name: '三级卡片',
    preview: 'https://si1.go2yd.com/get-image/0kHF39EoY2C',
  },
];

// 投放方
export const AdvertiserOptions = [
  { label: '视频运营组', value: 'video' },
  { label: '音频运营组', value: 'audio' },
];

// 右下标签选项
export const LabelOptions = [
  {
    key: 1,
    label: '空',
    labelColor: '#ffffff',
    hasBack: true,
    backColor: '#d7d7d7',
  },
  {
    key: 2,
    label: '音频',
    labelColor: '#ffffff',
    hasBack: true,
    backColor: '#ec808d',
  },
  {
    key: 3,
    label: '小说',
    labelColor: '#ffffff',
    hasBack: true,
    backColor: '#81d3f8',
  },
  {
    key: 4,
    label: '热点',
    labelColor: '#ffffff',
    hasBack: true,
    backColor: '#d9001b',
  },
];

// 是否选项，是否展示背景色
export const YesNoOptions = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

export const BattlePosOptions = [
  { value: 'left', label: '主场' },
  { value: 'right', label: '客场' },
];

// 子组件类型, belongs表示该类型卡片可以被哪些模版所使用
export const child_options = [
  { value: TEMP_2002, label: '竖图子卡片', belongs: [TEMP_1002, TEMP_2004] },
  { value: TEMP_2003, label: '方图子卡片', belongs: [TEMP_1002, TEMP_2004, TEMP_2005] },
  { value: TEMP_2004, label: '多专辑组合卡片', belongs: [TEMP_1003] },
  { value: TEMP_2005, label: '主题卡片', belongs: [TEMP_1003] },
  { value: TEMP_2007, label: '直播子卡', belongs: [TEMP_1002] },
  { value: TEMP_2008, label: '直播PK子卡', belongs: [TEMP_1002] },
];

export const ActionTypes = [
  { value: 'doc', label: '文章' },
  { value: 'channel', label: '频道' },
  { value: 'url', label: '网页' },
  { value: 'video', label: '视频' },
  { value: 'gallery', label: '图集' },
  { value: 'tv', label: '电视' },
  { value: 'comic', label: '漫画' },
  { value: 'joke', label: '段子' },
  { value: 'profile', label: '用户Profile' },
  { value: 'bottom_tab', label: '底栏tab' },
  { value: 'audio', label: '音频' },
  { value: 'download', label: '下载' },
  { value: 'topic', label: '专题' },
  { value: 'live_video', label: '直播' },
  { value: 'rank_list', label: '排行榜' },
  { value: 'novel', label: '小说' },
  { value: 'wemedia_center', label: '关注' },
  { value: 'jifen_center', label: '积分中心' },
  { value: 'task_center', label: '任务中心' },
  { value: 'talk', label: '话题' },
  { value: 'tv_jump_channel', label: '看电视频道' },
  { value: 'tv_station', label: '看电视单集' },
  { value: 'system', label: '系统相关' },
  { value: 'app', label: '打开应用(没有跳转商店或者相关下载)' },
  { value: 'push', label: '互动push' },
];

// 卡片状态：全部、启用、停用
export const STATUS_ALL = 0;
export const STATUS_ENABLE = 1;
export const STATUS_UNABLE = 2;

// 当前状态选项
export const StatusOptions = [
  { value: STATUS_ALL, label: '全部' },
  { value: STATUS_ENABLE, label: '启用' },
  { value: STATUS_UNABLE, label: '未启用' },
];

export const CardListColumn: ColumnType<CardList>[] = [
  {
    dataIndex: LIST_ID,
    key: LIST_ID,
    title: '卡片ID',
    width: 150,
  },
  {
    dataIndex: LIST_STATUS,
    key: LIST_STATUS,
    title: '状态',
    width: 100,
    render: value => (value ? StatusOptions.find(option => option.value === value)?.label : '--'),
  },
  {
    dataIndex: LIST_CREATER,
    key: LIST_CREATER,
    title: '创建者',
    ellipsis: true,
    width: 100,
    render: text => (text ? decodeURIComponent(text).replace('@yidian-inc.com', '') : '--'), // 只保留邮箱前缀
  },
  {
    dataIndex: LIST_UPDATER,
    key: LIST_UPDATER,
    title: '更新者',
    ellipsis: true,
    width: 100,
    render: text => (text ? decodeURIComponent(text).replace('@yidian-inc.com', '') : '--'), // 只保留邮箱前缀
  },
];

/**
 * 给定默认值，出于react-hook-form建议每个表单都具有default值，否则给出黄色warning(纯强迫症设置)
 * 另个给定默认值的考虑是：产品有默认值需求时能快速支持
 */

export const defaultChild: CardForm = {
  [FORM_ID]: null,
  [FORM_TEMP]: null,
  [FORM_TITLE]: null,

  [FORM_CONTENT]: {
    [FORM_TOPITEM]: null,
    [FORM_MAIN]: null,
    [FORM_SUB]: null,
    [FORM_COVER]: null,
    [FORM_BATTLE_TITLE]: null,
    [FORM_BATTLE_SUB]: null,
    [FORM_BATTLE_TIME]: null,
    [FORM_ITEM_ICON]: null,
    [FORM_ITEM_NAME]: null,
    [FORM_BATTLE]: [{
      [FORM_BATTLE_TEXT]: null,
      [FORM_BATTLE_POS]: null,
      [FORM_BATTLE_IMAGE]: null,
      [FORM_BATTLE_SCORE]: null,
    }, {
      [FORM_BATTLE_TEXT]: null,
      [FORM_BATTLE_POS]: null,
      [FORM_BATTLE_IMAGE]: null,
      [FORM_BATTLE_SCORE]: null,
    }],
  },

  [FORM_STYLE]: {
    [FORM_LABEL_TEXT]: null,
    [FORM_LABEL_COLOR]: null,
  },

  [FORM_ACTIONS]: {
    [FORM_ACTION]: null,
    [FORM_ACTION_PARAM]: defaultActions,
  },
};

export const defaultCards: CardForm = {
  [FORM_TEMP]: null,
  [FORM_ID]: null,
  [FORM_TITLE]: null,
  [FORM_REMARK]: null,

  [FORM_CONTENT]: {
    [FORM_SHOW_TITLE]: true,
    [FORM_TITLE]: null,
    [FORM_TOPITEM]: null,
    [FORM_COVER]: null,
    [FORM_IMAGE_WIDTH]: null,
    [FORM_IMAGE_HEIGHT]: null,
    [FORM_BUTTON_LABEL]: null,
    [FORM_LEFT_ICON]: null,
    [FORM_MAIN]: null,
    [FORM_SUB]: null,
  },

  [FORM_STYLE]: {
    [FORM_LABEL_IF]: null,
    [FORM_LABEL_BACK]: null,
    [FORM_LABEL_TEXT]: null,
    [FORM_LABEL_COLOR]: null,
  },

  [FORM_ACTIONS]: {
    [FORM_ACTION]: null,
    [FORM_MORE]: null,
    [FORM_MORE_TEXT]: null,
    [FORM_MORE_TOPITEM]: null,
    [FORM_MORE_ACTION]: null,
    [FORM_ACTION_PARAM]: defaultActions,
    [FORM_MORE_PARAM]: defaultActions,
  },

  [FORM_CHILDS]: [],
};

export const defaultScreen: FormScreen = {
  [SCREEN_ID]: null,
  [SCREEN_TITLE]: null,
  [SCREEN_TYPE]: null,
  [SCREEN_STATUS]: STATUS_ALL,
  [SCREEN_STRAT]: null,
  [SCREEN_END]: null,
};

export const cardCssList: SelectOption[] = [
  {
    value: 'normal_big',
    label: '奥运奖牌卡',
  },
  {
    value: 'secondary_content',
    label: '奥运两级内容卡片',
  },
  {
    value: "hotspot_paper_list",
    label: "一点早晚报多条两级卡片"
  },
  {
    value: 'hotspot_paper_single',
    label: '一点早晚报单条两级卡片（非定向）',
  },
];

export const childCssList: SelectOption[] = [{
  value: "hotspot_paper_detail",
  label: "早晚报详情子卡"
},{
  value: '1',
  label: "图文一图"
}, {
  value: '3',
  label: "图文三图"
}, {
  value: '22',
  label: "视频"
}]
