import { getCookie } from '@/utils/dev_helper';
import request from '@/utils/request';
import { ReturnType } from '@/config/app/app.d';
import { Blackinfo } from '@/config/blacklist/blacklist.d';
import { BasicQueryParam, BasicInfoType } from '@/config/basicinfo/basicinfo.d';

const username = getCookie('username');

export async function queryBlack(phone: string): Promise<ReturnType<Blackinfo>> {
  return request('/api/userinfo/queryStatus', {params: {
    phone
  }}); // 这样访问的是dev.yidian-inc.com:8000/api/userinfo
}

export async function changeStatus(phone: string, currentState: number): Promise<ReturnType<string>> {
  return request('/api/userinfo/changeStatus', { params: {
    phone, currentState, username
  }});
}

export async function queryBasicInfo(params: BasicQueryParam): Promise<ReturnType<BasicInfoType[]>> {
  return request('/api/userinfo/queryBasic', { params });
}
