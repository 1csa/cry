import Base from 'antd/lib/typography/Base';
import { aging } from './constants';

// 文章属性
export const articleAttr = [
  {
    label: '新闻',
    value: 'news',
  },
  {
    label: '专业',
    value: 'professional',
  },
  {
    label: '休闲/泛娱乐',
    value: 'leisure_entertainment',
  },
  {
    label: '文学作品',
    value: 'literary_works',
  },
];

// 时效性 文章非低质
export { aging };
// export const aging = [
//   {
//     label: '1天',
//     value: '1d',
//   },
//   {
//     label: '3天',
//     value: '3d',
//   },
//   {
//     label: '5天',
//     value: '5d',
//   },
//   {
//     label: '30天',
//     value: '30d',
//   },
//   {
//     label: '90天',
//     value: '90d',
//   },
//   {
//     label: '180天',
//     value: '180d',
//   },
//   {
//     label: '无时效',
//     value: 'nt',
//   },
// ];

// 非低质
export const highQuality = [
  // {
  //   label: '影响力',
  //   value: 'influence',
  // },
  // {
  //   label: '丰富性',
  //   value: 'richness',
  // },
  // {
  //   label: '实用性',
  //   value: 'practicality',
  // },
  // {
  //   label: '趣味性',
  //   value: 'fun',
  // },
];

// 轻度
export const lightList = (isVideo: boolean) => {
  const base = [
    {
      label: '内容劲爆',
      value: 'hot_content',
    },
    {
      label: '标题吸睛',
      value: 'eye_catching_title',
    },
    {
      label: '口味偏重',
      value: 'slightly_heavy_taste',
    },
    {
      label: '内容鸡肋',
      value: 'content_tasteless',
    },
    {
      label: '软文推广',
      value: 'ads_content_soft',
    },
    {
      label: '竞品引流',
      value: 'competitive_product_drainage',
    },
  ];
  const videoData = [
    {
      label: '简介错误',
      value: 'introduction_error',
    },
  ];
  if (isVideo) {
    return [...base, ...videoData];
  } else {
    return base;
  }
};
// 重度
export const moderate = [
  {
    label: '时政敏感',
    value: 'sensitive_politic_affairs',
  },
  {
    label: '虚假内容',
    value: 'fake_content',
  },
  {
    label: '血腥暴力',
    value: 'violent_porn_obscene_content',
  },
  {
    label: '淫秽色情',
    value: 'pornographic',
  },
  {
    label: '违法信息',
    value: 'illegal_information',
  },
  {
    label: '旧闻内容',
    value: 'old_news',
  },
  {
    label: '公司负面',
    value: 'company_negative_news',
  },
  {
    label: '恶意推广',
    value: 'malicious_promotion',
  },
  {
    label: '标题耸动',
    value: 'headline_sensation',
  },
  {
    label: '无效链接',
    value: 'invalid_link',
  },
];

// 中度
export const severeList = [
  {
    label: '标题夸张',
    value: 'headline_exaggeration',
  },
  {
    label: '题文不符',
    value: 'title_irrelevant',
  },
  {
    label: '标题低俗',
    value: 'vulgar_title',
  },
  {
    label: '标题低质',
    value: 'low_quality_title',
  },
  {
    label: '封面低俗',
    value: 'vulgar_cover',
  },
  {
    label: '封面低质',
    value: 'low_quality_cover',
  },
  {
    label: '封面模糊',
    value: 'blurred_cover',
  },
  {
    label: '内容低俗',
    value: 'vulgar_content',
  },
  {
    label: '内容低质',
    value: 'low_quality_worthless_content',
  },
  {
    label: '排版混乱',
    value: 'confusing_typography_poor_readability',
  },
  {
    label: '硬广推广',
    value: 'ads_content_hard',
  },
  {
    label: '画面模糊',
    value: 'blurred_screen',
  },
  {
    label: '画面变形',
    value: 'deformed_screen',
  },
  {
    label: '恶意滤镜',
    value: 'malicious_addition_filters',
  },
  {
    label: '恶意边框',
    value: 'malicious_borders',
  },
  {
    label: '水印夸张',
    value: 'watermark_exaggeration',
  },
  {
    label: '音画异常',
    value: 'audio_video_out_abnormal',
  },
  {
    label: '商业要求',
    value: 'business_requirements',
  },
  {
    label: '重口味',
    value: 'heavy_taste',
  },
  {
    label: '过时内容',
    value: 'obsolete',
  },
  {
    label: '指令要求',
    value: 'directive_requirements',
  },
];

export const QUALITYPANEL = [
  {
    label: '非低质',
    value: 'highQuality',
  },
  {
    label: '轻度',
    value: 'light',
  },
  {
    label: '中度',
    value: 'severe',
  },
  {
    label: '重度',
    value: 'moderate',
  },
];

export const QUALITYPANELCHECKBOX = (isVideo: boolean) => {
  const mapData: Map<string, typeof QUALITYPANEL> = new Map([
    ['highQuality', highQuality],
    ['light', lightList(isVideo)],
    ['severe', severeList],
    ['moderate', moderate],
  ]);
  return mapData;
};

export const ARTICLEATTRS = { highQuality: aging };

export const qualityScore = [
  {
    label: '0',
    value: 0,
  },
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5',
    value: 5,
  },
];

export const allQualityLabels = [
  ...(QUALITYPANELCHECKBOX(false)?.get('highQuality') || []),
  ...(QUALITYPANELCHECKBOX(true)?.get('light') || []),
  ...(QUALITYPANELCHECKBOX(false)?.get('severe') || []),
  ...(QUALITYPANELCHECKBOX(false)?.get('moderate') || []),
];
//全部的质检列表
export const allList =[...moderate,...severeList,
  {
      label: '简介错误',
      value: 'introduction_error',
    },
    {
      label: '内容劲爆',
      value: 'hot_content',
    },
    {
      label: '标题吸睛',
      value: 'eye_catching_title',
    },
    {
      label: '口味偏重',
      value: 'slightly_heavy_taste',
    },
    {
      label: '内容鸡肋',
      value: 'content_tasteless',
    },
    {
      label: '软文推广',
      value: 'ads_content_soft',
    },
    {
      label: '竞品引流',
      value: 'competitive_product_drainage',
    },]
