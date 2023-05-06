export const SUIT_STATUS_OPTIONS = [
  {
    label: '搭配池',
    buttonText: '确认',
    value: '0'
  },
  {
    label: '未上架',
    buttonText: '上架',
    value: '4'
  },
  {
    label: '已上架',
    buttonText: '下架',
    value: '1'
  },
  {
    label: '线上展示',
    buttonText: '下线',
    value: '5'
  },
  {
    label: '已下架',
    buttonText: '上架',
    value: '2'
  },
]

export const suitStatusFilter = (value:string) => {
  return SUIT_STATUS_OPTIONS.find((item) => item.value === value.toString())?.label
}
export const suitButtonFilter = (value:string) => {
  return SUIT_STATUS_OPTIONS.find((item) => item.value === value.toString())?.buttonText
}

export const SHOP_SUIT_STATUS_OPTIONS = [
  {
    label: '已上架',
    buttonText: '下架',
    value: '1'
  },
  {
    label: '已下架',
    buttonText: '上架',
    value: '2'
  },
]
