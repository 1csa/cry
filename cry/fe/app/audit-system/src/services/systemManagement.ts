import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { ApiResponseProps } from '@/types';

const getUrlPath = (api: string) => `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${api}`;

// 日志获取
export async function operationLogQuery(params?: any): Promise<ApiResponseProps> {
  return request(getUrlPath('admin/system/operation/log/query'), {
    params,
  });
}

// 审核员-列表
export function staffList(params?: any): Promise<ApiResponseProps> {
  // return request(getUrlPath('admin/operator/getOperatorList'), {
  return request(getUrlPath('admin/operator/getOperators'), {
    params,
  });
}

// 审核员-新增
export function staffAdd(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('admin/operator/add'), {
    data,
  });
}

// 审核员-状态更新
export function staffStatus(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('admin/operator/update'), {
    data,
  });
}

// 审核员-状态批量更新
export function staffBatchStatus(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('admin/operator/changeOperatorsStatus'), {
    data,
  });
}

// 管理员-权限菜单-列表
export function managerMenu(data?: any): Promise<ApiResponseProps> {
  return request(getUrlPath('admin/operator/getOperatorManagerMenu'), {
    data,
  });
}

// 管理员-权限-列表
export function managerPermissionList(params?: any): Promise<ApiResponseProps> {
  return request(getUrlPath('admin/operator/getOperatorManager'), {
    params,
  });
}

// 管理员-权限-添加
export function managerPermissionAdd(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('admin/operator/addOperatorManager'), {
    data,
  });
}

// 管理员-权限-删除
export function managerPermissionDelete(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('admin/operator/deleteOperatorManager'), {
    data,
  });
}

// // 管理员-权限-系统管理状态更新
// export function managerPermissionSystemUpdate(params?: any): Promise<ApiResponseProps> {
//   return request(getUrlPath('admin/operator/changeSystemManager'), {
//     params,
//   });
// }

// 管理员列表 - 分区 | 业务
// pageNumber	页码	query	true
// pageSize	每页条数	query	true
// type	查询类型 0.业务管理员 1.分区管理员	query	true
// businessUnitId	子业务ID	query	false
// partzoneId	分区id
export async function managerList(params: any): Promise<any> {
  return request(getUrlPath('manager/getManager'), { params });
}

// 管理员新增 - 分区 | 业务
// businessUnitId	子业务ID	query	true
// email	邮箱	query	true
// type	添加类型 0.业务管理员 1.分区管理员	query	true
// partzoneId	分区ID
export async function managerAdd(params: any): Promise<any> {
  return request(getUrlPath('/manager/addManager'), { params });
}

// 管理员删除 - 分区 | 业务
// businessUnitId	子业务ID	query	true
// operatorId	用户id主键	query	true
// partzoneId	分区ID	query	false
// type 添加类型 0.业务管理员 1.分区管理员
export async function managerDelete(params: any): Promise<any> {
  return request(getUrlPath('/manager/deleteManager'), { params });
}
