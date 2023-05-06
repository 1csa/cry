import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { ApiResponseProps } from '@/types';

const getUrlPath = (api: string) => `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/${api}`;

// 获取目标 业务 & 分区列表
export async function getTargetPartZone(params?: any): Promise<ApiResponseProps> {
  return request(getUrlPath('quality/get/partzone'), { params });
}

// 创建 & 预览
export async function createTaskPreview(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('quality/task/review'), { data });
}

// 创建 & 确认
export async function createTask(data?: any): Promise<ApiResponseProps> {
  return request.post(getUrlPath('quality/task/request'), { data });
}

// 任务历史列表
export async function taskHistoryList(params: any): Promise<ApiResponseProps> {
  const { from = 'create', ...others } = params;
  const URL =
    from === 'create'
      ? 'quality/list' // 创建任务历史列表
      : 'quality/history/list'; // 任务历史列表
  return request(getUrlPath(URL), { params: others });
}

// 任务历史详情
export async function taskDetail(params: any): Promise<ApiResponseProps> {
  return request(getUrlPath('quality/task/detail'), { params });
}

// 任务历史详情
export async function releaseTask(params: any): Promise<ApiResponseProps> {
  return request(getUrlPath('quality/task/release'), { params });
}
