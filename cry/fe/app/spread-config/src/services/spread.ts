import request from '@/utils/request';

// const BASE_URL= '/api/proxy/http://operationtoolservice.test.yidian-inc.com/OperationtoolService'; // 测试地址
const BASE_URL= '/api/proxy/http://operationtoolservice.int.yidian-inc.com/OperationtoolService';

export async function saveSpreadService(data: any): Promise<any> {
  // saveLog(data, action_method);
  return request(`${BASE_URL}/UpdateHighQualityContentConfig`, {
    data,
    method: 'post'
  });
}

export async function fetchSpreadService(): Promise<any> {
  return request(`${BASE_URL}/GetHighQualityContentConfig`);
}


