// 数美 图片 审核
const AntiFrandResult = {
  PASS: {
    needTips: false,
    // label: '正常内容，建议直接放行',
  },
  REVIEW: {
    needTips: true,
    // label: '可疑内容，建议人工审核',
  },
  REJECT: {
    needTips: true,
    // label: '违规内容，建议直接拦截',
  },
};

// 图片-数美审核接口返回 Item 结果
export type antiFrandResultItemType = {
  imageUrl: string;
  riskLevel: string | number;
  detail: {
    description: string;
    [key: string]: any;
  };
  [key: string]: any;
};

// 图片-数美审核结果
export type imgAntiFrandResultType = {
  needTips: boolean;
  tips: string;
};

// 图片-数美审核接口返回 Item default
const antiFrandResultDefault = {
  riskLevel: 'PASS',
  detail: { description: '' },
};

/**
 * 数美图片审核结果 审核 PASS | REVIEW | REJECT 目前只在 图文 | 视频 中被使用
 * @param imageUrl
 * @param antiFrandResult
 * @returns { imgAntiFrandResultType }
 */
export function imgAntiFrandResult(imageUrl: string, antiFrandResult?: Array<antiFrandResultItemType>): imgAntiFrandResultType {
  if (!Array.isArray(antiFrandResult) || antiFrandResult.length === 0) {
    return {
      needTips: false,
      tips: '',
    };
  }

  const {
    riskLevel,
    detail: { description },
  } = antiFrandResult.find((item: any) => item.imageUrl === imageUrl) ?? antiFrandResultDefault;

  return {
    needTips: AntiFrandResult[riskLevel]?.needTips ?? false,
    tips: description,
  };
}
