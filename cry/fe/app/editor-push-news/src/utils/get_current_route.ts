export default function getCurrentRoute(appId: string) {
  const reg = new RegExp(`/app/${appId}(/(\w*))?`);
  let currentRoute = location.pathname.replace(reg, '$1');

  if (currentRoute.endsWith('/')) {
    currentRoute = currentRoute.substring(0, currentRoute.length - 1);
  }

  let splitedRoute = currentRoute.split('/');

  if (splitedRoute.length >= 2) {
    // splitedRoute = ['/setting', '/userset', '/add']
    // 对于二级导航 这个还不够 需要拼一个 '/setting/userset'
    // 如果以后有三级导航 还需要 '/setting/userset/add'
    splitedRoute = splitedRoute.filter(item => item !== '').map(item => `/${item}`);
    let base = splitedRoute[0], len = splitedRoute.length
    for (let i = 1; i < len; i++) {
      base += splitedRoute[i]
      splitedRoute.push(base)
    }
  } else {
    splitedRoute = ['/'];
  }

  return { original: currentRoute, splited: splitedRoute };
}
