import type { SelectProps } from 'ant-design-vue';

export type shopId = number | null;

export interface ShopStateType {
  shopId: shopId;
  shopOptions?: SelectProps['options'];
  actionType?: string;
}
export interface EmployeeList {
  employee_id: number;
  name: string;
}

export interface StatisticFormStateType {
  scope: number;
  user_id?: number | null;
  mobile_suffix?: string;
  nickname?: string;
  /* 用户类型：1-新用户 2-老用户 3-大客户 4-会员 **/
  user_flag?: number[];
  activity?: string;
  channel?: string;
  reserveDate?: string[];
  reserve_type?: number | null;
  shop_id?: number | null;
  suit_id?: number | null;
  page?: number;
  page_size?: number;
}
