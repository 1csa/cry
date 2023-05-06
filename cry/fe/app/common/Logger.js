/* eslint-disable */
(function(root, factory){
    if (typeof define === 'function' && define.amd) {
      define([], factory); // AMD. Register as an anonymous module.
    } else if (typeof exports === 'object'){
      module.exports = factory()// NodeJS
    } else { // Browser globals (root is window)
      root.Logger = factory()
    }
  }(this, function(){
    var baseUrl = "http://web-rest.int.yidian-inc.com/api/v1/log-platform/log";
    var queryConfig = { // 服务参数配置
      'pandora': {"schema": "webuilog", "service": "pandora"},
      'oppobrowser': {"schema": "webuilog", "service": "oppobrowser"},
      'feedback': {"schema": "webuilog", "service": "feedback"},
      'www': {"schema": "webuilog", "service": "www"},
      'doris': {"schema": "webuilog", "service": "doris"},
      'mibrowser': {"schema": "webuilog", "service": "mibrowser"},
      'huawei': {"schema": "webuilog", "service": "huawei"},
      'vivo': {"schema": "webuilog", "service": "vivo"},
      'atlas': {"schema": "webuilog", "service": "atlas"}
    };
    function targetUrl(params){
      var pathParam = ''
      for (var key in params) {
        if (params[key]) {
          pathParam += `${key}=${encodeURIComponent(params[key])}&`
        }
      }
      pathParam = pathParam.substring(0, pathParam.length - 1)
      return `${baseUrl}?${pathParam}`
    }
    function isUndef(param){ return param === undefined}
    function getCookie(name){
      var reg = new RegExp(name + '=' + '([^;]*)' + ';');
      var result = reg.exec(document.cookie);
      return (result&&result[1]) || "";
    }
    return {
      getCookie: getCookie,
      saveLog: function(data, type){
        var url = "", params;
        var user = {user: {
          username: decodeURI(getCookie("nickname")) || decodeURI(getCookie("username")) ||  '',
          userid: parseInt(getCookie('YD_PANDORA_UID'))}
        };
        if (isUndef(type)){
          type = 'pandora'
        }
        params = queryConfig[type];
        url = targetUrl(params);
        data = Object.assign({},user,data);
        fetch(url,{
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST',
          mode: 'cors'
        }).then(() => {
          console.info('发送成功')
        });
      }
    };
  }));
