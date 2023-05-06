const fs = require('fs');
const request = require('request');
const xlsx = require('node-xlsx');

const UPLOAD_URL = 'http://static_image_api.ha.in.yidian.com/image?action=insert&type=editor';
// 跨域白名单
const CORS_WHITE_LIST = [
  'http://dev.yidian-inc.com:8000',
  'http://zeus.v.yidian-inc.com',
  'http://venus.int.yidian-inc.com:5001',
  'http://localhost.yidian-inc.com:8000'
];
function parseJson(str) {
  var data = {};
  if (typeof str === 'string') {
    try {
      data = JSON.parse(str);
    } catch (e) {
      data = {};
    }
  } else {
    data = str;
  }
  return data;
}
function upload(url, data, name) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url,
        formData: data,
        header: null,
      },
      function(err, res, body) {
        body = parseJson(body);
        const result = {
          status: 'success',
        };
        if (err || !body || body.status !== 'success' || !body.url) {
          result.status = 'failed';
          result.message = '上传失败';
        } else {
          result.url = body.url;
          result.name = name;
        }
        resolve(result);
      },
    );
  });
}
module.exports = class extends think.Controller {
  constructor(...args) {
    super(...args);

    // app/simple-admin/foods 表示的是 model 目录下的 app/simple-admin/foods.js
    this.common = {};
    const ctx = this.ctx;
    const support = ['OPTIONS', 'POST'];
    const method = ctx.method;
    if (support.indexOf(method) === -1) {
      ctx.body = {
        status: 'failed',
        message: `Not support this method: ${method}`,
      };
    }
    ctx.set('Access-Control-Allow-Origin', ctx.header.origin);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    if (ctx.header.origin && CORS_WHITE_LIST.indexOf(ctx.header.origin) === -1) {
      ctx.body = {
        status: 'failed',
        message: '请添加白名单',
      };
    }
  }

  // 上传图片
  async indexAction() {
    const ctx = this.ctx;
    const method = ctx.method;
    if (!!ctx.body && ctx.body.status === 'failed') {
      return;
    }
    if (method === 'OPTIONS') {
      ctx.status = 204;
    }
    const file = this.file('image');
    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        message: '图片缺省',
      });
    }
    const image = {
      pic: {
        value: fs.readFileSync(file.path),
        options: {
          filename: file.name,
          type: file.type,
        },
      },
    };
    const response = await upload(UPLOAD_URL, image, file.name);
    this.body = response;
  }

  // 解析excel
  async uploadXlsxConvertToJsonAction() {
    const ctx = this.ctx;
    const method = ctx.method;
    const result = [];
    if (!!ctx.body && ctx.body.status === 'failed') {
      return;
    }
    if (method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    const file = this.file('xlxsFile');
    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        message: '文件缺省, 字段为xlxsFile',
      });
    }
    try {
      const excelObj = xlsx.parse(file.path) || [];
      for (let i = 0; i < excelObj.length; ++i) {
        const target = excelObj[i].data || [];
        // 表为空
        if (target.length <= 1) {
          ctx.body = {
            status: 'failed',
            message: '数据表为空',
          };
        } else {
          const keys = target.shift();
          for (let j = 0; j < target.length; ++j) {
            const item = target[j]; // 每一列数据
            if (item && item.length) {
              const itemObj = {};
              for (let k = 0; k < item.length; ++k) {
                itemObj[keys[k]] = item[k];
              }
              result.push(itemObj);
            }
          }
        }
      }
      ctx.body = {
        status: 'success',
        result: result,
      };
    } catch (err) {
      ctx.body = {
        status: 'failed',
        message: JSON.stringify(err),
      };
    }
  }
};
