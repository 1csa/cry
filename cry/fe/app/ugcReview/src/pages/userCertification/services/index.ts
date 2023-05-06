import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLog } from '@/utils/dev_helper';

export async function getUserCert(data: any): Promise<any> {
  return request(`/api/proxy/${appConfig.CERT_HOST}/cert/get-cert`, {
    params: data,
  });
}
export async function setUserCert(data: any): Promise<any> {
  saveLog(data, 'set-cert');
  return request(`/api/proxy/${appConfig.CERT_HOST}/cert/set-cert`, {
    params: data,
  });
}
export async function getCityList(): Promise<any> {
  return request(`/api/proxy/${appConfig.API_SERVER_A4}/talk/get-city-info`, {
    method: 'get',
    params: {
      key: '28095ff68523ee55c358bc5bd8a1f259',
    },
  });
}
export async function getCategories(appid: string): Promise<any> {
  return request(`/api/proxy/${appConfig.CATEGORIES_HOST}/OperationtoolService/GetCategories`, {
    method: 'get',
    params: {
      appid: 'local',
    },
  });
}
