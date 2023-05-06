import request from '@/utils/request';
import appConfig from '@/config/app/app.config';
import { JSONtoParmas, getCookieByName } from '@/utils/utils';
import { TagLabelProps, SearchFormProps } from '@/config/userpackage/userpackage';

// 大小类查询
export async function queryTagLabel(): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/label`);
}

// 用户包查询
export async function queryUserTagTagList(): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/tagList`);
}

// 文章列表查询（领取任务）
export async function queryTagDocList(params: SearchFormProps): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/docList?${JSONtoParmas(params)}`);
}

// 提交接口（获取当前用户包数据）
export async function queryTagSubmit(params: { taskId: string }): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/submit?${JSONtoParmas(params)}`);
}

// 确认接口
export async function tagnNotarize(params: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/notarize?${JSONtoParmas(params)}`);
}

// 当前用户当日是否有未提交并且还有效的历史任务
export async function queryTagTaskHistory(): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/taskHistory?userId=${getCookieByName('userid')}`);
}

// 释放任务
export async function releaseTask(taskId: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_USER_TAG_HOST}/user/tag/releaseTask?taskId=${taskId}`);
}
