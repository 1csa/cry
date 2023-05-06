import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
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
    if (response.status !== 200) {
      // @ts-ignore
      const errorText = codeMessage[response.status] || response.statusText || response.message;
      // @ts-ignore
      const { status, url, path } = response;
      notification.error({
        message: `请求错误 ${status}: ${url || path}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const fetchError = (response: any, data: any) => {
  
  
  const { reason } = data;
  const url = response.url.split('api/proxy/')[1];
  notification.error({
    message: `请求错误URL: ${url}`,
    description: reason,
  });
};

const request = extend({
  errorHandler,
  credentials: 'include',
});

request.interceptors.request.use((url: string, options: any) => {
  return {
    url,
    options,
  };
});

request.interceptors.response.use(response => {
  const { url } = response;
  if (url.indexOf('api/user/getuser') > -1) {
    return response;
  }
  return new Promise((resolve, reject) => {
    response.json().then(data => {
      const { success ,status} = data;
      if (success||status) {
        resolve(data);
      } else {
        fetchError(response, data);
        reject({ response: data });
      }
    });
  });
});

export default request;
