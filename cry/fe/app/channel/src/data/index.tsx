export const tagMap = {
  personalize: '推荐',
  weibo_pop: '热门',
  focus: '焦点',
  live: '直播',
  breaking: '快讯',
  headline: '独家',
  topic: '专题',
  slides: '图集',
  gif: '动图',
  clue: '答题线索',
  refute: '辟谣',
  positive: '正能量',
  authority: '权威发布',
  yd_produce: '一点出品',
};

export const authMap = {
  137: '要闻',
  135: '首页置顶',
  136: '推广专用',
  198: 'Manual',
  199: 'Lifespan',
  214: '十九大',
  246: '早晚报push',
  272: '要闻指令',
};

export const blockAppIdMap = {
  hwbrowser: '华为浏览器',
  vivobrowser: 'vivo浏览器',
  oppobrowser: 'OPPO浏览器',
  mibrowser: '小米浏览器',
  s3rd_mzbrowser: '魅族新闻资讯',
  s3rd_op583: '魅族浏览器',
  s3rd_op396: '金立浏览器',
  s3rd_op397: 'Nubia浏览器',
};

// export const levelMap = {
//   eventL1: '一级',
//   eventL2: '二级',
//   eventL3: '三级'
// }

export const hotEventLevelMap = {
  eventL1: '一级',
  eventL2: '二级',
  eventL3: '三级',
  // eventL4: '四级',
};

export const hotEventLocationMap = {
  first: '首屏',
  other: '非首屏',
};

export const docListCheckBoxEnum = [
  { label: '图集', value: 'imageCollection' },
  { label: '自媒体', value: 'wemedia' },
  { label: '要闻', value: 'focusNews' },
  { label: '视频', value: 'videoNews' },
  { label: '图文', value: 'picdoc' },
  { label: '小视频', value: 'videoMicro' },
  { label: '短内容', value: 'duanneirong' },
];

export const wemediaRankCheckBoxEnum = [
  { label: '2级', value: 'wemedia_rank_2' },
  { label: '3级', value: 'wemedia_rank_3' },
  { label: '4级', value: 'wemedia_rank_4' },
  { label: '5级', value: 'wemedia_rank_5' },
  { label: '6级', value: 'wemedia_rank_6' },
];

export const docListSortEnum = [
  { value: 'default', label: '默认排序' },
  { value: 'date', label: '按时间排' },
  { value: 'click-rate', label: '按点击率排序' },
  { value: 'share-cnt', label: '按分享数排序' },
  { value: 'comments-cnt', label: '按评论数排序' },
  { value: 'doc-score', label: '按综合评分排序' },
];

export const dateEnum = [
  { label: '最近一天', value: '1' },
  { label: '最近二天', value: '2' },
  { label: '最近三天', value: '3' },
  { label: '最近一周', value: '7' },
  { label: '最近一月', value: '30' },
  { label: '最近三月', value: '90' },
  { label: '最近半年', value: '180' },
  { label: '最近一年', value: '360' },
  { label: '最近两年', value: '720' },
];
