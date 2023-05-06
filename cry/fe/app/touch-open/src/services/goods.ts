import request, { get, post } from '@/utils/request';

type SerialNumType = number | string;
export interface GoodsItemType {
  id?: string;
  name?: string;
  category: [SerialNumType, SerialNumType, SerialNumType, SerialNumType];
  material: string;
  style: string;
  silhouette?: string;
  waist_type?: string;
  collar_type?: string;
  clothes_detail?: string;
  length?: string;
  year: SerialNumType;
  season: SerialNumType;
  size_code: SerialNumType;
  colour_code: SerialNumType;
  unit: SerialNumType;
  tag_amount: number;
  cost_amount: number;
  supplier: string;
  cover_img_url: string;
  clothes_img_urls: string[];
  thumbnail_url: string;
  screenshot_url: string;
  sleeve_length?: string;
  tone_code: number;
  skin_colour_code?: number;
  main_colour_code: string;
  original_draw_url: String;
  tightness: number;
  thickness: number;
  sag: number;
  elastic_force: number;
  ventilate: number;
  wear_resisting: number;
  fabric_description: { img: string; word: string }[];
  goods_source: string[];
  stock_num: number;
  postage: number;
  chest_circumference: string;
  shoulder_breadth: string;
  waistline: string;
  hipline: string;
  clothes_length: string;
  collar_to_sleeve: string;
  outside_sleeve: string;
  pants_length: string;
  crotch_length: string;
}
export interface EditGoodsParamsType {
  id: string;
  name: string;
  tag_amount?: number;
  cost_amount: number;
  cover_img_url: string;
  clothes_img_urls: string[];
  thumbnail_url: string;
  screenshot_url: string;
  stock_num: string | number;
  goods_source: string[];
}

export interface UploadImageRequestResultType {
  animated: boolean;
  format: string;
  image_id: string;
  size: [number, number];
  url: string;
}

export type GoodsListProps = {
  sku?: string;
  name?: string;
  category?: [SerialNumType, SerialNumType, SerialNumType, SerialNumType];
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_value?: undefined | string;
  start_time?: string;
  end_time?: string;
};

export type GoodsListReturnProps = {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total: number | string;
};
// 商品列表
export const getProductList = <GoodsListProps, GoodsListReturnProps>(data: GoodsListProps) => {
  return post<GoodsListProps, GoodsListReturnProps>('/touch_open/backend/product-list', data, { requestBaseUrl: 'host2' });
};

// 上传图片
export const uploadImg = (data: FormData) => {
  return post<FormData, UploadImageRequestResultType>('/Website/touch_open/image-upload', data, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
};

// 创建商品
export const createGoods = (data: GoodsItemType) => {
  return request({
    url: '/Website/touch_open/add-product',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    data,
  });
};
// 商品删除
export const deleteProduct = (data: { id: string }) => {
  return post('/Website/touch_open/delete-product', data);
};

// 修改商品
export const editGoods = (data: EditGoodsParamsType) => {
  return post<EditGoodsParamsType, GoodsItemType>('/Website/touch_open/update-product', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

// 查询商品信息
export const getProductInfo = (sku: string) => {
  return get<{ sku: string }, GoodsItemType>('/Website/touch_open/product-detail', { sku });
};

type OptionType = {
  label: string;
  value: string;
  children?: OptionType[];
};

// 查询商品信息
export const getCity = () => {
  return get<object, OptionType[]>(
    '/touch_open/backend/get-goods-source',
    {},
    { requestBaseUrl: 'host2' },
  );
};

// 获取商品推荐定价
export const getTagAmount = (data: { cost_amount: number }) => {
  return post('/touch_open/backend/get-tag-amount', data, { requestBaseUrl: 'host2' });
};

// 获取商品利润率
export const getProfitMargin = (data: { cost_amount: number; tag_amount: number }) => {
  return post('/touch_open/backend/get-profit-margin', data, { requestBaseUrl: 'host2' });
};

