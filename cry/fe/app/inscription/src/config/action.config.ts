export const FORM_DOCID = 'docid'; // Docid
export const FORM_ISTRANSIT = 'is_transit'; // 是否承接页
export const FORM_NEWTRANSIT = 'new_transit'; // 是否新承接
export const FORM_FROMID = 'from_id'; // fromid
export const FORM_CREATE = 'create'; // 是否强制订阅频道
export const FORM_URL = 'url'; // url
export const FORM_DISPLAYMODE = 'display_mode'; // 视频详情页打开方式
export const FORM_TVPRETYPETVPRETYPE = 'tv_pre_type'; // 电视播放预告跳转类型
export const FORM_TVPREVALUE = 'tv_pre_value'; // 电视播放预告跳转值
export const FORM_TVPRECHANNEL = 'tv_pre_channelid'; // 电视预告跳转频道
export const FORM_TVPRETYPETVINGTYPE = 'tv_ing_type'; // 电视播放中跳转类型
export const FORM_TVINGVALUE = 'tv_ing_value'; // 电视播放中跳转值
export const FORM_TVINGCHANNEL = 'tv_ing_channelid'; // 电视播放中频道
export const FORM_TVPRETYPETVFINISHTYPE = 'tv_finish_type'; // 电视播放结束跳转类型
export const FORM_TVFINISHVALUE = 'tv_finish_value'; // 电视播放结束跳转值
export const FORM_TVFINISHCHANNEL = 'tv_finish_channelid'; // 电视播放结束跳转频道
export const FORM_TVTIMESTART = 'tv_time_start'; // 电视开始时间
export const FORM_TVTIMEEND = 'tv_time_end'; // 电视结束时间
export const FORM_SETTODEFAULTCATA = 'isDefaultSetToCatalog'; // 漫画：是否默认定位到目录
export const FORM_PROFILEID = 'profile_id'; // 用户主页: ProfileId
export const FORM_TAB = 'tab'; // 用户主页&底栏Tab: 默认跳转tab
export const FORM_ALBUMID = 'albumid'; // 音频: 专辑ID
export const FORM_PLAYINALBUM = 'play_in_album'; // 音频: 是否定位播放
export const FORM_TRACKID = 'trackid'; // 音频: 节目ID
export const FORM_ORDERNO = 'orderNode'; // 音频: 节目位置
export const FORM_AUTOPLAY = 'auto_play'; // 音频: 是否自动播放
export const FORM_TVPRETYPEINSTALL = 'install'; // 下载: 默认安装
export const FORM_TYPE = 'type'; // 排行榜: 类型
export const FORM_RANKTYPE = 'rank_type'; // 排行榜: 榜单类型
export const FORM_RANKID = 'rank_list_id'; // 排行榜: 榜单ID
export const FORM_TALKID = 'talk_id'; // 话题: docid
export const FORM_TVPRETYPETVTYPE = 'tv_type'; // 看电视单集: 分类
export const FORM_ACTIONTYPE = 'action_type'; // 看电视单集: 打开方式
export const FORM_OPENVALUE = 'open_value'; // 看电视单集 & 看电视频道: 单条参数
export const FORM_OPENTYPE = 'open_type'; // 看电视频道: 打开方式
export const FORM_CATEGORY = 'category_id'; // 看电视频道: 目录ID
export const FORM_SCHEME = 'scheme'; // 打开应用: scheme
export const FORM_APPID = 'appid'; // 打开应用: appid
export const FORM_TITLE = 'title'; // 互动push: 标题
export const FORM_SUMMARY = 'summary'; // 互动push: 摘要

// 是否选项
export const YesNoOptions = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

// 视频详情页打开方式
export const DisplayModeOptions = [
  { value: 'detailpage', label: '正文页' },
  { value: 'full_screen_immersive', label: '小视频' },
  { value: 'immersive', label: '沉浸式播放' },
];

// 电视节目预告跳转类型
export const TvPreTypeOptions = [
  { value: 'url', label: '链接' },
  { value: 'docid', label: '图文' },
  { value: 'channel', label: '频道' },
  { value: 'tvchannel', label: '电视频道' },
  { value: 'category', label: '目录' },
  { value: 'movie', label: '电影' },
];

// 用户主页: 默认跳转tab
export const DefaultTabOptions = [
  { value: 'main', label: '主页' },
  { value: 'Dynamic', label: '动态' },
  { value: 'Video', label: '视频' },
  { value: 'Matrix', label: '矩阵' },
  { value: 'Aggregate', label: '聚焦' },
  { value: 'Vine', label: '小视频' },
];

// 底栏Tab选项
export const BottomTabOptions = [
  { value: 'shouye', label: '首页' },
  { value: 'shipin', label: '视频' },
  { value: 'wode', label: '我的' },
  { value: 'xiaoshipin', label: '小视频' },
  { value: 'diantai', label: '电台' },
  { value: 'novel', label: '小说' },
  { value: 'tv', label: '看电视' },
];

// 排行榜：榜单大类
export const RankCateOptions = [
  { value: 'comic', label: '漫画' },
  { value: 'ximaFM', label: '电台' },
];

// 排行榜：榜单类型
export const RankComicOptions = [
  { value: 'comic_rank_popularity', label: '人气榜' },
  { value: 'comic_rank_potentiality', label: '潜力榜' },
];

// 排行榜：榜单类型
export const RankFMOptions = [
  { value: 'fm_rank_free', label: '免费榜' },
  { value: 'fm_rank_paid', label: '收费榜' },
];

// 看电视单集: 分类
export const TvStationTypeOptions = [
  { value: 'live', label: '电视直播' },
  { value: 'video', label: '长视频' },
];

// 看电视单集: 打开方式
export const TvStationActionOptions = [
  { value: 'h5', label: 'h5' },
  { value: 'native', label: 'native' },
];

// 看电视频道：打开方式
export const TvChannelOpenOptions = [
  { value: 0, label: '底栏Tab打开' },
  { value: 1, label: '订阅频道打开' },
  { value: 2, label: '频道预览页打开' },
];

export const defaultActions: Record<string, any> = {
  [FORM_APPID]: null,
  [FORM_SCHEME]: null,
  [FORM_DOCID]: null,
  [FORM_ALBUMID]: null,
  [FORM_PLAYINALBUM]: null,
  [FORM_TRACKID]: null,
  [FORM_ORDERNO]: null,
  [FORM_ISTRANSIT]: null,
  [FORM_AUTOPLAY]: null,
  [FORM_FROMID]: null,
  [FORM_TAB]: null,
  [FORM_SETTODEFAULTCATA]: null,
  [FORM_NEWTRANSIT]: null,
  [FORM_URL]: null,
  [FORM_TVPRETYPEINSTALL]: null,
  [FORM_PROFILEID]: null,
  [FORM_TYPE]: null,
  [FORM_RANKTYPE]: null,
  [FORM_RANKID]: null,
  [FORM_TALKID]: null,
  [FORM_TVPRETYPETVPRETYPE]: null,
  [FORM_OPENTYPE]: null,
  [FORM_CATEGORY]: null,
  [FORM_OPENVALUE]: null,
  [FORM_TVPRETYPETVTYPE]: null,
  [FORM_ACTIONTYPE]: null,
  [FORM_DISPLAYMODE]: null,
  [FORM_TITLE]: null,
  [FORM_SUMMARY]: null,
};
