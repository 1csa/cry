import request from '@/utils/request';
import appConfig from '@/config/app.config';

export async function queryCurrent(): Promise<any> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}

export async function getHeader(): Promise<any> {
  return request(
    `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/item/table_header?resourceType=red_table`,
  );
}

export async function getList(params: any): Promise<any> {
  return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/item/list`, {
    params,
  });
}

export async function screenShot(data: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.SCREENSHOT_URL}`, { data });
}
