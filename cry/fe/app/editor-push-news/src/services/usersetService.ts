import request from '@/utils/request'
import appConfig from '@/config/app/app.config'

// 获取 所有 dimension
export async function getDimensionListAll (): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/dimension/listAll`)
}

// 获取 邮箱列表
export async function getEmailList (): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/auth/listEmail`)
}

// 搜索 userset list
export async function getUsersetList (data?: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/userset/get`, { data })
}

// 删除 userset
export async function deleteUserset (data: {[key: string]: number}): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/userset/delete`, { data })
}

// 创建 userset
export async function createUserset (data: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/userset/create`, { data })
}

// 创建 userset by GPS
export async function createUsersetByGPS (data: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.API_HOST}/userset/createGPS`, { data })
}
