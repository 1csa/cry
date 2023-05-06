import { OpenConfigFormStateType } from '@/types/marketingCenter/marketingCenter';
import request, { get, post } from '@/utils/request';

type SerialNumType = number | string

export type ShareListProps = {
  page?: number;
  page_size?: number;
}

export type ShareListReturnProps = {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total: number;
}

export interface CreatWxcodeProps {
  activity: string;
  channel: string;
  mobile: string
}

export interface CreatWxcodeResultType {
  id: string;
  activity: string;
  channel: string;
  mobile: string;
  wxacode: string;
  create_time: string;
  update_time: string;
}

// 小程序码列表
export const getWxcodeList = <ShareListProps, ShareListReturnProps>(data: ShareListProps) => {
  return post<ShareListReturnProps>('/Website/touch_open/share-list', data);
};

// 生成
export const creatWxcode = (data: CreatWxcodeProps) => {
  return post<CreatWxcodeResultType>('/Website/touch_open/create-share', data);
};

export interface CostProps {
  id?: number;
  create_time?: string;
  opr_user?: string;
  cooling_time?: number;
  tag_white: number;
  tag_size: number;
  collar: number;
  sling: number;
  aircraft_box: number;
  milk_cotton_paper: number;
  return_card: number;
  sticker: number;
  beijing_warehouse: number;
  storage_capacity: number;
  artificial_cost: number;
  artificial_ratio: number;
  selection_ratio: number;
  spot_goods_num: number;
  real_time_spot_goods_num: number;
  force_update?: boolean;
}

// 获取成本
export const getCost = () => {
  return get<CostProps>('/touch_open/backend/get-cost-manage', {}, {requestBaseUrl: 'host2'});
};

// 修改成本
export const updateCost = (data: CostProps) => {
  return post('/touch_open/backend/update-cost-manage', data, {requestBaseUrl: 'host2'});
};

// 获取首页配置
export const getOpenConfig = () => {
  return get<OpenConfigFormStateType>('/touch_open/backend/get-open-config', {}, { requestBaseUrl: 'host2' });
};

// 修改首页配置
export const updateOpenConfig = (data: OpenConfigFormStateType) => {
  return post('/touch_open/backend/update-open-config', data, { requestBaseUrl: 'host2' });
};

export type SuitShareListProps = {
  page?: number;
  page_size?: number;
  id: string;
  userid: string;
  suit_id: string;
}

export type SuitShareListReturnProps = {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total: number;
}

// 小程序码列表
export const getSuitShareList = <SuitShareListProps, SuitShareListReturnProps>(data: SuitShareListProps) => {
  return get<SuitShareListReturnProps>('/touch_open/backend/get-suit-share-list', data, { requestBaseUrl: 'host2' });
};
