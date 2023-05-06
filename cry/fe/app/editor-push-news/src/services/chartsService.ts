import request from '@/utils/request'
import appConfig from '@/config/app/app.config'
import { queryTokenHistoryProps, queryChannelProps } from '@/config/charts/token'

// push报表获取token历史数据
export async function queryTokenHistory(startDate: string, endDate: string): Promise<{
  result: queryTokenHistoryProps
  returncode: number
}> {
  return request.get(`/api/proxy/${appConfig.PUSH_CHARTS_DATA_HOST}/monitor/queryTokenHistory?startDate=${startDate}&endDate=${endDate}`)
}

// push报表获取token历史数据
export async function queryChannelCheck(startDate: string, endDate: string): Promise<{
  result: queryChannelProps
  returncode: number
}> {
  return request.get(`/api/proxy/${appConfig.PUSH_CHARTS_DATA_HOST}/monitor/queryChannelCheck?startDate=${startDate}&endDate=${endDate}`)
}
