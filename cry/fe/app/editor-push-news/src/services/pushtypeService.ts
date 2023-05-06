import request from '@/utils/request'
import appConfig from '@/config/app/app.config'
import { GidProps } from '@/config/gid/gid'
import { PushtypeProps } from '@/config/pushtype/pushtype'

export async function getPushtypeEnum (): Promise<any> {
  return request.post(`/api/editor_push/getPushtypeEnum`)
}

// 获取 gid list
export async function getGidList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/gid/list`)
}

// 修改 gid 状态
export async function changeGidStatus (gid: number, status: number): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/gid/status/${gid}/${status}`)
}

// 新增 gid
export async function addGid (values: GidProps): Promise<any> {
  return request.post(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/gid/add`, { data: values })
}

// 更新 gid
export async function updateGid (values: GidProps): Promise<any> {
  return request.post(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/gid/update`, { data: values })
}

// 获取 pushtype list
export async function getPushtypeList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/pushtype/all`)
}

// 修改 pushtype 状态
export async function changePushtypeStatus (id: number, status: number): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/pushtype/status/${id}/${status}`)
}

// 新增 pushtype
export async function addPushtype (values: PushtypeProps): Promise<any> {
  return request.post(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/pushtype/add`, { data: values })
}

// 更新 pushtype
export async function updatePushtype (values: PushtypeProps): Promise<any> {
  return request.post(`/api/proxy/${appConfig.PUSH_TYPE_HOST}/pushtype/update`, { data: values })
}
