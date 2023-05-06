import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}

export async function queryAuth(): Promise<any> {
  // return request('http://pandora.yidian-inc.com/tools/auth/index?tool=247');
  return request('http://pandora.yidian-inc.com/tools/auth/index?tool=3541078614');
}
