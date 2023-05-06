export interface Order_info {
  order_id: string;
  type: string | number;
  tag_amount_total: string | number;
  pay_amount_total: string | number;
  service_charge: string | number;
  postage: string | number;
  create_time: string;
  order_stat: string | number;
  source: string | number;
  userid: string;
  suit_cover_img: string;
  order_stat_value: string;
  coupon_amount: string | number;
  profit_margin: number | string;
  loss: number | string;
}

export interface Product_info {
  sku: string | number;
  tag_amount: string | number;
  pay_amount: string | number;
  after_sale_status: number;
  after_sale_id?: string | number;
  return_order_id?: string | number;
  status: string | number;
  category_first: string | number;
  category_second: string | number;
  category_third: string | number;
  category_fourth: string | number;
  cover_img_url: string | number;
  size_code: string | number;
  colour_code: string | number;
  colour_name: string | number;
  size_name: string | number;
  category: string[] | string;
  after_sale_status_value: string;
}

export interface User_info {
  nickname: string;
  mobile: string;
  level: string;
  create_time: string;
  share_id: string;
  avatar_url: string;
}

export interface Pay_info {
  prepay_id: string | number;
  cash_out_time: string | number;
  amount: string | number;
  status: string | number;
  pay_mode: string | number;
}

export interface Logistics_info {
  receiver_name: string;
  receiver_mobile: string;
  location: string;
  tracking_number: string;
  express: string;
  status: string;
  create_time: string;
  newest_info: string;
  province: string;
  city: string;
  county: string;
  address: string;
}

export interface After_sale_info {
  create_time: string;
  op_user: string;
  sku: string;
  tracking_number: string;
  action: string;
  reason: string;
}

export interface OrderInfoResult {
  order_info: Order_info;
  product_info: Product_info[];
  user_info: User_info;
  pay_info: Pay_info;
  logistics_info: Logistics_info[];
  after_sale_info: After_sale_info[];
}
