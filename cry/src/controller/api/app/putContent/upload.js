const { think } = require("thinkjs");
const CONTENT_API = 'http://cherrypick-platform.int.yidian-inc.com';
// const CONTENT_API = 'http://10.60.108.94';
const UPLOAD_RANDOM_URL = `${CONTENT_API}/api/v1/file/random`;
const UPLOAD_ONE_URL = `${CONTENT_API}/api/v1/file/homologous`;
const fs = require('fs');
const request = require('request');
const xlsx = require('node-xlsx');


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

  }
  async indexAction() {
    const ctx = this.ctx;
    const method = ctx.method;

    if (!!ctx.body && ctx.body.status === 'failed') {
      return;
    }
    if (method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    const file = this.file('excel');
    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        message: '文件缺省, 字段为excel',
      });
    }

    const fileData = {
      excel: {
        value: fs.readFileSync(file.path),
        options: {
          filename: file.name,
          type: file.type,
        }
      }
    };
    let response = await this.upload(UPLOAD_RANDOM_URL, fileData, 'excel');
    this.body = response;

  }
  async uploadFileAction() {
    const ctx = this.ctx;
    const method = ctx.method;

    if (!!ctx.body && ctx.body.status === 'failed') {
      return;
    }
    if (method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    const file = this.file('excel');
    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        message: '文件缺省, 字段为excel',
      });
    }

    const fileData = {
      excel: {
        value: fs.readFileSync(file.path),
        options: {
          filename: file.name,
          type: file.type,
        }
      }
    };

    let response = await this.upload(UPLOAD_ONE_URL, fileData, 'excel');
    this.body = response;
  }
  upload(url, data, name) {
    console.log(url)
    return new Promise((resolve, reject) => {
      request.post(
        {
          url,
          formData: data,
          header: null
        },
        function(err, res, body) {
          body = parseJson(body);
          // const result = {
          //   status: 'success'
          // };
          let result = {};
          if (err || !body || body.message !== 'success') {
            result = {...body};
          } else {
            result = {...body};
          }
          resolve(result);
        }
      );
    });
  }
  
}


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