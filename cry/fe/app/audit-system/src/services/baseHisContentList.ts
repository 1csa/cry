import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLogInfo, getEmailName, isProdEnv } from '@/utils/dev_helper';

// 获取历史内容列表
export async function fetchHistory(params: any): Promise<any> {
  if (appConfig.openMock) {
    return request(`/audit/history/list`, { params });
  } else {
    return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/audit/history/list`, { params });
  }
}
