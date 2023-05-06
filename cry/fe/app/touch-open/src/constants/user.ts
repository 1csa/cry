export const CARRIAGE_OPTIONS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '未选择',
    value: 0,
  },
  {
    label: '梨型',
    value: 1,
  },
  {
    label: '沙漏型',
    value: 2,
  },
  {
    label: '苹果型',
    value: 3,
  },
  {
    label: 'H型',
    value: 4,
  },
];

export const carriageFilter = (value: string): string => {
  return CARRIAGE_OPTIONS.find((item) => item.value === value)?.label || '';
};

export const SKIN_COLOUR_OPTIONS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '未选择',
    value: 0,
  },
  {
    label: '暖调白皙',
    value: 1,
  },
  {
    label: '暖调自然',
    value: 2,
  },
  {
    label: '冷调白皙',
    value: 3,
  },
  {
    label: '冷调自然',
    value: 4,
  },
  {
    label: '中性肤色',
    value: 5,
  },
];

export const skinColourFilter = (value: string): string => {
  return SKIN_COLOUR_OPTIONS.find((item) => item.value === value)?.label || '';
};

export const USER_TYPE_OPTIONS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '会员（付费会员）',
    value: 1,
  },
  {
    label: '赠送会员（活动赠送会员）',
    value: 2,
  },
  {
    label: '非会员',
    value: 3,
  },
];

export const userTypeFilter = (value: string): string => {
  return USER_TYPE_OPTIONS.find((item) => item.value === value)?.label || '';
};
