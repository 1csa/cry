export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};


export const checkPhone = (phone: string) => {
  let phoneRegexp = /^\+?(86)?1\d{10}/;
  return phoneRegexp.test(phone);
}

// 获取cookie的话，直接正则先匹配出cookieArr的方法行不通，要么直接name=匹配出来。要么先split再找
export const getCookie = (key: string): string => {
  let regexp: RegExp = new RegExp(`${key}=.*`);
  let target: string = '',
    targetCookie: string | undefined = undefined;

  targetCookie = document.cookie.split(/;\s/).find(cookieItem => regexp.test(cookieItem));

  if (targetCookie !== undefined) {
    target = unescape(targetCookie.split('=')[1]);
  }

  return target;
}
