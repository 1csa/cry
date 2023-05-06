import request from '@/utils/request';
import { TOOL_ID } from '../config/constant';
// 去掉代理
export async function queryCurrent(): Promise<any> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}

export async function fetchAuthService(): Promise<any> {
  return request.get(`/api/proxy/http://pandora.yidian-inc.com/tools/auth/index`, {
    params: {
      tool: TOOL_ID
    }
  });
}
