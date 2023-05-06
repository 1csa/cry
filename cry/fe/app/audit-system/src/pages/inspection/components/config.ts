// flag passAndReject-通过/拒绝 | score-0/1/2/3分
export type Flag = 'passAndReject' | 'score';
export const FlagPassAndReject: Flag = 'passAndReject';
export const FlagScore: Flag = 'score';

// 抽检子业务 options flag-通过拒绝|分数
export const BusinessTypeOptions: any = [
  { label: '图文曝光', value: 100301, flag: FlagPassAndReject },
  { label: '短视频曝光', value: 100701, flag: FlagPassAndReject },
  { label: '图文全端召回', value: 1414103, flag: FlagScore },
  { label: '图文主端召回', value: 1414102, flag: FlagScore },
  { label: '图文高曝光召回', value: 1414101, flag: FlagScore },

  { label: '图文OPPO召回', value: 1414106, flag: FlagScore },
  { label: '图文VIVO召回', value: 1414107, flag: FlagScore },
  { label: '视频全端召回', value: 1414203, flag: FlagScore },
  { label: '视频主端召回', value: 1414202, flag: FlagScore },
  { label: '视频高曝光召回', value: 1414201, flag: FlagScore },

  { label: '视频OPPO召回', value: 1414206, flag: FlagScore },
  { label: '视频VIVO召回', value: 1414207, flag: FlagScore },

  // http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=86857709
  { label: '图文用户申诉质检', value: 100302, flag: FlagPassAndReject },
  { label: 'UGC图文曝光质检', value: 1010201, flag: FlagPassAndReject },
  { label: '短图文曝光质检', value: 101001, flag: FlagPassAndReject },
  { label: '图文负反馈质检', value: 1003, flag: FlagPassAndReject },
  { label: 'B端图文负反馈质检', value: 1010202, flag: FlagPassAndReject },

  { label: 'UGC视频曝光质检', value: 1010301, flag: FlagPassAndReject },
  { label: '短视频用户申诉质检', value: 100702, flag: FlagPassAndReject },
  { label: 'B端视频负反馈质检', value: 1010302, flag: FlagPassAndReject },
  { label: '短视频负反馈质检', value: 1007, flag: FlagPassAndReject },

  { label: '图文B端评论召回质检', value: 1414104, flag: FlagScore },
  { label: '视频B端评论召回质检', value: 1414204, flag: FlagScore },

  { label: '图文VIVO离线质量召回', value: 1414109, flag: FlagScore },
  { label: '视频VIVO离线质量召回', value: 1414209, flag: FlagScore },
  { label: '图文VIVO评论质量召回', value: 1414110, flag: FlagScore },
  { label: '视频VIVO评论质量召回', value: 1414210, flag: FlagScore },
  { label: '图文主端评论质量召回', value: 1414111, flag: FlagScore },
  { label: '视频主端评论质量召回', value: 1414211, flag: FlagScore },

  // BUSINESS_UNIT_ID_MAP.put(1414109, 7017115);  // 图文VIVO离线质量召回
  // BUSINESS_UNIT_ID_MAP.put(1414209, 7017116);  // 视频VIVO离线质量召回
  // BUSINESS_UNIT_ID_MAP.put(1414110, 7017117);  // 图文VIVO评论质量召回
  // BUSINESS_UNIT_ID_MAP.put(1414210, 7017118);  // 视频VIVO评论质量召回
  // BUSINESS_UNIT_ID_MAP.put(1414111, 7017119);  // 图文主端评论质量召回
  // BUSINESS_UNIT_ID_MAP.put(1414211, 7017120);  // 视频主端评论质量召回
];

/**
const BusinessTypeOptionsXxx = [
  {
    label: '图文安审',
    options: [
      { label: '图文曝光', value: 100301, flag: FlagPassAndReject },
      { label: '图文用户申诉质检', value: 100302, flag: FlagPassAndReject },
      { label: 'UGC图文曝光质检', value: 1010201, flag: FlagPassAndReject },
      { label: '短图文曝光质检', value: 101001, flag: FlagPassAndReject },
      { label: '图文负反馈质检', value: 1003, flag: FlagPassAndReject },
      { label: 'B端图文负反馈质检', value: 1010202, flag: FlagPassAndReject },
    ],
  },
  {
    label: '视频安审',
    options: [
      { label: '短视频曝光', value: 100701, flag: FlagPassAndReject },
      { label: 'UGC视频曝光质检', value: 1010301, flag: FlagPassAndReject },
      { label: '短视频用户申诉质检', value: 100702, flag: FlagPassAndReject },
      { label: 'B端视频负反馈质检', value: 1010302, flag: FlagPassAndReject },
      { label: '短视频负反馈质检', value: 1007, flag: FlagPassAndReject },
    ],
  },
  {
    label: '图文质量标注',
    options: [
      { label: '图文全端召回', value: 1414103, flag: FlagScore },
      { label: '图文主端召回', value: 1414102, flag: FlagScore },
      { label: '图文高曝光召回', value: 1414101, flag: FlagScore },
      { label: '图文oppo召回', value: 1414106, flag: FlagScore },
      { label: '图文vivo召回', value: 1414107, flag: FlagScore },
      { label: '图文评论召回质检', value: 1414104, flag: FlagScore },
    ],
  },
  {
    label: '视频质量标注',
    options: [
      { label: '视频全端召回', value: 1414203, flag: FlagScore },
      { label: '视频主端召回', value: 1414202, flag: FlagScore },
      { label: '视频高曝光召回', value: 1414201, flag: FlagScore },
      { label: '视频oppo召回', value: 1414206, flag: FlagScore },
      { label: '视频vivo召回', value: 1414207, flag: FlagScore },
      { label: '视频评论召回质检', value: 1414204, flag: FlagScore },
    ],
  },
];
 */

// form 默认选中 抽检方式
export const defaultType = 'ratio';

// form 抽检方式 options
export const TypeOptions = [
  { label: '按比例', value: 'ratio' },
  { label: '按条数', value: 'amount' },
];

// 质检业务 视频
export const inspectionVideo = [
  7017102, // 短视频曝光质检
  7017108, // 视频高曝光召回质检
  7017109, // 视频主端召回质检
  7017110, // 视频全端召回质检
  7017111, // 视频OPPO召回质检
  7017112, // 视频VIVO召回质检
  7017114, // 视频评论召回质检
  7017171, // UGC视频曝光质检
  7017172, // 短视频用户申诉质检
  7017173, // B端视频负反馈质检
  7017174, // 短视频负反馈质检

  7017116, // 视频VIVO离线质量召回
  7017118, // 视频VIVO评论质量召回
  7017120, // 视频主端评论质量召回
];

export const inspectionArticleQualityBusinessUnitId = [
  7017103, // 图文高曝光召回质检
  7017113, // 图文评论召回质检
  7017107, // 图文VIVO召回质检
  7017106, // 图文OPPO召回质检
  7017105, // 图文全端召回质检
  7017104, // 图文主端召回质检

  7017115, // 图文VIVO离线质量召回
  7017117, // 图文VIVO评论质量召回
  7017119, // 图文主端评论质量召回
];
