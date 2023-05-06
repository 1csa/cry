import { OrderInfoResult } from '@/types/order/order';
import request, { get, post } from '@/utils/request';

export interface GeneralQueryType {
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_value?: string;
}

export interface GeneralReturnType<T> {
  num: number;
  page: number;
  page_size: number;
  total: number | string;
  list: T[] | [];
}

export interface QueryOrderListProps extends GeneralQueryType {
  order_id?: string;
  order_stat?: string;
  user_mobile?: string;
  receiver_mobile?: string;
  receiver_name: string;
  logistics_id?: string;
  start_time?: string;
  end_time?: string;
  suit_id?: string;
  sku: string | undefined;
  source: string | undefined;
  type: string | undefined;
}
export interface OrderListOptionType {
  order_id: string;
  order_stat: string;
  suit_id: string;
  suit_cover_img: string;
  tag_amount_total: string;
  pay_amount_total: string | number;
  create_time: string;
  userid: string;
  nickname: string;
  user_mobile: string;
  receiver_name: string;
  receiver_mobile: string;
  tracking_number: string;
}
export type OrderListResultProps = GeneralReturnType<OrderListOptionType>;


// 订单列表
export const getOrderList = <QueryOrderListProps, OrderListResultProps>(data: QueryOrderListProps) => {
  return post<OrderListResultProps>('/Website/touch_open/get-backend-order-list', data);
};

// 订单详情
export const getOrderInfo = (data: { order_id : string}) => {
  return post<OrderInfoResult>('/Website/touch_open/get-backend-order-info', data);
};


