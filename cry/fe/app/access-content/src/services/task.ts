import request from '@/utils/request';
import {API} from '../config/constant';

// 保存任务
export async function saveTaskService(data: any): Promise<any> {
  return request.post(`/api/proxy/${API.createTask}`, {
    data,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
}

// 过滤条件
export async function getFiltersService(params: any): Promise<any> {
  return request('');
}

export async function saveFilterService(): Promise<any> {
  return request.post('');
}

//获取大任务
export async function getTasksService(params: any): Promise<any> {
  if(!!params['creator_mail']){
    params['creator_mail'] += '@yidian-inc.com'
  }
  if(!!params['create_timestamp']){
    params['create_timestamp'] = (new Date(params['create_timestamp']).getTime() / 1000) | 0;
  }
  return request.get(`/api/proxy/${API.fetchTask}`, {
    params
  })
}

// 获取子任务
export async function getChildTasksService(params: any): Promise<any>{
  return request.get(`/api/proxy/${API.fetchChildTask}`, {
    params
  })
}

export async function setTaskStatusService(params: any): Promise<any> {
  return request.get(`/api/proxy/${API.setTaskStatus}`, {
    params
  })
}

// 获取子任务
export async function getSubTasksService(params: any): Promise<any> {
  return request('')
}

// 获取某个子任务对应的docs
export async function fecthDocsService(params: any): Promise<any>{
  params['request_from'] = 'tools';
  return request.get(`/api/proxy/${API.fetchDocs}`, {
    params
  })
}
