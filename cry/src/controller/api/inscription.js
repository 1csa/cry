const fs = require('fs');
const request = require('request');
const { think } = require('think-cache');
const Base = require('../base');

const TOOL_ID = '2677830272'; // 临时用的通用卡片的id
const PNADORA_PROD_URL = 'http://pandora.yidian-inc.com/tools';
const UPLOAD_IMAGE_URL = 'http://static_image_api.ha.in.yidian.com/image?type=editor&action=insert';
const OPERATION_PROD_URL = "";
const OPERATION_DEV_URL = "";

function postForm(url, formData) {
  return new Promise(function(resolve, reject) {
    request.post({ url, formData }, function(err, _, res) {
      if (err) {
        reject(err.toString());
      }
      resolve(JSON.parse(res));
    });
  });
}

module.exports = class extends Base {
  constructor(props) {
    super(props);

    const ctx = this.ctx;

    ctx.set('Access-Control-Allow-Origin', ctx.header.origin);
    ctx.set('Access-Control-Allow-Method', 'GET,POST,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Content-Type', 'application/json;charset=utf-8');
  }

  indexAction() {}

  // 这个接口写的其实很有问题
  async authAction() {
    try {
      const authRes = await this.fetch(`${PNADORA_PROD_URL}/auth?tool=${TOOL_ID}`, {
        headers: {
          cookie: this.ctx.request.header.cookie,
          'Content-Type': this.ctx.request.header['Content-Type'] || 'application/json',
        },
      }).then(res => res.json());

      if (authRes.status === 'success') {
        const { user, result } = authRes;

        this.json({
          status: 'success',
          data: { user, authes: result },
        });
      } else {
        this.json({
          status: 'failed',
          message: authRes.reason || '获取权限失败',
        });
      }
    } catch (err) {
      this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async uploadAction() {
    const ctx = this.ctx;
    const method = ctx.method;

    if (method.toLowerCase() == 'options') {
      return ctx.status = 204;
    }

    const file = ctx.file('file');
    const fileType = file && file.type;
    const filepath = file && file.path;
    const filename = file && file.name;

    if (!file || !/image\/.*/.test(fileType) || !filepath) {
      return ctx.json({
        status: 'failed',
        message: '不合法的图片上传请求',
      });
    }

    try {
      const image = {
        pic: {
          value: fs.readFileSync(filepath),
          options: {
            filename: filename,
            type: fileType,
          },
        },
      };

      // 可以正常work, request.post使用formdata表明传输类型是formdata
      // 如果要使用fetch进行传输，需要另外安装form-data的npm包，使用formdata封装数据
      // 但是此时会报TypeError: source.on is not defined,没有找到source.on的调用
      var res = await postForm(UPLOAD_IMAGE_URL, image);
      ctx.json({
        status: 'success',
        data: res.url,
      });
    } catch (err) {
      ctx.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 无id判定为错误请求
  async getcardAction() {
    const params = this.get();

    if (params.id !== undefined) {
      return this.status = 406;
    }

    try {
      const res = await this.httpRequest('', 'get', { id: '' });
      return this.json({
        status: "success",
        data: res
      })
    } catch (err) {
      return this.json({
        status: "failed",
        message: err.toString()
      })
    }

  }

  httpRequest(path, method, params) {
    const base_url = think.env === "production" ? OPERATION_PROD_URL : OPERATION_DEV_URL;
    return new Promise(function(resolve, reject) {
      request.get({
        url: `${base_url}/${path}`,
        method,
      }, function(err, _, res) {
        if (!err || JSON.parse(res).status !== "success") {
          resolve(JSON.parse(res).data) // 这里假设数据是统一写在data字段当中的
        } else {
          reject(err || JSON.parse(res).reason) // 假设理由是统一写在reason字段当中的
        }
      })
    })
  }
};
