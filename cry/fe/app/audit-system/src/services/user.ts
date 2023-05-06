import request from '@/utils/request';
import AppConfig from '@/config/app.config';

export async function queryCurrent(): Promise<any> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}

/**
 * 获取pandora用户 接口提供方还是暴雪
 */
export async function queryPandoraAllUser(account: string): Promise<any> {
  return request(`/api/proxy/${AppConfig.MANUAL_AUDIT_URL}/admin/operator/getOperatorList`, {
    params: {
      account,
    },
  });
}

/**
 * 获取pandora email
 */
export async function queryPandoraEmailUser(email: string): Promise<any> {
  return request(`/api/proxy/${AppConfig.MANUAL_AUDIT_URL}/admin/operator/getOperatorEmail`, {
    params: {
      email,
    },
  });
}
