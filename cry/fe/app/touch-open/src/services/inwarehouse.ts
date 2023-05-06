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
export interface InBoundListProps {
  sku?: string;
  name?: string;
  tracking_num?: string;
  inbound_status?: string;
  return_order_id?: string;
  bar_code?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_value?: string;
}
export interface ListOptionType {
  id: number;
  tracking_number: string;
  return_order_id: string;
  bar_code: string;
  name: string;
  cover_img_url: string;
  colour_name: string;
  colour_code: string;
  size_name: string;
  size_code: string;
  number: number;
  inbound_status: string;
  sku: string;
}

export interface ConfirmInBoundProps {
  id: number;
  status: string;
  reason?: string;
}
export type InBoundListReturnProps = GeneralReturnType<ListOptionType>;

export interface QueryOutBoundListProps extends GeneralQueryType {
  related_order_id?: string;
  status?: string;
}
export interface OutBoundListOptionType {
  id: string;
  related_order_id: string;
  status: string;
  create_time: string;
  update_time: string;
}
export type OutBoundListResultProps = GeneralReturnType<OutBoundListOptionType>;

export interface QueryOutBoundDetailProps {
  id: string;
}

export interface OutBoundDetailResultProps {
  related_order_id: string;
  status: string;
  create_time: string;
  product_info: ProductInfoType[];
  logistics_info: LogisticsType;
}

export interface QueryDefectiveListProps extends GeneralQueryType {
  sku?: string;
  return_order_id?: string;
  bar_code?: string;
  name?: string;
  status?: string;
}
export interface DefectiveListOptionType {
  id: string;
  related_order_id: string;
  status: string;
  create_time: string;
  update_time: string;
}

export type DefectiveListResultProps = GeneralReturnType<DefectiveListOptionType>;

export interface QueryUpdateDefectiveProps {
  id: string | number;
  status: string | number;
}

export interface DefectProductInfoProps {
  return_order_id: string;
}

export interface OrderInfoType {
  return_order_id: string;
  create_time: string;
}

export interface LogisticsInfoType {
  id: string;
  shipper_name: string;
  shipper_mobile: string;
  location: string;
  tracking_number: string;
  type: string;
}

export interface DefectProductItemInfoType {
  name: string;
  sku: string;
  cover_img_url: string;
  colour_code: string;
  size_code: string;
  bar_code: string;
  colour_name: string;
  size_name: string;
}

export interface DefectProductInfoObjectType {
  order_info: OrderInfoType;
  sf_info: LogisticsInfoType;
  product_info: DefectProductItemInfoType[];
}

export interface PlaceLogisticsOrderProps {
  id: string;
  type: number;
  fee?: number;
}

export interface PlaceLogisticesOrderResultType {
  id: string;
  order_id: string;
  tracking_number: string;
  status: '0' | '10' | '90' | '100';
  type: string;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  county: string;
  location: string;
}

interface QueryCloudPrintProps {
  tracking_number: string;
}

interface CloudPrintResultProps {
  id: string;
  tracking_number: string;
  file_name: string;
  waybill_content: string;
}
// 入库管理列表
export const getInBoundList = <InBoundListProps, InBoundListReturnProps>(
  data: InBoundListProps,
) => {
  return post<InBoundListReturnProps>('/Website/touch_open/inbound-list', data);
};

// 入库确认
export const confirmInboundRequest = <ConfirmInBoundProps, InBoundListReturnProps>(
  data: ConfirmInBoundProps,
) => {
  return post<InBoundListReturnProps>('/Website/touch_open/confirm-inbound', data);
};

// 出库管理列表
export const getOutboundList = <QueryOutBoundListProps, OutBoundListResultProps>(
  data: QueryOutBoundListProps,
) => {
  return post<OutBoundListResultProps>('/Website/touch_open/outbound-list', data);
};

// 出库详情
export const getOutboundDetail = (data: QueryOutBoundDetailProps) => {
  return post<OutBoundDetailResultProps>('/Website/touch_open/outbound-detail', data);
};

// 确认出库
export const outbound = (data: QueryOutBoundDetailProps) => {
  return post('/Website/touch_open/outbound', data);
};

// 次品管理列表
export const getDefectiveProductList = <QueryDefectiveListProps, DefectiveListResultProps>(
  data: QueryDefectiveListProps,
) => {
  return post<DefectiveListResultProps>('/Website/touch_open/defective-product-list', data);
};

// 次品管理状态修改
export const updateDefective = (data: QueryUpdateDefectiveProps) => {
  return post('/Website/touch_open/update-defective', data);
};

// 入库返还信息查询
export const defectProductInfoRequest = (data: DefectProductInfoProps) => {
  return post<DefectProductInfoObjectType>('/Website/touch_open/defective-product-info', data);
};

// 快递下单
export const placeLogisticsOrderRequest = (data: PlaceLogisticsOrderProps) => {
  return post<PlaceLogisticesOrderResultType>('/Website/touch_open/express', data);
};

// 下载快递单
export const cloudPrint = (data: QueryCloudPrintProps) => {
  return post<CloudPrintResultProps>('/Website/touch_open/cloud-print', data);
};

interface ReplenishProps {
  sku: string;
  postage: string | number;
  number: number | string;
}
// 补货
export const replenishRequest = (data: ReplenishProps) => {
  return get('/touch_open/backend/replenish', data, { requestBaseUrl: 'host2' });
};

interface SFTokenProps {
  app?: string;
}

// 顺丰token获取
export const getSFTokenRequest = (data: SFTokenProps) => {
  return get('/Website/touch_open/get-sf-access-token', data);
};

interface JDPrintProps {
  /** 物流单号 */
  tracking_number: string;
  /** 快递类型：2 京东快递 3 京东快运 */
  type: number;
}

// 京东云打印
export const JDPrintRequest = (data: JDPrintProps) => {
  return post<string>('/touch_open/backend/jd/jd-pull-data', data, { requestBaseUrl: 'host2' });
};
