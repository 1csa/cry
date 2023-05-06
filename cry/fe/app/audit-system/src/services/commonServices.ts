import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLogInfo, getEmailName, isProdEnv } from '@/utils/dev_helper';

const getSystemUrl = (url: string) => {
  return `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${url}`;
};

// 获取一些 统计数据 下拉菜单+今日审核等
export async function fetchCount(data: any): Promise<any> {
  return request.post(getSystemUrl(`sys/stts/info`), {
    data: {
      outstyle: 'json',
      auditor_id_will: getEmailName(),
      ...data,
    },
  });
}

// 获取下拉列表数据 列表中
export async function fetchDropDownList(): Promise<any> {
  return request(getSystemUrl(`cat/info/list`));
}

// 获取下拉列表数据
export async function fetchNewDropDownList(data: any): Promise<any> {
  return request.post(getSystemUrl(`memu/business/info/v2`), { data });
}

// 获取任务列表数据
export async function fetchReviewTaskList(data: any, type?: string): Promise<any> {
  if (appConfig.openMock) {
    const obj = {
      article: 'articleList',
      video: 'videoList',
      comment: 'commentList',
      user: 'userList',
    };
    return request.post(`/api/${obj[type ? type : 'article']}`, { data });
  } else {
    isProdEnv() && saveLogInfo(data, 'fetchReviewTask');
    return request.post(getSystemUrl(`mat/list`), { data });
  }
}

// 领取任务
export async function fetchReviewTask(data: any, type?: string): Promise<any> {
  if (appConfig.openMock) {
    const obj = {
      article: 'articleList',
      video: 'videoList',
      comment: 'commentList',
      user: 'userList',
    };
    return request.post(`/api/${obj[type ? type : 'article']}`, { data });
  } else {
    isProdEnv() && saveLogInfo(data, 'fetchReviewTask');
    return request.post(getSystemUrl(`task/take`), { data });
  }
}

// 提交审核结果
export async function submitTask(data: any): Promise<any> {
  if (appConfig.openMock) {
    return request.post(`/api/mat/result`, { data });
  } else {
    isProdEnv() && saveLogInfo(data, 'submitTask');
    return request.post(getSystemUrl(`mat/result`), {
      data: {
        auditor_id_will: getEmailName(),
        ...data,
      },
    });
  }
}

// 结束审核
export async function handleFinishTask(data: any): Promise<any> {
  if (appConfig.openMock) {
    return request.post(`/api/user/exit`, { data });
  } else {
    isProdEnv() && saveLogInfo(data, 'handleFinishTask');
    return request.post(getSystemUrl(`user/exit`), {
      data: {
        auditor_id_will: getEmailName(),
        ...data,
      },
    });
  }
}

// 获取审核日志
export async function fetchRecords(params: any): Promise<any> {
  if (appConfig.openMock) {
    return request(`/audit/log/query`, { params });
  } else {
    return request(getSystemUrl(`audit/log/query`), { params });
  }
}

// 获取审核结果 + 文案以及快捷键列表
export async function fetchAuditResultMenuTags(data: any): Promise<any> {
  return request.post(getSystemUrl(`memu/status/andtags`), { data });
}

// 获取模型标记
export async function fetchMachineLabel(params: any): Promise<any> {
  return request(getSystemUrl(`machine/label/query`), { params });
}

// 接口配置标签 页面动态获取
export async function fetchLabelConfigFromApi(data: any): Promise<any> {
  return request.post(getSystemUrl(`memu/auditLabel`), { data });
}

// 菜单权限
export async function fetchAdminMenu(): Promise<any> {
  return request(getSystemUrl('admin/getMenu'));
}
