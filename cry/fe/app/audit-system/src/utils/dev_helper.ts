import moment from 'moment';
// @ts-ignore
import { saveLog } from '../../../common/Logger.js';

export const DATE_FORMAT_DD = 'YYYY-MM-DD';
export const DATE_FORMAT_MM = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT_SS = 'YYYY-MM-DD HH:mm:ss';

export const pageName = () => location.pathname;

/**
 * 检查host
 */
export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href = location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

export const currentRoutePath = () => location.pathname.replace('/app/audit-system/', '');

/**
 * 获取用户名称或者邮件
 * @param user
 */
export function getUserName(user: any) {
  const { currentUser } = user;
  return (currentUser && (currentUser.name || currentUser.email)) || '';
}

/**
 * 存储日志信息
 * @param data 请求参数
 * @param action_method 请求方法
 */
export function saveLogInfo(data: any, action_method: string): void {
  saveLog({
    log_source: { tag: 'audit-system' },
    target_data: { detail: JSON.stringify(data), docid: data?.data_ids },
    action_method,
  });
}

/**
 * 获取cookie
 * @param name 获取cookie的key
 */
export function getCookie(name: string) {
  var reg = new RegExp(name + '=' + '([^;]*)' + ';');
  var result = reg.exec(document.cookie);
  return (result && result[1]) || '';
}

/**
 * 获取用户邮箱前缀
 */
export function getEmailName() {
  return decodeURIComponent(getCookie('username')).split('@yidian-inc.com')[0];
}

/**
 * 实现类似lodash.get()的方法，获取深层数据，避免多次&&判断
 * @param source 需要解析的原始对象
 * @param path 解析原始对象数据的路径
 * @param defaultValue 默认值
 */
export function get(source: any, path: string, defaultValue: any) {
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  for (const p of paths) {
    result = Object(result)[p];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
}

/**
 * 时间处理方法
 * @param time 时间秒
 * @param dateFormat 序列化字段
 */
export const formateTime = (time: number, dateFormat?: string) => {
  if (typeof time === 'undefined') return '';
  const isSecond = `${time}`.length === 10;
  return moment(isSecond ? time * 1000 : time).format(dateFormat || DATE_FORMAT_SS);
};

/**
 * 获取默认时间 都是今天当前之前向前推一天
 */
export const getDefaultDate = () => {
  const now = new Date();
  const timeRange = [moment(new Date(+now - 24 * 60 * 60 * 1000)).format(DATE_FORMAT_MM), moment(now).format(DATE_FORMAT_MM)];
  return [moment(timeRange[0], DATE_FORMAT_MM), moment(timeRange[1], DATE_FORMAT_MM)];
};

/**
 * 判断是否是线上环境 暂时预发和线上都是一个接口
 */
export const isProdEnv = () => {
  const PROD_DOMAIN = [`zeus.v.yidian-inc.com`, `venus.int.yidian-inc.com:5000`];
  return PROD_DOMAIN.includes(location.host) ? true : false;
};

/**
 * 根据域名生成环境变量
 * @returns {String} 缺省值为 dev
 */
export const getEnv = () => {
  const domainEnvMap = {
    'dev.yidian-inc.com': 'dev',
    'venus.int.yidian-inc.com:5050': 'test',
    'zeus.v.yidian-inc.com': 'prod',
  };
  return domainEnvMap[location.host] || 'dev';
};

/**
 * 创建一个a标签 用来模拟点击 下载文件
 */
export const download = (url: string, name: string) => {
  const aTag = document.createElement('a');
  aTag.download = name;
  aTag.rel = 'noopener';
  aTag.href = url;
  // 触发模拟点击
  aTag.dispatchEvent(new MouseEvent('click'));
};

/**
 * 将数据转换为数组参数给接口 form表单里来的
 * @param data 需要设置为数组的原始数据
 */
export const setValue2Array = (data: Array<number> | undefined): Array<number> | undefined => {
  return data ? (Array.isArray(data) ? data : [data]) : undefined;
};

/**
 * 比较函数 正序
 * @param property 传入需要比较的key
 */
export const compareFn = (property: string) => (a: any, b: any) => a[property] - b[property];

/**
 * 生成uuid
 */
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replaceAll('-', '');
};

/**
 * 调用示例
 * 单参数：pipe(fn1, fn2)(params) 这个params是第一个函数的参数
 * 多参数 别的函数还有其他参数的情况 pipe(fn1, (m) => fn2(m, v))(params) m是fn1的返回值， v是新的参数
 * @param args
 */
export const pipe = (...args: any) => (x: unknown) => args.reduce((res: any, cb: (v: any) => {}) => cb(res), x);

export const isEmpty = (val: undefined | null | '') => val === undefined || val === null || val === '';

export const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

// 判断是否为 JSON 对象
export const isJSON = (str: string) => {
  if (typeof str !== 'string') return false;
  try {
    var obj = JSON.parse(str);
    return typeof obj == 'object' && obj;
  } catch (error) {
    str && console.error('error：' + str + '!!!' + error);
    return false;
  }
};
