export const ORDER_STATUS_OPTIONS = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '已下单',
    value: '0'
  },
  {
    label: '待发货',
    value: '310'
  },
  {
    label: '已发货',
    value: '320'
  },
  {
    label: '已完成',
    value: '900'
  },
  {
    label: '已取消',
    value: '410'
  }
]

export const orderStatusFilter = (value: string): string => {
  return ORDER_STATUS_OPTIONS.find((item) => item.value === value)?.label || ''
}

export const DELIVERY_TYPE_OPTIONS = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '快递发货',
    value: '1'
  }
]
export const deliveryTypeFilter = (value: string): string => {
  return DELIVERY_TYPE_OPTIONS.find((item) => item.value === value)?.label || ''
}
export const ORDER_SOURCE_TYPE_OPTIONS = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '线上',
    value: '1'
  }
]
export const orderSourceTypeFilter = (value: string): string => {
  return ORDER_SOURCE_TYPE_OPTIONS.find((item) => item.value === value)?.label || ''
}

export const PAY_STATUS_OPTIONS = [
  {
    label: '未支付',
    value: '0'
  },
  {
    label: '支付失败',
    value: '11'
  },
  {
    label: '支付成功未下单',
    value: '12'
  },
  {
    label: '已下单',
    value: '13'
  },
  {
    label: '取消支付',
    value: '20'
  }
]

export const payStatusFilter = (value: string): string => {
  return PAY_STATUS_OPTIONS.find((item) => item.value === value)?.label || ''
}

export const afterSaleStatusFilter = (val: number | string): string => {
  return {
    10: '待入库',
    11: '已取消',
    12: '已上报',
    20: '待返还',
    21: '已记录',
    22: '已返还',
    30: '已完成',
    40: '待出库',
    41: '已完成',
    42: '已关闭 ',
    undefined: '',
    null: ''
  }[val] || ''
}

export const goodsStatusFilter = (val: number | string): string => {
  return {
    400: '售后处理',
    0: '已下单',
    310: '待发货',
    320: '已发货',
    410: '已取消',
    900: '已完成',
    undefined: '',
    null: ''
  }[val] || ''
}
