// proxy method for browser CORS
// Example:
// /api/proxy/http://pandora.yidian-inc.com/api/user/getuser

const qs = require('query-string');

module.exports = class extends think.Controller {
  async indexAction() {
    const method = this.ctx.method.toUpperCase();
    return this.handleRequest(method);
  }

  async handleRequest(method) {
    const params = this.get();
    if (!/^(https?:)/.test(params.targetUrl)) {
      return this.json({
        code: -1,
        status: 'failed',
        message: '/api/proxy/[targetUrl]，targetUrl 不合法',
      });
    }

    let targetUrl = params.targetUrl;
    targetUrl = targetUrl.replace(/http(s?):\//, 'http$1://');
    delete params.targetUrl;

    if (Object.keys(params).length > 0) {
      targetUrl += `?${this.mapToQueryString(params)}`;
    }

    const userInfo = this.ctx.request.header['x-user-info'];
    const baseHeaders = {
      cookie: this.ctx.request.header.cookie,
      'Content-Type': this.ctx.request.header['Content-Type'] || 'application/json',
    };

    const headers = userInfo
      ? Object.assign(baseHeaders, { 'X-User-Info': userInfo })
      : baseHeaders;

    const options = {
      method,
      headers,
    };

    // console.log(options.headers.cookie)

    if (method !== 'GET') {
      const isFormData = this.ctx.request.header['is-form-data'];
      if (isFormData === 'form-data') {
        // 兼容 body 参数需要这要的形式 key=value&key=value
        options.body = qs.stringify(this.post(), {
          arrayFormat: 'index',
        });
      } else {
        if (options.headers['Content-Type'].indexOf('json') > -1) {
          options.body = JSON.stringify(this.post());
        } else if (options.headers['Content-Type'].indexOf('x-www-form-urlencoded') > -1) {
          options.body = qs.stringify(this.post());
        }
      }
    }
    try {
      const ret = await this.fetch(encodeURI(targetUrl), options).then(res => res.json());
      if (targetUrl.indexOf('/task/take') > 0 || targetUrl.indexOf('/mat/result') > 0 || targetUrl.indexOf('/memu/status/andtags') > 0) {
        // console.log('这是正常输出===---===')
        // console.log(targetUrl)
      }
      return this.json(ret);
    } catch (e) {
      if (targetUrl.indexOf('/task/take') > 0 || targetUrl.indexOf('/mat/result') > 0 || targetUrl.indexOf('/memu/status/andtags') > 0) {
        // console.log('这是error ++++++++===')
        // console.log(targetUrl)
        // console.log(e)
      }
      return this.json({
        code: -1,
        status: 'failed',
        message: e.toString(),
        targetUrl,
        options,
      });
    }
  }

  mapToQueryString(map) {
    let qs = '';
    for (const key in map) {
      let val = map[key];
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      qs += `${key}=${val}&`;
    }

    return qs.substring(0, qs.length - 1);
  }
};
