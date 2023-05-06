export const PURCHASE_STATUS_OPTIONS = [
  {
    label: '全部',
    value: '0'
  },
  {
    label: '待签收',
    buttonText: '上架',
    value: '4'
  },
  {
    label: '部分签收',
    value: '1'
  },
  {
    label: '已关闭',
    value: '2'
  },
  {
    label: '已完成',
    value: '3'
  }
]

export const purchaseStatusFilter = (value: string) => {
  return PURCHASE_STATUS_OPTIONS.find((item) => item.value === value)?.label
}

export const PURCHASE_TYPE_OPTIONS = [
  {
    label: '预采购',
    value: '1'
  },
  {
    label: '采购',
    value: '2'
  },
  {
    label: '补货',
    value: '3'
  },
  {
    label: '门店开店',
    value: '4'
  }
]

export const CLOSE_TYPE_OPTIONS = [
  {
    label: '全款',
    value: '1'
  },
  {
    label: '预付定金',
    value: '2'
  },
  {
    label: '后付款',
    value: '3'
  }
]
