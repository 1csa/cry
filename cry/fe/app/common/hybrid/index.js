/**
 * 客户端交互
 * 当前只有分享相关代码，其他的遇到再加
 *
 * 文档参考这里：https://git.yidian-inc.com:8021/webui/wiki/blob/master/app_interface/README.md
 */

window.yidian = window.yidian || {};

const ua = navigator.userAgent.toLowerCase();
let isClient = false;

let hybrid = {
  isContainer: typeof container == 'object' && container,
  isAndroid: /android/.test(ua),
  isIOS: /iphone|ipad|ipod/.test(ua),
};

// ios call
window.setYidianSession = function(sid) {
  isClient = true;
};

// ios call
window.setYidianUtk = function(utk) {
  isClient = true;
};

hybrid.isClient = function() {
  if (hybrid.isContainer || isClient) {
    return true;
  }
  return false;
};

hybrid.openScheme = function(scheme) {
  if (!hybrid.isIOS) {
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'yd-iframe-scheme');
  iframe.setAttribute('src', scheme);
  document.getElementsByTagName('body')[0].appendChild(iframe);
  setTimeout(function() {
    document.getElementById('yd-iframe-scheme').remove();
  }, 1000);
};

hybrid.share = function(title, desc, link, img) {
  if (typeof container != 'undefined' && container && container.shareWithContentWithUrl) {
    container.shareWithContentWithUrl(title, desc, link, img);
  } else if (hybrid.isIOS) {
    const schemeUrl = `yidian-article://share?t=share
    &image=${encodeURIComponent(img)}
    &desc=${encodeURIComponent(desc)}
    &title=${encodeURIComponent(title)}
    &url=${encodeURIComponent(link)}`;

    hybrid.openScheme(schemeUrl);
  }
};

export default hybrid;
