export const OUT_STATUS_OPTIONS = [
  {
    label: '待出库',
    value: '0'
  },
  {
    label: '已完成',
    value: '1'
  },
  {
    label: '已关闭',
    value: '2'
  },
]

export const outStatusFilter = (value:string) => {
  return OUT_STATUS_OPTIONS.find((item) => item.value === value)?.label
}

export const REPORT_REASON_OPTIONS = [
  {
    value: '商标撕毁',
    label: '商标撕毁',
  },
  {
    value: '开线',
    label: '开线',
  },
  {
    value: '部件损坏/丢失',
    label: '部件损坏/丢失',
  },
  {
    value: '脏渍',
    label: '脏渍',
  },
  {
    value: '自定义',
    label: '自定义',
  },
]

export const DEFECT_STATUS_OPTIONS = [
  {
    value: '10',
    label: '待处理',
  },
  {
    value: '11',
    label: '次品',
  },
  {
    value: '12',
    label: '返还',
  }
];

export const defectStatusFilter = (value:string) => {
  return DEFECT_STATUS_OPTIONS.find((item) => item.value === value)?.label
}