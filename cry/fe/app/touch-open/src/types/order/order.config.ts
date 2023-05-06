import type { Product_info, Pay_info, Logistics_info, Order_info, After_sale_info, User_info, OrderInfoResult } from './order';

export const defaultOrderInfo: Order_info = {
  order_id: '',
  type: '',
  tag_amount_total: '',
  pay_amount_total: '',
  service_charge: '',
  postage: '',
  create_time: '',
  order_stat: '',
  source: '',
  userid: '',
  suit_cover_img: '',
  order_stat_value: ''
}

export const defaultProductInfo: Product_info = {
  sku: '',
  tag_amount: '',
  pay_amount: '',
  after_sale_status: 0,
  after_sale_id: '',
  return_order_id: '',
  status: '',
  category_first: '',
  category_second: '',
  category_third: '',
  category_fourth: '',
  cover_img_url: '',
  size_code: '',
  colour_code: '',
  colour_name: '',
  size_name: '',
  category: '',
}

export const defaultUserInfo: User_info = {
  nickname: '',
  mobile: '',
  level: '',
  create_time: '',
  share_id: '',
  avatar_url: '',
}

export const defaultPayInfo: Pay_info = {
  prepay_id: '',
  cash_out_time: '',
  amount: '',
  status: '',
  pay_mode: '',
}

export const defaultLogisticsInfo: Logistics_info = {
  receiver_name: '',
  receiver_mobile: '',
  location: '',
  tracking_number: '',
  express: '',
  status: '',
  create_time: '',
  newest_info: '',
  province: '',
  city: '',
  county: '',
  address: ''
}

export const defaultAfterSaleInfo: After_sale_info = {
  create_time: '',
  op_user: '',
  sku: '',
  tracking_number: '',
  action: '',
  reason: '',
}

export const defaultOrderInfoResult: OrderInfoResult = {
  order_info: defaultOrderInfo,
  product_info: [],
  user_info: defaultUserInfo,
  pay_info: defaultPayInfo,
  logistics_info: [],
  after_sale_info: [],
}
