import {request} from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}
