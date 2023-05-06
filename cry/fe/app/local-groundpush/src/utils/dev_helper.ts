import { message } from 'antd';
import moment, { Moment } from 'moment';
import exportFromJSON from 'export-from-json';
import { YSelOptProps } from '@/components';
import { CommonOtherType } from '@/config/other.d';

export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

// 限定传入的cookie只能为string类型
export const setCookie = (name: string, value: any): void => {
  let current = new Date();
  current.setTime(current.getTime() + 7 * 24 * 60 * 60 * 1000); // 设定默认保存时间为7天
  document.cookie = `${name}=${escape(value)};path=app/local-groundpush;domain=yidian-inc;expires=${current.toUTCString()}`
};

export const getCookie: (name: string) => any = (name) => {
  const regex = new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/\+^])/g, '\\$1') + '=([^;]*)');
  const matches = document.cookie.match(regex);

  return matches && matches[1] ? unescape(matches[1]) : '';
};

export const parseLongFloat = (val: number): number => {
  return parseFloat(val.toPrecision(12));
};

export const exportData = <T, P>(
  dataList?: T[],
  fileName?: string,
  func?: (dataItem: T) => P
): void => {
  if (!dataList || dataList.length === 0) {
    message.info('当前没有数据可导出');
    return;
  }

  let newDataList = dataList.map(
    listItem => (func && func(listItem)) || listItem
  );

  console.log(newDataList);
  exportFromJSON({
    data: newDataList.flat(1),
    fileName: fileName || 'download',
    exportType: 'csv'
  });
};

export const stringifyDate = (date: Moment | Date | number): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const mapOptions = (origin: CommonOtherType[]): YSelOptProps[] => {
  return origin.map(({ id, value, child }) => ({
    title: value,
    value: id,
    children: child && child.map(({ id, value }) => ({ title: value, value: id }))
  }));
};

export const checkPhone = (phone: string): boolean => {
  let checkRegex = /^1[3,5,6,7,8]\d{9}$/g; // 简单的号码正则匹配，待完善
  return checkRegex.test(phone)
}

export const process = (params: any) => {
  let opt = Object.assign({}, params);
  for (let key in opt) {
    if (Array.isArray(opt[key]) && opt[key].length == 0) {
      delete opt[key]
    }
    if (opt[key] === '' || opt[key] === null || opt[key] === undefined) {
      delete opt[key]
    }
  }
  return opt
}
