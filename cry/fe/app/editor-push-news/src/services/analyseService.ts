import request from '@/utils/request'
import appConfig from '@/config/app/app.config'

// 获取用户基本信息
export async function getUserBasicInfo (userid: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-user-profile?userid=${userid}&from=userprofile_demo`)
}

// 获取用户长期画像
export async function getUserProfile (userid: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-user-profile?userid=${userid}&from=userprofile_new`)
}

// 获取用户短期画像
export async function getShortTermUserProfile (userid: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-user-profile?userid=${userid}&from=userprofile_shortterm_new`)
}

// 获取最近抽样 userid
export async function getSampleUsers (day: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-sample-users?day=${day}`)
}

// 获取 push 文章详情
export async function getPushDocDetail (userid: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-push-doc-list?userid=${userid}&type=&section=PUSH`)
}

// 获取主端文章详情
export async function getAppDocDetail (userid: string, type: string = 'THREE_MONTH'): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-push-doc-list?userid=${userid}&type=${type}&section=APP`)
}

// 获取点击对比
export async function getUserStatistic (userid: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-stats?userid=${userid}`)
}

// 获取点击图数据
export async function getAppAndPushStatistic (userid: string, type: string = 'SEVEN_DAY'): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-click-stats?userid=${userid}&type=${type}`)
}
