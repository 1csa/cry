export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

/**
 * 判断是否是线上环境 暂时预发和线上都是一个接口
 */
export const isProdEnv = () => {
  const PROD_DOMAIN = [`zeus.v.yidian-inc.com`, `venus.int.yidian-inc.com:5000`];
  return PROD_DOMAIN.includes(location.host) ? true : false;
};

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
