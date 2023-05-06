import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLogInfo, isProdEnv, getCookie, getEmailName } from '@/utils/dev_helper';

const getSystemUrl = (url: string) => {
  return `/api/proxy/${appConfig.SENSWORD_URL}/${url}`;
};
const getAllowListUrl = (url: string) => {
  return `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${url}`;
};

/**
 * 敏感词管理
 */

export async function getAreaList(): Promise<any> {
  return request(getSystemUrl(`sensword/subs`));
}

export async function getBusinessList(): Promise<any> {
  return request(getSystemUrl(`api/sensword/business`));
}

export async function category(id: number = 0): Promise<any> {
  const url = id ? getSystemUrl(`sensword/categories/${id}`) : getSystemUrl(`sensword/categories`);
  return request(url);
}

// 请求列表
export async function getWordList(data: any): Promise<any> {
  return request.post(getSystemUrl(`sensword/words/list`), { data });
}
// POST 添加
export async function addWords(data: any): Promise<any> {
  isProdEnv() && saveLogInfo(data, `add-sensword`);
  return request.post(getSystemUrl(`sensword/words/save/v2`), { data });
}
// POST 失效
export async function invalidationWords(data: any): Promise<any> {
  isProdEnv() && saveLogInfo(data, `delete-sensword`);
  return request.post(getSystemUrl(`sensword/words/statusChange`), { data });
}
// PUT 编辑
export async function updateWords(data: any): Promise<any> {
  isProdEnv() && saveLogInfo(data, `update-sensword`);
  return request.post(getSystemUrl(`sensword/words/update`), { data });
}

export async function getLogs(params: any): Promise<any> {
  return request(getSystemUrl(`sensword/wordLogs`), { params });
}

// 审核词存在检测
// export async function checkWords(params: any): Promise<any> {
//   return request(getSystemUrl(`sensword/words/isRepeat`), { params });
// }

// 单独获取重复和不重复的审核词
export async function checkWords(data: any): Promise<any> {
  return request.post(getSystemUrl('sensword/words/repeatWords'), { data });
}

/**
 * 白名单管理
 */
export async function fetchWhitelistManagementList(params: any): Promise<any> {
  return request(getAllowListUrl(`admin/object/allow/list/query`), { params });
}
export async function fetchWhitelistManagementById(params: any): Promise<any> {
  return request(getAllowListUrl(`admin/object/allow/list/queryById`), { params });
}
export async function updateWhitelistManagement(data: any): Promise<any> {
  return request.post(getAllowListUrl(`admin/object/allow/list/update`), { data });
}
// export async function addWhitelistManagement(data: any): Promise<any> {
//   return request.post(getAllowListUrl(`admin/object/allow/list/add`), { data });
// }

// 新增
export async function addWhitelistManagement(data: any): Promise<any> {
  return request.post(getAllowListUrl(`admin/object/allow/list/batchAddByIds`), { data });
}

// excel导入
export async function excelWhitelistManagement(data: any): Promise<any> {
  const userInfo = {
    email: decodeURIComponent(getCookie('username')),
    name: decodeURIComponent(getCookie('nickname')),
    userid: +getCookie('userid'),
    account: getEmailName(),
  };

  const formData = new FormData();
  for (let key in data) {
    key === 'xlsxFile' ? formData.append('fileStream', data.xlsxFile.fileList[0].originFileObj) : formData.append(key, data[key]);
  }
  // return fetch(getAllowListUrl(`admin/object/allow/list/addExcel`), {
  return fetch(`${appConfig.MANUAL_AUDIT_URL}/admin/object/allow/list/addExcel`, {
    method: 'post',
    body: formData,
    headers: {
      'X-User-Info': encodeURIComponent(JSON.stringify(userInfo)),
    },
  }).then(response => {
    return response.json(); // 先将结果转换为 JSON 对象
  });
  // return request.post(getAllowListUrl(`admin/object/allow/list/addExcel`), { data: formData, requestType: 'form' });
}

export async function mutipleWhitelistManagement(data: any): Promise<any> {
  return request.post(getAllowListUrl(`admin/object/allow/list/batchUpdate`), { data });
}

// excel POST 添加
export async function addKeyWordsByExcel(data: any): Promise<any> {
  const userInfo = {
    email: decodeURIComponent(getCookie('username')),
    name: decodeURIComponent(getCookie('nickname')),
    userid: +getCookie('userid'),
    account: getEmailName(),
  };

  const formData = new FormData();
  for (let key in data) {
    key === 'xlsxFile' ? formData.append('fileStream', data.xlsxFile.fileList[0].originFileObj) : formData.append(key, data[key]);
  }
  // return fetch(getSystemUrl(`sensitive/word/upload/new`), {
  return fetch(`${appConfig.SENSWORD_URL}/sensitive/word/upload/new`, {
    method: 'post',
    body: formData,
    headers: {
      'X-User-Info': encodeURIComponent(JSON.stringify(userInfo)),
    },
  }).then(response => {
    return response.json(); // 先将结果转换为 JSON 对象
  });
  // return request.post(`${appConfig.SENSWORD_URL}/sensitive/word/upload/new`, { data: formData, requestType: 'form' });
}
