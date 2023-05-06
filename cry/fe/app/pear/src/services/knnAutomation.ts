import appConfig from '@/config/app.config';
import request from '@/utils/request';

const Environ = appConfig.TheEnvironment;

const proxyURL = (url: string) => {
  return `/api/proxy/${appConfig.TheEnvironment}/${url}`;
};

// 饼图详情
export const getAutomation = async (params: any) => {
  const URL = 'overview/chart';
  return await request.get(proxyURL(URL), params);
};

// 多选类型数据
export const getTypeData = async (params: any) => {
  const URL = 'type_register/register_dict';
  return await request.get(proxyURL(URL), params);
};

// 首页数据
export const getQueryList = async (params: any) => {
  const URL = 'factor_type/query';
  return await request.get(proxyURL(URL), params);
};

// 注册信息查询
export const getRegisterInfo = async (params: any) => {
  const URL = 'type_register/register_info';
  return await request.get(proxyURL(URL), params);
};

// knn库名唯一性校验
export const getTypeCheck = async (params: any) => {
  const URL = 'type_register/type_check';
  return await request.get(proxyURL(URL), params);
};

// 注册信息查询接口
export const getTypeRegister = async (params: any) => {
  const URL = 'type_register/register_info';
  return await request.get(proxyURL(URL), params);
};

// 注册接口
export const getRegistered = async (data: any) => {
  const URL = 'type_register/register';
  return await request.post(proxyURL(URL), { data });
};

// 更新接口
export const updateRegistered = async (data: any) => {
  const URL = 'type_register/update_register_info';
  return await request.post(proxyURL(URL), { data });
};

// 历史构建接口
export const getTaskHistory = async (params: any) => {
  const URL = 'task_history/query';
  return await request.get(proxyURL(URL), params);
};

// 小流量、全量、下线共用一个接口
export const getTaskFlow = async (data: any) => {
  const URL = 'factor_type/flow';
  return await request.post(proxyURL(URL), { data, requestType: 'form' });
};

// 机器管理-列表
export const fetchFactorList = async (params: any) => {
  const URL = 'machine_manage/get';
  return await request.get(proxyURL(URL), { params });
};

// 机器管理-新增
export const fetchFactorAdd = async (data: any) => {
  const URL = 'machine_manage/add';
  return await request.post(proxyURL(URL), { data });
};

// 机器管理-删除
export const fetchFactorDelete = async (data: any) => {
  const URL = 'machine_manage/delete';
  return await request.post(proxyURL(URL), { data });
};

// 机器管理-移动
export const fetchFactorMove = async (data: any) => {
  const URL = 'machine_manage/update';
  return await request.post(proxyURL(URL), { data });
};

//机器扩/缩容
export const fetchFactorNumUpdate = async (params: any) => {
  const URL = 'factor_type/update_type_machine';
  return await request.get(proxyURL(URL), { params });
}

//机器数量的详情
export const fetchMachineNum = async (params: any) => {
  const URL = 'factor_type/query_machine'
  return await request.get(proxyURL(URL), { params });
}

//factor性能详情
export const fetchFactorDetail = async (data: any) => {
  const URL = 'indicator/factor_detail'
  return await request.post(proxyURL(URL), { data });
}

//type性能详情
export const fetchTypeDetail = async (data: any) => {
  const URL = 'indicator/type_detail'
  return await request.post(proxyURL(URL), { data });
}

//过滤配置中的获取核心库列表
export const getFilterCoreTypes = async (params: any) => {
  const URL = 'type_config/core_types'
  return await request.get(proxyURL(URL), params)
}

//查询factor
export const getFactorQuery = async (params: any) => {
  const URL = 'factor/query'
  return await request.get(proxyURL(URL), params)
}

// 添加factor
export const addFactorQuery = async (data: any) => {
  const URL = 'factor/add'
  return await request.post(proxyURL(URL), { data })
}

// 删除factor
export const deleteFactorQuery = async (params: any) => {
  const URL = 'factor/delete'
  return await request.get(proxyURL(URL), params)
}

//更新factor
export const updateFactorQuery = async (data: any) => {
  const URL = 'factor/update'
  return await request.post(proxyURL(URL), { data })
}

//factor是否存在
export const existFactor = async (params: any) => {
  const URL = 'factor/exist'
  return await request.get(proxyURL(URL), params)
}