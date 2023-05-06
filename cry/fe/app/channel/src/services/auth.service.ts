import request from '@/utils/request'

export async function getChannelAuth (): Promise<any> {
  return request.get(`/api/channel/getChannelAuth`)
}