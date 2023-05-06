import { message } from 'ant-design-vue';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, ApiDataType } from 'axios'
import Cookies from 'js-cookie';
import qs from 'qs';
import { useUserStore } from '@/store/moudles/user'

interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  requestBaseUrl?: string
}
interface IAxiosGet {
  <P = Record<string, any>, T = any>(url: string, params?: P, config?: AxiosRequestConfigExtend | null, host?: string): Promise<ApiDataType<T>>
}
interface IAxiosPostOrPutOrDelete {
  <P = Record<string, any>, T = any>(url: string, data?: P, config?: AxiosRequestConfigExtend, host?: string): Promise<ApiDataType<T>>
}

/**
 * 展示错误原因
 * @param msg
 */
const showErrorMessage = (msg: string) => {
  message.error(msg);
};

/**
 * 默认的请求配置
 */
export const defaultConfig = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
  showMsg: true  //是否显示默认提示，false用来配置特殊情况的提示弹窗
};

/**
 * 默认请求参数
 * @returns {{"app-code": string, "yd-login-token": any}}
 */
export const getDefaultParams = () => {
  const userName = Cookies.get('username') || '';
  if (userName === '') {
    useUserStore().redirectToLogin()
  }
  return {
    op_user: userName.split('@')[0]
  };
};

/**
 * axios的实例
 * @type {AxiosInstance}
 */
const service: AxiosInstance = axios.create(defaultConfig);
service.defaults.withCredentials = true

/**
 * axios的实例请求拦截器
 */
service.interceptors.request.use(
  function (config: AxiosRequestConfigExtend) {
    // 设备断网
    if (navigator.onLine !== undefined && navigator.onLine === false) {
      return Promise.reject({ message: '网络未链接', code: -1 });
    }
    if (config.requestBaseUrl === 'host2') {
      config.baseURL = import.meta.env.VITE_APP_API2_URL;
    }
    /**
     * 合并参数
     */
    if (config.method == 'get') {
      config.params = { ...getDefaultParams(), ...config.params };
    }
    // config.params = { ...getDefaultParams(), ...config.params };
    if (config.method == 'post') {
      const data = {
        ...config.data,
        ...getDefaultParams(),
      };
      config.data =
        config.data instanceof FormData ? config.data : data; // 转为formdata数据格式
    }

    // config.data = qs.stringify(config.data);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/**
 * axios的实例响应
 */
service.interceptors.response.use(
  function (response: AxiosResponse) {
    // 对响应数据做点什么
    const { data, config } = response;
    if (config.url?.indexOf('pandora.yidian-inc.com') !== -1) {
      if (data && data.status === 'success') {
        return data;
      } else {
        return Promise.reject();
      }
    }

    const code = data.code ?? -1;
    if (code !== 0) {
      const msg = data.msg || '未定义错误';
      showErrorMessage(data.msg);
      return Promise.reject({ code, msg });
    }
    if (config['showMsg' as keyof typeof config] && data.msg) {
      message.info(data.msg);
    }
    return data;
  },
  function (error) {
    if (!(error.code && error.code === -1))
      error.message = '接口请求错误，请联系管理员';
    showErrorMessage(error.message);
    return Promise.reject(error);
  }
);

export const get: IAxiosGet = (url, params, config) => {
  return service.get(url, { params, ...config })
}

export const post: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.post(url, data, config)
}

export const put: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.put(url, data, config)
}

export const deleteRequest: IAxiosPostOrPutOrDelete = (url, data, config) => {
  return service.delete(url, { data, ...config })
}

export default service;
