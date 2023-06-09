// 保证dev下的域名一定是dev.yidian-inc.com:[port],在本机未配host映射时容易出问题
const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href = location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

export default checkHost;

