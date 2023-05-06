import request, { get, post } from '@/utils/request';
import { LogisticsType, ProductInfoType } from '@/types/inventory/inventory';

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
type SerialNumType = number | string;

export interface QuerySuitListProps extends GeneralQueryType {
  sku?: string;
  name?: string;
  suit_name?: string;
  category?: [SerialNumType, SerialNumType, SerialNumType, SerialNumType];
  op_user_name: string;
  update_start_time?: string;
  update_end_time?: string;
  arrive_start_time?: string;
  arrive_end_time?: string;
  status: string | undefined;
}
export interface SuitListOptionType {
  id: string;
  related_order_id: string;
  status: string;
  create_time: string;
  update_time: string;
}
export type SuitListResultProps = GeneralReturnType<SuitListOptionType>;

type IdType = string | number;
export interface SuitListOperateProps {
  ids: IdType[] | [];
  action?: string;
  reason?: string;
}

export interface onLineShowSuitOperationProps {
  state: Number;
  suit_id: Number;
}
// 套装列表
export const getSuitListBackend = <QuerySuitListProps, SuitListResultProps>(
  data: QuerySuitListProps,
) => {
  return post<QuerySuitListProps, SuitListResultProps>('/touch_open/backend/suit-list', data, {
    requestBaseUrl: 'host2',
  });
};

// 套装确认/上/下架
export const shiftSuit = (data: SuitListOperateProps) => {
  return post('/Website/touch_open/shift-suit', data);
};

// 线上展示的 上/下架
export const onLineShowSuitOperation = (data: onLineShowSuitOperationProps) => {
  return post('/touch_open/backend/update-suit-online-state', data, { requestBaseUrl: 'host2' });
};

// 套装删除
export const delateSuit = (data: { id: IdType }) => {
  return post('/Website/touch_open/delete-suit', data);
};

export interface SuitListType {
  id?: string;
  suit_name: string;
  suit_label: number;
  description: string;
  cover_img_url: string;
  other_img_url?: string;
  sample_product_urls: string[];
  silhouette: number;
  tone_code: number;
  model_img_urls?: string[];
  selection: { img: string; word: string }[];
  process_description: { img: string; word: string }[];
  curing_instruction?: number[] | string[];
  op_user: string;
  skus?: string[];
  clothes_img_urls: string[];
  thumbnail_url: string;
  screenshot_url: string;
}
export interface EditSUITParamsType {
  id?: string;
  suit_name?: string;
  suit_label?: number;
  description?: string;
  cover_img_url?: string;
}

// 创建套装
export const createSuit = (data: SuitListType) => {
  return request({
    url: '/Website/touch_open/add-suit',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    data,
  });
};

// 修改套装
export const editSuit = (data: EditSUITParamsType) => {
  return post<EditSUITParamsType, SuitListType>('/Website/touch_open/update-suit', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

// 查询套装信息
export const getSuitInfo = (id: string) => {
  return get<{ id: string }, SuitListType>('/Website/touch_open/suit-detail', { id });
};

const h5Host = import.meta.env.VITE_APP_H5_API1_URL;
// 查询C端套装信息
export const getH5SuitInfo = (data: { suit_id: string }) => {
  return post(h5Host + '/Website/touch_open/suit-info', data);
};
// 后台创建套装分享码
export const getSuitShareCode = (data: { suit_id: string; remark: string }) => {
  return get('/touch_open/backend/get-suit-share-code', data, { requestBaseUrl: 'host2' });
};
