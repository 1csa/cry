import request from '@/utils/request'
import appConfig from '@/config/app/app.config'
import { ExperimentSearchProps, ExperimentSettingProps } from '@/config/experiment/experiment'

// 获取 实验 列表
export async function getExperimentList (kws: string = ''): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-bucket-list?kws=${kws}`)
}

// 获取 gid pushtype
export async function getPushtypeList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-pushtype-list`)
}

// 获取观察期时间范围
export async function getDaysByBucketName (bucket_name: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-bucket-setting?bucket_name=${bucket_name}`)
}

// 获取 实验组的 观察期
export async function getBucketSetting (bucket_name: string, bucket_mode: string = ''): Promise<any> {
  let url = `/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-bucket-setting-by-mode?bucket_name=${bucket_name}`
  if (bucket_mode) {
    url += `&bucket_mode=${bucket_mode}`
  }
  return request.get(url)
}

// 创建查询任务
export async function submitTask (values: ExperimentSearchProps): Promise<any> {
  const { bucket_name, bucket_mode, user_layer, gid, push_type, priority } = values
  // console.log(bucket_mode, user_layer, gid, push_type, priority)
  // let url = `/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/submit-task?bucket_name=${bucket_name}`
  let url = `/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/submit-task?bucket_name=${bucket_name}&days=2020-09-22`
  if (bucket_mode) {
    url += `&bucket_mode=${bucket_mode}`
  }
  if (user_layer) {
    url += `&user_layer=${user_layer}`
  }
  if (gid) {
    url += `&gid=${gid}`
  }
  // 注意 pushtype 有可能是 0
  if (push_type !== undefined) {
    url += `&push_type=${push_type}`
  }
  if (priority) {
    url += `&priority=${priority}`
  }

  return request.get(url)
}

// 获取查询进度
export async function queryTaskProgress (query_id: string, task_id: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/query-task-progress?query_id=${query_id}&task_id=${task_id}`)
}

// 查询结果
export async function getTaskResult (query_id: string, task_id: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-task-result?query_id=${query_id}&task_id=${task_id}`)
}

// 设置观察期
export async function updateBucketSetting (values: ExperimentSettingProps): Promise<any> {
  const { email, days, bucket_name, bucket_mode, user_layer, gid, push_type, priority } = values
  return request.post(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/update-bucket-setting`, {
    data: {
      email,
      bucket_name,
      days: days.join(','),
      bucket_mode: bucket_mode.join(','),
      user_layer: user_layer.join(','),
      gid: gid.join(','),
      push_type: push_type.join(','),
      priority: priority.join(',')
    }
  })
}

// 创建两个查询任务
export async function submitTasks (values: ExperimentSearchProps): Promise<any> {
  const { bucket_name, bucket_mode, user_layer, gid, push_type, priority } = values
  // console.log(bucket_mode, user_layer, gid, push_type, priority)
  let url = `/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/submit-tasks?bucket_name=${bucket_name}&bucket_mode=${bucket_mode}&user_layer=${user_layer}&gid=${gid}&push_type=${push_type}&priority=${priority}`

  return request.get(url)
}

// 查询两个任务进度
export async function queryTasksProgress (app_query_id: string, app_task_id: string, index_query_id: string, index_task_id: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/query-tasks-progress?app_query_id=${app_query_id}&app_task_id=${app_task_id}&index_query_id=${index_query_id}&index_task_id=${index_task_id}`)
}

// 查询两个任务结果
export async function getTasksResult (app_query_id: string, app_task_id: string, index_query_id: string, index_task_id: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/get-tasks-result?app_query_id=${app_query_id}&app_task_id=${app_task_id}&index_query_id=${index_query_id}&index_task_id=${index_task_id}`)
}
