import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { ApiResponseProps } from '@/types';

const getUrlPath = (name: string) => `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/${name}`;

// ------------------------------------ 子业务 分割线 --------------------------------------------
// 获取所属业务下拉菜单
export async function fetchBusinessList(params?: any): Promise<ApiResponseProps> {
  return request(getUrlPath(`business/getBusinessList`), { params });
}

// 获取所属子业务下拉菜单
export async function fetchBusinessUnitList(params?: any): Promise<ApiResponseProps> {
  return request(getUrlPath(`business/getBusinessUnitList`), { params });
}

// 查询子业务配置列表
export async function fetchSubConfigurationList(params: any): Promise<ApiResponseProps> {
  return request(getUrlPath(`business/list`), { params });
}

// 新增子业务配置
export async function addSubBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`business/add`), {
    data,
  });
}

// 编辑子业务配置
export async function updateSubBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`business/update`), {
    data,
  });
}

// ------------------------------------ 标签组 分割线 --------------------------------------------
// 标签组 查询标签组列表页
export async function fetchTagGroupConfigurationList(params: any): Promise<any> {
  return request(getUrlPath(`labelGroup/list`), { params });
}

// 新增标签
export async function addTagGroupBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`labelGroup/add`), {
    data,
  });
}

// 编辑标签
export async function updateTagGroupBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`labelGroup/update`), {
    data,
  });
}

// ------------------------------------ 标签 新跳页面 分割线 --------------------------------------------
// 标签组 标签组内容页
export async function fetchTagConfigurationList(params: any): Promise<any> {
  return request(getUrlPath(`label/list`), { params });
}

// 新增子业务配置
export async function addTagBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`label/add`), {
    data,
  });
}

// 编辑子业务配置
export async function updateTagBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`label/update`), {
    data,
  });
}
// 删除
export async function deleteTagFn(params: { id: number }): Promise<any> {
  return request(getUrlPath(`label/delete`), { params });
}

// ------------------------------------ 标签组 分割线 --------------------------------------------
// 审核分区 列表
export async function fetchPartitionConfigurationList(params: any): Promise<any> {
  return request(getUrlPath(`business/partzone/list`), { params });
}

// 新增 审核分区
export async function addPartitionBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`business/partzone/add`), {
    data,
  });
}

// 编辑 审核分区
export async function updatePartitionBusiness(data: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath(`business/partzone/update`), {
    data,
  });
}
