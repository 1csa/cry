import { shopId } from '@/types/shop/shop';
import request, { get, post } from '@/utils/request';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
const baseApi = { requestBaseUrl: 'host2' };
const baseUrl = '/touch_open/backend';

export interface GeneralQueryType {
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_value?: string;
  shop_id?: shopId;
}

export interface ShopIdType {
  shop_id: shopId;
}
export interface GeneralReturnType<T> {
  num: number;
  page: number;
  page_size: number;
  total: number | string;
  list: T[] | [];
}

/*********** 门店 ***********/
export interface ShopListOptionType {
  id: number;
  city: string;
  name: string;
  location: string;
  phone: string;
  status: number;
  address: string;
  images: string[];
  sign_in_code: string;
  measure_code: string;
}
export type ShopListResultProps = GeneralReturnType<ShopListOptionType>;

// 列表
export const getShopList = (data: GeneralQueryType) => {
  return get<GeneralQueryType, ShopListResultProps>(baseUrl + '/shop_list', data, baseApi);
};
export interface UpdateShopType {
  op_type: number;
  shop_name?: string;
  location?: string[];
  address_detail?: string;
  cover_img_url?: string[];
  shop_id?: shopId;
}
// 创建/删除门店
export const updateShop = (data: UpdateShopType) => {
  return post(baseUrl + '/update_shop_status', data, baseApi);
};
export interface EnableShopType {
  op_type: number;
  shop_id: number;
}
// 启用/停用门店
export const enableShop = (data: EnableShopType) => {
  return post(baseUrl + '/enable_shop', data, baseApi);
};

/*********** 员工 ***********/

export interface QueryEmployeeListProps extends GeneralQueryType {
  status: number;
  phone: string;
  name: string;
  birthday: string;
  start_entry_time: string;
  end_entry_time: string;
  start_leave_time: string;
  end_leave_time: string;
}

export interface EmployeeListOptionType {
  id: number;
  shop_id: number;
  name: string;
  phone: string;
  birthday: string;
  status: number;
  role: number;
  entry_time: string;
  leave_time: string;
}

export type EmployeeListResultProps = GeneralReturnType<EmployeeListOptionType>;

// 列表

export const getEmployeeList = <QueryEmployeeListProps, EmployeeListResultProps>(
  data: QueryEmployeeListProps,
) => {
  return get<QueryEmployeeListProps, EmployeeListResultProps>(
    baseUrl + '/employee_list',
    data,
    baseApi,
  );
};

export interface UpdateEmployee {
  employee_id: number | undefined;
  status?: number;
  role?: number;
}

// 编辑

export const updateEmployee = (data: UpdateEmployee) => {
  return post(baseUrl + '/update_employee', data, baseApi);
};

export interface AddEmployee {
  shop_id: shopId;
  name: string;
  phone: string;
  birthday: string;
  role: string;
}

// 添加
export const addEmployee = (data: AddEmployee) => {
  return post(baseUrl + '/add_employee', data, baseApi);
};

/*********** 库存 ***********/

export interface QueryShopStockListProps extends GeneralQueryType {
  status: string;
  phone: string;
  name: string;
  birthday: string;
  start_entry_time: string;
  end_entry_time: string;
  start_leave_time: string;
  end_leave_time: string;
}
export interface ShopStockListOptionType {
  id: number;
  name: string;
  sku: string;
  size_code: string;
  size_name: string;
  colour_code: string;
  colour_name: string;
  cover_img_url: string;
  stock_count: number;
  count: number;
  inbound_time: string;
  category: string[];
  number: number;
}
export type ShopStockListResultProps = GeneralReturnType<ShopStockListOptionType>;

// 列表

export const getShopStockList = <QueryShopStockListProps, ShopStockListResultProps>(
  data: QueryShopStockListProps,
) => {
  return get<QueryShopStockListProps, ShopStockListResultProps>(
    baseUrl + '/shop_stock_list',
    data,
    baseApi,
  );
};
export interface ShopStockOpListType {
  sku: string;
  count: number;
}
export interface UpdateShopStock {
  op_list: ShopStockOpListType[];
  shop_id: shopId;
  op_type: 1 | 2;
}

// 补货/退回

export const updateShopStock = (data: UpdateShopStock) => {
  return post(baseUrl + '/update_shop_stock', data, baseApi);
};

/*********** 套装 ***********/

type SerialNumType = number | string;

export interface QueryShopSuitListProps extends GeneralQueryType {
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

export interface ShopSuitListOptionType {
  id: number;
  name: string;
  sku: string;
  size_code: string;
  size_name: string;
  color_code: string;
  color_name: string;
  cover_img_url: string;
  count: number;
  inbound_time: string;
}

export type ShopSuitListResultProps = GeneralReturnType<ShopSuitListOptionType>;

// 列表

export const getShopSuitList = <QueryShopSuitListProps, ShopSuitListResultProps>(
  data: QueryShopSuitListProps,
) => {
  return get<QueryShopSuitListProps, ShopSuitListResultProps>(
    baseUrl + '/shop_suit_list',
    data,
    baseApi,
  );
};
type IdType = string | number;

export interface UpdateShopSuitStock {
  suit_list: IdType[] | [];
  op_type: number;
  shop_id: shopId;
  reason?: string;
}

// 补货/退回

export const updateShopSuitStock = (data: UpdateShopSuitStock) => {
  return post(baseUrl + '/update_shop_suit_stock', data, baseApi);
};

// 上架/下架

export const shiftShopSuit = (data: UpdateShopSuitStock) => {
  return post(baseUrl + '/shift_shop_suit', data, baseApi);
};
/*********** 轮值 ***********/

// 角色列表
export interface JobListResultProps {
  name?: string;
  job_id: number;
  job_name: string;
  job_count: number;
}

export const getJobList = () => {
  return get<{}, JobListResultProps[]>(baseUrl + '/job_list', {}, baseApi);
};
// 轮值列表
export interface QueryRotationListProps {
  shop_id: shopId;
  start_time: string | undefined;
  end_time: string | undefined;
  time?: Dayjs[];
}

export interface RotationType {
  [x: string]: any[][];
}

export interface RotationListResultProps {
  job_list: JobListResultProps[];
  rotation: RotationType;
}

export const getRotationList = (data: QueryRotationListProps) => {
  return get<QueryRotationListProps, RotationListResultProps>(
    baseUrl + '/employee_rotation_list',
    data,
    baseApi,
  );
};

// 添加更新删除轮值
export interface UpdateRotation {
  date: string | number;
  job_id: number;
  shop_id: shopId;
  origin_employee_id?: number;
  employee_id: number;
  op_type: number;
}

export const updateRotation = (data: UpdateRotation) => {
  return post(baseUrl + '/update_rotation', data, baseApi);
};

// 更新门店角色
export interface UpdateShopJob {
  shop_id: shopId;
  job_id: number | undefined;
  op_type: number;
}

export const updateShopJob = (data: UpdateShopJob) => {
  return post(baseUrl + '/update_shop_job', data, baseApi);
};

/*********** 试衣间 ***********/

// 列表
export interface DressingRoomListOptionType {
  room_id: number;
  shop_id: number;
  category: number;
  status: number;
  migrate_room_id: number;
}

export interface Reserve_info {
  max_reserve_day: number;
  start_reserve_time: string;
  end_reserve_time: string;
  time_step: number;
  reserve_time?: Dayjs[];
}

export interface DressingRoomListResultProps {
  list: DressingRoomListOptionType[];
  reserve_info: Reserve_info;
}

export const getDressingRoomList = (data: ShopIdType) => {
  return get<ShopIdType, DressingRoomListResultProps>(
    baseUrl + '/dressing_room_list',
    data,
    baseApi,
  );
};

// 添加
export interface ActionDressingRoomType {
  shop_id: shopId;
  count: number;
}

export const addDressingRoom = (data: ActionDressingRoomType) => {
  return post(baseUrl + '/add_dressing_room', data, baseApi);
};

// 删除

export const delDressingRoom = (data: ActionDressingRoomType) => {
  return post(baseUrl + '/del_dressing_room', data, baseApi);
};

// 迁移/恢复
export interface MigrateDressingRoomType {
  shop_id: shopId;
  room_id: number | undefined;
  target_room_id?: number;
  op_type: 1 | 2;
}

export const migrateDressingRoom = (data: MigrateDressingRoomType) => {
  return post(baseUrl + '/migrate_dressing_room', data, baseApi);
};
// 停用/启用
export interface EnableDressingRoomType {
  shop_id: shopId;
  room_id: number;
  op_type: 1 | 2;
}

export const enableDressingRoom = (data: EnableDressingRoomType) => {
  return post(baseUrl + '/enable_dressing_room', data, baseApi);
};

// 修改试衣间为线上/线下
export interface UpdateDressingRoomCategory {
  shop_id: shopId;
  room_id: number;
  op_type: 1 | 2;
}

export const updateDressingRoomCategory = (data: UpdateDressingRoomCategory) => {
  return post(baseUrl + '/update_dressing_room_category', data, baseApi);
};

// 设置门店预约时间
export interface ShopReserveType {
  shop_id: shopId;
  max_reserve_day: number;
  start_reserve_time: string | undefined;
  end_reserve_time: string | undefined;
  time_step: number;
  reserve_time?: Dayjs[];
}

export const setShopReserve = (data: ShopReserveType) => {
  return post(baseUrl + '/set_shop_reserve', data, baseApi);
};

/*********** 运营数据统计 ***********/
export interface QueryStatisticsReserveListProps {
  scope: number;
  user_id?: number;
  mobile_suffix?: string;
  nickname?: string;
  /* 用户类型：1-新用户 2-老用户 3-大客户 4-会员 **/
  user_flag?: number;
  activity?: string;
  channel?: string;
  reserveDate?: string;
  reserve_type?: number;
  shop_id?: number;
  suit_id?: number;
  page?: number;
  page_size?: number;
}

export interface StatisticsReserveListType {
  scope: number;
  user_id: number;
  mobile_suffix: string;
  nickname: string;
  /* 用户类型：1-新用户 2-老用户 3-大客户 4-会员 **/
  user_flag: number;
  activity: string;
  channel: string;
  reserve_time: string;
  reserve_type: number;
  sign_time: number;
  leave_time: number;
  shop_id: number;
  shop_name: string;
  reserve_room_id: number;
  suit_id: number;
  suit_img_list: string[];
  suit_id_list: number[];
  suit_price_list: number[];
}
export type StatisticsReserveListProps = GeneralReturnType<StatisticsReserveListType>;

// 列表
export const getStatisticsReserveList = <
  QueryStatisticsReserveListProps,
  StatisticsReserveListProps,
>(
  data: QueryStatisticsReserveListProps,
) => {
  return post<QueryStatisticsReserveListProps, StatisticsReserveListProps>(
    baseUrl + '/statistics/reserve-list',
    data,
    baseApi,
  );
};

// 量体统计列表
export const getStatisticsMeasureList = <
  QueryStatisticsReserveListProps,
  StatisticsReserveListProps,
>(
  data: QueryStatisticsReserveListProps,
) => {
  return post<QueryStatisticsReserveListProps, StatisticsReserveListProps>(
    baseUrl + '/statistics/measure-list',
    data,
    baseApi,
  );
};

export interface QueryStatisticsTop50ListProps {
  shop_id: number;
  period_time: number;
}

export interface StatisticsTop50ListProps {
  id: number;
  suit_name: string;
  cover_img_url: string;
  count: number;
  sale_price: number;
  p_count: number;
  op_user: string;
  create_time: string;
}

// 套装试穿top50列表
export const getStatisticsTop50List = <QueryStatisticsTop50ListProps, StatisticsTop50ListProps>(
  data: QueryStatisticsTop50ListProps,
) => {
  return get<QueryStatisticsTop50ListProps, StatisticsTop50ListProps>(
    baseUrl + '/statistics/top-suit-list',
    data,
    baseApi,
  );
};

// 表盘
export interface QueryStatisticsNumberProps {
  period_time: number;
  shop_id: number;
}
export const getStatisticsNumber = (data: QueryStatisticsNumberProps) => {
  return get(baseUrl + '/statistics/number', data, baseApi);
};
