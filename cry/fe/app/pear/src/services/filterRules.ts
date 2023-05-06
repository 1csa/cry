import request from '@/utils/request';
import { isPrd } from '@/config/app.config';


const TheEnvironment = () => isPrd() ? 'http://index-data-filter.int.yidian-inc.com' : 'http://10.126.164.32:8079'

const proxyURL = (url: string) => {
  return `/api/proxy/${TheEnvironment()}/${url}`;
};

//检索过滤规则
export const getFilterRules = async (data: any) => {
  const URL = 'platform/filterRule/query';
  return await request.post(proxyURL(URL), { data });
};

//新增过滤规则
export const addFilterRules = async (data: any) => {
  const URL = 'platform/filterRule/save'
  return await request.post(proxyURL(URL), { data });
}

//修改过滤规则
export const updateFilterRules = async (data: any) => {
  const URL = 'platform/filterRule/update'
  return await request.post(proxyURL(URL), { data });
}

//删除过滤规则
export const daleteFilterRules = async (params: any) => {
  const URL = 'platform/filterRule/delete';
  return await request.get(proxyURL(URL), params);
};

//业务场景查询
export const getBusinessScene = async (params: any) => {
  const URL = 'filter/query';
  return await request.get(proxyURL(URL), params);
};

//业务场景增加、修改、删除
export const businessScene = async (data: any) => {
  const URL = `filter/save?username=${data.username}&action=${data.type}`
  return await request.post(proxyURL(URL), { data })
}

//业务场景fromid查询
export const getFormidQuery = async () => {
  const URL = `filter/formid_query`
  return await request.get(proxyURL(URL))
}

//规则映射查询
export const getSinkQuery = async (params: any) => {
  const URL = 'filter/sink_ref_query'
  return await request.get(proxyURL(URL), params)
}

//规则映射增加、修改、删除
export const sinkQuery = async (data: any) => {
  const URL = `filter/sink_ref_save?username=${data.username}&action=${data.type}`
  return await request.post(proxyURL(URL), { data })
}

//过滤debug任务查询
export const getFilterDebug = async (params: any) => {
  const URL = 'filter_debug/query'
  return await request.get(proxyURL(URL), params)
}

//过滤debug任务添加
export const addFilterDebug = async (data: any) => {
  const URL = `filter_debug/save?username=${data.name}`
  return await request.post(proxyURL(URL), { data })
}

//过滤debug详情查看
export const getFilterDebugDetail = async (data: any) => {
  const URL = 'filter_debug/query_detail'
  return await request.post(proxyURL(URL), { data })
}

//过滤debug任务执行接口
export const getFilterDebugRunTask = async (data: any) => {
  const URL = 'filter_debug/runTask'
  return await request.post(proxyURL(URL), { data })
}

//获取规则列表
export const getFilterRuleList = async (params: any) => {
  const URL = 'platform/filterRule/list'
  return await request.get(proxyURL(URL), params)
}

//获取kv类型
export const getKvTypeList = async (params: any) => {
  const URL = 'filter_debug/typeList'
  return await request.get(proxyURL(URL), params)
}

//获取规则维度过滤比率变化接口
export const getRuleRatioData = async (data: any) => {
  const URL = 'platform/filterRule/ruleRatioData'
  return await request.post(proxyURL(URL), { data })
}

//获取场景维度过滤比率变化接口
export const getMetaRatioData = async (data: any) => {
  const URL = 'platform/filterRule/metaRatioData'
  return await request.post(proxyURL(URL), { data })
}