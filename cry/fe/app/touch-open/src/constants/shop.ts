export const STAFF_ROLE_OPTIONS = [
  {
    label: '员工',
    value: 2,
  },
  {
    label: '管理员',
    value: 1,
  },
];

export const staffRoleFilter = (value: number) => {
  return STAFF_ROLE_OPTIONS.find(item => item.value === value)?.label;
};

export const STAFF_STATUS_OPTIONS = [
  {
    label: '在职',
    value: 1,
  },
  {
    label: '离职',
    value: 2,
  },
];

export const staffStatusFilter = (value: number) => {
  return STAFF_STATUS_OPTIONS.find(item => item.value === value)?.label;
};

export const SHOP_STATUS_OPTIONS = [
  {
    label: '启用',
    value: 2,
  },
  {
    label: '停用',
    value: 1,
  },
];

export const shopStatusFilter = (value: number) => {
  return SHOP_STATUS_OPTIONS.find(item => item.value === value)?.label;
};

export const FITTINGROOM_STATUS_OPTIONS = [
  {
    label: '停用',
    value: 0,
  },
  {
    label: '锁定',
    value: 1,
  },
  {
    label: '正常',
    value: 2,
  },
];

export const fittingRoomStatusFilter = (value: number) => {
  return FITTINGROOM_STATUS_OPTIONS.find(item => item.value === value)?.label;
};

export const FITTINGROOM_TYPE_OPTIONS = [
  {
    label: '线上',
    value: 1,
  },
  {
    label: '线下',
    value: 2,
  },
];

export const fittingRoomTypeFilter = (value: number) => {
  return FITTINGROOM_TYPE_OPTIONS.find(item => item.value === value)?.label;
};

export const STATISTIC_TYPE_OPTIONS = [
  {
    label: '预约',
    value: 1,
  },
  {
    label: '试穿',
    value: 2,
  },
  {
    label: '量体',
    value: 3,
  },
];

export const USER_TYPE_OPTIONS = [
  {
    label: '新用户',
    value: 1,
  },
  {
    label: '老用户',
    value: 2,
  },
  {
    label: '大客户',
    value: 3,
  },
  {
    label: '会员',
    value: 4,
  },
];

export const userTypeFilter = (value: number) => {
  return USER_TYPE_OPTIONS.find(item => item.value === value)?.label;
};
