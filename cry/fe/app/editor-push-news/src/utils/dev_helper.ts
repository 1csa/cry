export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href = location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

/**
 * 根据域名生成环境变量
 * @returns {String} 缺省值为 dev
 */
export const getEnv = () => {
  const domainEnvMap = {
    'dev.yidian-inc.com:8000': 'dev',
    'venus.int.yidian-inc.com:5301': 'dev',
    'zeus.v.yidian-inc.com': 'prod',
  };
  return domainEnvMap[location.host] || 'dev';
};
