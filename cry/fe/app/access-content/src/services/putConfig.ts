import request from '@/utils/request';
import { putAPI } from '../config/constant';


// 获取任务列表
export async function getTasks(params: any): Promise<any> {
  return request.get(`/api/proxy/${putAPI.task}`, {
    params
  });
}

// 启动任务
export async function startTask(params: any): Promise<any> {
  return request.post(`/api/proxy/${putAPI.startTask}`, {
    data: params
  }); 
}

// 结束任务
export async function stopTask(params: any): Promise<any> {
  return request.post(`/api/proxy/${putAPI.stopTask}`, {
    data: params
  }); 
}

// 获取站点列表
export async function getSiteList(): Promise<any> {
  return request.get(`/api/proxy/${putAPI.siteList}`);
}

// 获取内容类型列表
export async function getContentTypes(params: any): Promise<any> {
  return request.post(`/api/proxy/${putAPI.contentTypeList}`,{
    data: params
  });
}

// 创建任务
export async function createTask(params: any): Promise<any> {
  return request.post(`/api/proxy/${putAPI.task}`, {
    data: params
  });
}

// 获取任务详情
export async function getTaskDetail(params: any): Promise<any> {
  return request.get(`/api/proxy/${putAPI.task}/${params.id}`);
}

// 编辑某个任务 
export async function editTask(params: any): Promise<any> {
  let id = params.jobId;
  delete params.jobId;
  return request.post(`/api/proxy/${putAPI.task}/${id}`,{
    data: params
  });
}

// 获取大类列表
export async function getCategoryList(): Promise<any> {
  return request.get(`/api/proxy/${putAPI.categoryList}`);
}

// 获取输出APP列表
export async function getExportApp(): Promise<any> {
  return request.get(`/api/proxy/${putAPI.exportApp}`);
}
