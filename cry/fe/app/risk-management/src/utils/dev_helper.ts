export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};
/**
 * 获取cookie
 * @param name 获取cookie的key
 */
export function getCookie (name: string){
  var reg = new RegExp(name + '=' + '([^;]*)' + ';');
  var result = reg.exec(document.cookie);
  return (result && result[1]) || "";
}
