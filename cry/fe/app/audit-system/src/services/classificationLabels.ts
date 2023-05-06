import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { ApiResponseProps } from '@/types';

const getSystemUrl = (url: string) => {
  return `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${url}`;
};

export async function fetchMarking(): Promise<any> {
  return request('/api/marking');
}

// 获取 打标数据(大分类)
export async function getAllCategoryList(): Promise<ApiResponseProps> {
  return request(getSystemUrl('article/category/getAllCategoryList'));
}
export async function queryLabels(params: { category: string }): Promise<ApiResponseProps> {
  return request(getSystemUrl('article/category/queryLabels'), { params });
}
export async function getSubcategoryList(params: { code: string }): Promise<ApiResponseProps> {
  return request(getSystemUrl('article/category/getSubcategoryList'), { params });
}

// 获取年华 打标数据(大分类)
export async function fetchNianHuaCategoryList(): Promise<any> {
  return request.get(getSystemUrl(`nianhua/category/getAllCategoryList`));
}
