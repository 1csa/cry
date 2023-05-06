const min = 0;
const decimalsMax = 99999999999.99;
const intMax = 99999999999;
const perMax = 100;
const decimalStep = 0.01
const rules = [{
  required: true,
  message: '必填',
}]

const getDefaultParams = (unit:string = '', max:number, int:boolean=false, pre:number = 2) => {
  const params = {
    initValue: '',
    step: int ? 1 : decimalStep,
    min: min,
    max: max,
    unit: unit,
    pre: pre,
    rules: rules
  }
  return {
    ...params
  };
};
const priceParams = getDefaultParams('元', decimalsMax)
const amountParams = getDefaultParams('件', intMax, true, 0)
const percentParams = getDefaultParams('%', perMax, true, 0)
export const FORMDATA = [{
  title: '单件服装成本',
  group: {
    'tag_white': {
      type: 'number',
      label: "吊牌白色",
      ...priceParams
    },
    "tag_size": {
      type: 'number',
      label: "吊牌尺码",
      ...priceParams
    },
    'collar': {
      type: 'number',
      label: "领标",
      ...priceParams
    },
    "sling": {
      type: 'number',
      label: "吊牌",
      ...priceParams
    },
  },
}, {
  title: '每单成本',
  group: {
    'aircraft_box': {
      type: 'number',
      label: "飞机盒",
      ...priceParams
    },
    "milk_cotton_paper": {
      type: 'number',
      label: "牛奶棉纸",
      ...priceParams
    },
    'return_card': {
      type: 'number',
      label: "退换卡",
      ...priceParams
    },
    "sticker": {
      type: 'number',
      label: "贴纸",
      ...priceParams
    },
  },
}, {
  title: '仓储成本',
  group: {
    'beijing_warehouse': {
      type: 'number',
      label: "北京总仓",
      ...priceParams
    },
    "storage_capacity": {
      type: 'number',
      label: "仓储量",
      ...amountParams
    }
  },
}, {
  title: '人工成本',
  group: {
    'artificial_cost': {
      type: 'number',
      label: "人力费用",
      ...priceParams
    },
    "artificial_ratio": {
      type: 'number',
      label: "人力占比",
      ...percentParams
    },
    'spot_goods_num': {
      type: 'number',
      label: "计算货量",
      ...amountParams
    },
    "real_time_spot_goods_num": {
      type: 'number',
      label: "实时货量",
      ...amountParams
    },
  },
}, {
  title: '选品成本',
  group: {
    'selection_ratio': {
      type: 'number',
      label: "选品占比",
      ...percentParams
    },
  },
}]
