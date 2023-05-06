import appConfig from '@/config/app.config';
export const OPP_NEGATIVE_REASON: Array<string> = [
  '内容低俗',
  '标题重口味',
  '图片重口味',
  '带有微信推广、二维码',
  '垃圾广告、广告软文',
  '内容低质无价值，水文',
  '内容时效性差，旧闻',
  '图文不符',
  '题文不符',
  '封面图低俗',
  '标题低俗',
  '标题夸张耸动',
  '视频体验差，如尺寸拉伸、清晰度差（监控类例外）',
  '内容虚假，真实性存疑',
  '标题低质',
];

export interface KeyPair<T, U> {
  key: T;
  value: U;
  render?: (text: any, record?: any) => React.ReactNode;
}
export const TIER_OPTION: Array<KeyPair<string, string>> = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '4', value: '4' },
  { key: '5,6', value: '5-6' },
];

export const C_TYPE_OPTION: Array<KeyPair<string, string>> = [
  { key: '图文', value: '图文' },
  { key: '视频', value: '视频' },
];

export const SORT_OPTION: Array<KeyPair<string, string>> = [
  { key: 'source_tier', value: '源评级' },
  { key: 'createTime', value: '入审核池时间' },
  { key: 'createAt', value: '发布时间' },
  { key: 'cntClick', value: '点击量' },
  { key: 'cntView', value: '曝光量' },
];

export const SCORE_OPTIONS: Array<KeyPair<number, string>> = [
  {
    key: 3,
    value: '3(优质)',
  },
  {
    key: 2,
    value: '2(正常)',
  },
  {
    key: 1,
    value: '1(低质)',
  },
  {
    key: 0,
    value: '0(明确低质需删除)',
  },
];

export const HANDLE_OPTIONS: Array<KeyPair<string, string>> = [
  {
    key: 'pass',
    value: '通过',
  },
  {
    key: 'notfront',
    value: '不可上首页',
  },
  {
    key: 'hide',
    value: '不展示',
  },
  {
    key: 'notserve',
    value: '不服务',
  },
  {
    key: 'notrecommend',
    value: '不推荐',
  },
  {
    key: 'remove',
    value: '删除',
  },
];
export const CPP_SCOPE = {
  notfront: 1 << 26,
  hide: 1 << 8,
  notserve: 1 << 16,
  notrecommend: 1 << 24,
  pass: 0,
};
export const TOP_REASON_OPTIONS: string[] = ['标题吸引', '封面清晰', '有深度', '及时有效', '其他'];
export const NEG_REASON_OPTIONS: string[] = [
  '标题夸张耸动',
  '题文不符',
  '标题低俗',
  '封面图低俗',
  '内容低俗',
  '内容低质无价值，水文',
  '旧闻，过时',
  '内容虚假，真实性存疑',
  '排版混乱，可读性差',
  '视频封面图不准确、不清晰',
  '视频体验差，如尺寸拉伸、清晰度差（监控类例外）',
  '文中夹杂广告',
  '其他',
];
//  high_view
export const HIGH_VIEW_NEG_REASON: string[] = [
  '标题党',
  '内容低质量',
  '虚假消息',
  '旧闻',
  '内容低俗',
  '恶意推广',
  '封面模糊',
  '其他',
];

// fake_news
export const FAKE_OPTION = [
  {
    key: '虚假',
    value: '是',
  },
  {
    key: '无',
    value: '否',
  },
];
export const FAKE_NEWS_ORIGINAL = [
  // 来源
  { key: 'auto', value: '评论' },
  { key: 'manual', value: '手动添加' },
  { key: 'similar', value: '样本相似度比对' },
];

// 来源对应的map
const FROM_MAP = FAKE_NEWS_ORIGINAL.reduce((result: any, current: any) => {
  let { key, value } = current;
  result[key] = value;
  return result;
}, {});
// 每一篇文章审核OPTION

// doc详情显示 key value
export const DOC_DETAIL: Array<KeyPair<string, string>> = [
  {
    key: 'doc_id',
    value: 'docid',
  },
  {
    key: 'category',
    value: '大类',
  },
  {
    key: 'source',
    value: '文章源',
  },
  {
    key: 'media_id',
    value: '账号id',
  },
  {
    key: 'source_tier',
    value: '源评级',
  },
  {
    key: 'date',
    value: '发布日期',
  },
  {
    key: 'insert_time',
    value: '入审核池时间',
  },
  {
    key: 'sc_dirty',
    value: '低俗值',
    render: (text: string | number) => {
      text = text as string;
      if (text) {
        const index = text.indexOf('.');
        return text.slice(0, index + 3);
      }
      return '';
    },
  },
  {
    key: 'bait',
    value: '标题党属性',
  },
  {
    key: 'operator_email',
    value: '审核人',
  },
  {
    key: 'reviewed_time',
    value: '审核时间',
    render: (text: string, record: any) => (!record['operator_email'] ? '' : text),
  },
  {
    key: 'media_domain',
    value: '账号领域',
  },
  {
    key: 'cntView',
    value: '曝光量',
  },
  {
    key: 'ctr',
    value: '点击率',
  },
  {
    key: 'cntClick',
    value: '点击量',
  },
  {
    key: 'dwellAvg',
    value: '篇均停留时长',
  },
  {
    key: 'sc_stky',
    value: '是否编辑置顶',
    render: (text: string | number) => (text == 1 ? '置顶' : '非置顶'),
  },
  {
    key: 'from',
    value: '来源',
    render: (text: string | number) => (FROM_MAP[text] ? FROM_MAP[text] : ''),
  },
];

// page:

export const PAGE_SIZE = 20;

// 分区 分片

export const APP_ID_ALL = 'all';
export const APP_ID_HIGH_VIEW = 'high_view';
export const APP_ID_FAKE = 'fake';

// 思文提供
export const SEARCH_TOP_NEWS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/search-top-news`;
export const UPDATE_TOP_NEWS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/update-top-news`;
export const GET_SIMILAR_NEWS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/get-similar-news`;
export const UPDATE_SIMILAR_NEWS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/review-similar-news`;
export const DELETE_COMMENT = `/api/proxy/http://m.yidian-inc.com/comment/interact/delete_comment`;
export const FAKE_NEWS_STATICS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/review-statistics`;
export const ADD_FAKE_NEWS = `/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/add-fake-news`;
// 内容中台
export const UPDATE_CPP_NEWS = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/update`;
export const DELETE_CPP_NEWS = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/delete`;
export const RECOVER_CPP_NEWS = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/recover`;
export const CPP_API_KEY = 'e7d86aef18345a5a00041e4bb506f99a';
export const CPP_API_FROM = 'webui@article-spam';
// fake_news doc显示需要过滤的字段
export const FAKE_DOC_FILTER = [
  'media_id',
  'sc_dirty',
  'bait',
  'operator_email',
  'reviewed_time',
  'media_domain',
  'cntView',
  'ctr',
  'cntClick',
  'dwellAvg',
  'sc_stky',
];
export const ARTICLE_BASE_URL = 'https://www.yidianzixun.com/article';

const lowOpReason = [
  '标题夸张耸动',
  '题文不符',
  '标题低俗',
  '标题低质',
  '封面图低俗',
  '封面图低质',
  '封面图模糊',
  '内容低俗',
  '内容低质无价值、水文',
  '旧闻，过时',
  '内容虚假，真实性存疑',
  '排版混乱，可读性差',
  '文中夹杂广告',
  '画面模糊',
  '画面倾斜',
  '画面拉伸',
  '恶意缩放',
  '恶意变声',
  '恶意添加滤镜',
  '恶意添加边框',
  '黑屏/花屏',
  '水印夸张',
  '音画不同步',
  '画面卡顿',
  '公司负面',
  '商业要求',
  '违法信息',
  '重口味',
  '其他',
];
export const REVIEWPANEL = {
  operationalGroup: [
    {
      label: '通过',
      value: 'pass',
    },
    {
      label: '不可上首页',
      value: 'low',
    },
    {
      label: '下沉',
      value: 'deep',
    },
    {
      label: '删除',
      value: 'removed',
    },
  ],
  reviewReason: {
    pass: {
      levelOne: ['影响力', '丰富性', '实用性', '趣味性'],
      levelTwo: [
        {
          label: '新闻',
          value: 'news',
        },
        {
          label: '专业',
          value: 'profession',
        },
        {
          label: '休闲/泛内容',
          value: 'leisure',
        },
        {
          label: '文学作品',
          value: 'fiction',
        },
      ],
    },
    low: {
      levelOne: ['内容劲爆', '标题吸睛', '口味偏重', '内容鸡肋', '夹杂广告', '竞品引流', '其他'],
    },
    deep: {
      levelOne: lowOpReason,
    },
    removed: {
      levelOne: lowOpReason,
    },
  },
};
