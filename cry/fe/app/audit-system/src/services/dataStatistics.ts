import appConfig from '@/config/app.config';
import { ResponseProps } from '@/types';
import request from '@/utils/request';

const getSystemUrl = (url: string) => `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${url}`;

const stringParams = (obj: Record<string, string>) => {
  let str = ''
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      str += `${key}=${obj[key]}&`
    }
  })
  return str.substring(0, str.length - 1)
}

// 审核员审核量
export async function fetchAuditorCount(params: any): ResponseProps {
  const newParams = Object.assign({}, params)
  const API = 'task/statistics/audit/partition';
  const url = getSystemUrl(API);
  const { pageSize } = newParams;
  let limit = 0
  
  if (pageSize > 20) { // 对于大于 20 的 pageSize 拆成多个请求，再合并数据 然后返回
    limit = Math.ceil(pageSize / 20)
    let initRes: any = {}
    let allDataArr = []
    for (let i = 1; i <= limit; i++) {
      let useParams = Object.assign({}, newParams)
      useParams['pageNumber'] = i
      useParams['pageSize'] = 20
      const res = await request(`${url}?${stringParams(useParams)}`);
      if (res && res.data && res.data.data && res.data.data.length) {
        allDataArr.push(...res.data.data)
      }
      if (i === 1) {
        initRes = res
      }
    }
    initRes['data']['data'] = allDataArr
    return initRes
  } else {
    const res = await request(url, { params });
    return res
  }
}

// 分区进审量
export function fetchReceiveCount(params: any): ResponseProps {
  const API = 'task/statistics/receive/partition';
  const url = getSystemUrl(API);
  return request(url, { params });
}

// 总审核量
export function fetchAuditTotal(params: any): ResponseProps {
  const API = 'task/statistics/audit/total';
  const url = getSystemUrl(API);
  return request(url, { params });
}

// 总进审量
export function fetchReceiveTotal(params: any): ResponseProps {
  const API = 'task/statistics/receive/total';
  const url = getSystemUrl(API);
  return request(url, { params });
}

// 敏感词统计 - 生成任务并返回queryId和jobId
export function fetchSharkJobId(params: any): ResponseProps {
  const API = 'sensitiveWord/statistics/getSharkJobId';
  const url = getSystemUrl(API);
  return request(url, { params });
}

// 敏感词统计 - 统计量查询进度
export function fetchSharkProgress(data: any): ResponseProps {
  const API = 'sensitiveWord/statistics/getSharkProgress';
  const url = getSystemUrl(API);
  return request.post(url, { data });
}

// 敏感词统计 - 查询结果
export function fetchSharkResult(params: any): ResponseProps {
  const API = 'sensitiveWord/statistics/getSharkResult';
  const url = getSystemUrl(API);
  return request(url, { params });
}
