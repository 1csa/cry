import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLogInfo, getEmailName, isProdEnv } from '@/utils/dev_helper';
import { ApiResponseProps } from '@/types';

// 获取业务
export async function fetchBusinessList(): Promise<ApiResponseProps> {
  if (appConfig.openMock) {
    return request(`/admin/business/getBusinessList`);
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/business/getBusinessList`);
  }
}

// 获取子业务
export async function fetchBusinessUnitList(params: any): Promise<ApiResponseProps> {
  if (appConfig.openMock) {
    return request(`/admin/business/getBusinessUnitList`, { params });
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/business/getBusinessUnitList`, {
      params,
    });
  }
}

// 父级标签
export async function fetchParentLabelList(params: any): Promise<ApiResponseProps> {
  if (appConfig.openMock) {
    return request(`/admin/label/getParentLabelList`, { params });
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/label/getParentLabelList`, {
      params,
    });
  }
}

// 内容类型
export async function fetchContentTypeList(params: any): Promise<ApiResponseProps> {
  if (appConfig.openMock) {
    return request(`/admin/business/getContentTypeList`, { params });
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/business/getContentTypeList`, {
      params,
    });
  }
}
// 标签组
export async function fetchAuditLabelGroups(params: any): Promise<ApiResponseProps> {
  if (appConfig.openMock) {
    return request(`/admin/business/getAuditLabelGroups`, { params });
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/admin/business/getAuditLabelGroups`, {
      params,
    });
  }
}
