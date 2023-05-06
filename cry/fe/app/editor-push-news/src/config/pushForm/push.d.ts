declare enum PushTypeEnum {
  userid,
  auto,
  auto_add,
  auto_break,
  all,
  all_break,
  appids,
  auto_active,
  all_light
}

export interface TestType {
  docid: string;
  title: string;
  summary: string;
}

export interface SectionType {
  [key: string]: TestType
}

// push basic form
export interface PushBasicFormProps {
  rstype: string // 类型
  docid: string // docid
  doc_id: string // 和docid一样 只是在一些接口场景用这个。。。
  ignoreTitleLimit: boolean // 去除标题字数限制
  title: string // 标题
  summary: string // 摘要
  img: string | undefined // 配图
  xiaomi_img_url: string | undefined // 小米配图
  oppo_push_notification_img_url: string | undefined // oppo 通知栏配图
  xiaomi_priority: '0' | '1' // 小米是否高优推送 1 高优 0 不高优
  oppo_pay: '0' | '1' // oppo付费推送 1 是 0 不
  // explosiveDoc: boolean // 领域突发爆文
  sound: '0' | '1' // 声音  0 关闭 1 开启
  bonus: '0' | '1' // 带激励的 push 0 不带 1 带
  group: 'group1' | 'group2' | 'group3' | undefined // 后续需要修改为string
  section?: SectionType // 分段式内容字段
  open_sectional?: boolean // 是否开启分段式分发

  tv_action_params: TvActionParams
  comic_action_params: ComicActionParams
  bottom_tab_action_params: BottomTabActionParams
  audio_action_params: AudioActionParams
  rank_list_action_params: RankListActionParams
  novel_action_params: NovelActionParams
  channel_card_action_params: ChannelCardActionParams
  talk_action_params: TalkActionParams
  local_topic_action_params: LocalTopicActionParams
  tv_station_action_params: TvStationActionParams
  tv_jump_channel_action_params: TvJumpChannelActionParams
}

// push launch form
export interface PushLaunchFormProps {
  pushType: 'userids' | 'auto' | 'auto_add' | 'auto_break' | 'all' | 'all_break' | 'appids' | 'auto_active' | 'all_light' // 推送类别 采用联合类型去替代枚举 总感觉我枚举用的不太对
  userids?: string
  retrieve_strategy: string | undefined // 热点脉络推送方式
  veins_docids?: string | undefined // 热点脉络文章
  cate: string | undefined // 分类
  fresh_user_expire_time?: number | undefined // 首日新用户时效性
  expireTime: string // 过期时间
  deliver_scope?: string // 分发范围
  user_layer_channel: Array<string> | undefined // 用户层级
  tags: Array<string> | undefined // tags
  excludeTags: Array<string> | undefined // 排除 tags
  delay_push: '0' | '1' // 定时推送
  delay_push_time?: string // 定时推送时间
}

// push app form
export interface PushAppFormProps {
  platform: Array<string> | undefined // platform
  sync_platform: Array<string> | undefined // sync_platform
  // mobilePhone: string | undefined // 手机型号
  inVersion: string | undefined // 最小 api 版本
  exVersion: string | undefined // 排除 api 版本
  inClientVersion: string | undefined // 包含客户端版本
  exClientVersion: string | undefined // 排除客户端版本
  appid: Array<string> | undefined // 包含 appid
  exappid: Array<string> | undefined // 排除 appid
  // appGroup: string | undefined // appGroup
  ad_code: string | undefined //冠名推送
  quota_code: string | undefined //配额
  quota_bizcode: string | undefined //区分业务
}

// push 大表单
export interface PushFormProps extends PushBasicFormProps, PushLaunchFormProps, PushAppFormProps {
  key: string // push key
  showBubble: '1' // ?不知道干嘛的
  user: string, // 根据 pushType 来的
  action_parameter: TvActionParams | ComicActionParams | BottomTabActionParams | AudioActionParams |
    RankListActionParams | NovelActionParams | ChannelCardActionParams | TalkActionParams | LocalTopicActionParams |
    TvStationActionParams | TvJumpChannelActionParams | undefined // 垂类推送额外参数
}

export type TagProps = {
  fromId: string
  name: string
  checked?: boolean
}

// 用户 相关
export type EditorInfoProps = {
  channels: {
    [key: string]: string
  }
  exclude_channels: {
    [key: string]: string
  }
  permission: Array<string>
  push_key: string,
  format_channels: Array<TagProps>
  format_exclude_channels: Array<TagProps>
}

// 复检 相关
export type DuplicateCheckProps = {
  doc_id: string
  push_id: string
  userids: string
  push_type: string
  push_type_value: string
  create_time: string
  reason: string
  description: string
  include_channels: Array<ChannelProps | undefined>
  exclude_channels: Array<ChannelProps | undefined>
  title: string
  operator: string
  [key: string]: any
}

type ChannelProps = {
  channelId: string
  info: {
    topicName: string
    [key: string]: string
  }
}

export type TvActionParams = {
  tv_pre_type: string
  tv_pre_value: string
  tv_pre_channelid?: string
  tv_ing_type: string
  tv_ing_value: string
  tv_ing_channelid?: string
  tv_finish_type: string
  tv_finish_value: string
  tv_finish_channelid?: string
  tv_time_start: string
  tv_time_end: string
}

export type ComicActionParams = {
  docid: string
  isDefaultSetToCatalog: boolean
}

export type BottomTabActionParams = {
  tab: string
  from_id: string
}

export type AudioActionParams = {
  docid: string
  albumid: string
  trackid: string
  orderNo: number
}

export type RankListActionParams = {
  type: string
  rank_type: string
  rank_list_id?: string
}

export type NovelActionParams = {
  docid: string
}

export type ChannelCardActionParams = {
  from_id: string
  doc_id: string
  group_from_id: 'g181'
  force_to_home: boolean
}

export type TalkActionParams = {
  talk_id: string
}

export type LocalTopicActionParams = {
  talk_id: string
}

export type TvStationActionParams = {
  tv_type: string
  action_type: string
  open_value: string
}

export type TvJumpChannelActionParams = {
  open_type: string
  category_id: string
  open_value: string
}
