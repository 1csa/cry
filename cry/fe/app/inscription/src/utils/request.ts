import { extend, RequestResponse } from 'umi-request';
import { notification } from 'antd';

import { ZEUS_PATH } from '@/constants/app';
import { RequestRes, DebugMode, DEBUG_MODE_DEV } from '@/types/app';
import { querystring } from '@/utils';


const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '发出的请求不符合要求',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  return response;
};

const request = extend({
  errorHandler,
  credentials: 'include', // 允许跨域传递cookie(开发时前端端口号和线上不一致)
});

// TODO 统一用zeus请求或者代理,如果要增发环境怎么处理？
export const axiosget = async <T = any>(path: string, param: Record<string, any> = {}, mode?: DebugMode,) => {
  let url: string = ZEUS_PATH + path;

  if (mode !== undefined) {
    param.debug = mode === DEBUG_MODE_DEV;
  }

  if (param && querystring(param).length > 0) {
    url = `${url}?${querystring(param)}`;
  }

  return await request.get<RequestRes<T>>(url);
};

export const axiospost = async <T = any>(
  path: string, postdata?: Record<string, any>, param?: Record<string, any>, mode?: DebugMode
) => {
  let url = `${ZEUS_PATH}${path}`;

  return await request.post<RequestRes<T>>(url, {
    params: { ...param, mode },
    data: postdata,
    headers: { "Content-Type": "application/json" }
  });
}
