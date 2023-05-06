import queryString from 'query-string'
import request from '@/utils/request'
import { FavsProps } from '@/config/sider'

// 搜索 特殊频道
export async function searchChannelEdit (payload: any): Promise<any> {
  const query = queryString.stringify(payload)
  return request.get(`/api/channel/searchChannelEdit?${query}`)
}

// 搜索 一般频道
export async function searchChannelAll (payload: any): Promise<any> {
  const query = queryString.stringify(payload)
  return request.get(`/api/channel/searchChannelAll?${query}`)
}

// 获取 favs
export async function getFavsByUserid (): Promise<any> {
  return request.get(`/api/channel/getFavsByUserid`)
}

// 更新 favs
export async function updateFavsByUserid (data: Array<FavsProps>): Promise<any> {
  return request.post(`/api/channel/updateFavsByUserid`, { data })
}