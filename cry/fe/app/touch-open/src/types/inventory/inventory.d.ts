import type { ButtonProps } from 'ant-design-vue';
import type { ListOptionType } from '@/services/inwarehouse';

export interface CustomRenderFnPropsType extends ButtonProps {
  record: ListOptionType
}

export interface InWarehouseFormStateType {
  tracking_number: string;
  return_order_id: string;
  bar_code: string;
  name: string;
  inbound_status: string;
  is_replenish: string
}

export interface DefectFormStateType {
  return_order_id: string;
  bar_code: string;
  name: string;
  status: string | undefined;
}

export interface ProductInfoType {
  bar_code: string;
  colour: string;
  colour_code: string;
  cover_img_url: string;
  name: string;
  number: string;
  size: string;
  size_code: string;
}
export interface LogisticsType {
  id: string
  city: string;
  county: string;
  location: string;
  order_id: string;
  province: string;
  receiver_mobile: string;
  receiver_name: string;
  tracking_number: string;
  type: string;
  address?: string;
  company?: string;
}
