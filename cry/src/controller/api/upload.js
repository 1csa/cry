const request = require('request');
const fs = require('fs');
const crypto = require('crypto');

// 加密参数
const ak = 'CE65BDC9CA6808AD';
const sk = 'GTlydnpmsmgct8PXOCYlU05SiXONQLrX';

// 上传图片后端url
const url = 'http://image-upload.int.yidian-inc.com/upload'; //正式环境
// const url = 'http://image-upload.test.int.yidian-inc.com:8082/upload'; //测试环境
// const url = 'http://10.126.160.14:8082/upload'; // 开发环境

module.exports = class extends think.Controller {
  constructor(props) {
    super(props);
  }

  // 上传图片
  async indexAction() {
    // 这里前端formdata append时注意key为file
    const file = this.file('file');

    try {
      if (!file || !file.path) {
        throw new Error('未获取到图片');
      }

      const timestamp = Date.now();
      const imgBytes = fs.readFileSync(file.path);
      const extend = {
        type: 'channel',
      };

      const tmp_str = `${JSON.stringify(extend)}&${this.fileMd5(imgBytes)}&${timestamp}&${sk}`;
      const signature = `${ak}:${this.bytes2md5(tmp_str)}`;

      const formData = {
        pic: fs.createReadStream(file.path),
        timestamp: JSON.stringify(timestamp),
        signature,
        extend: JSON.stringify(extend),
      };

      /**
       * @return res 请求结果
          code: 0,
          msg: 'success',
          data: {
            animated: false,
            format: 'WEBP',
            image_id: 'FJ_videocover_0_015uMugVg8Gj',
            size: [500, 333],
            url: 'http://i1-test.go2yd.com/image.php?url=FJ_videocover_0_015uMugVg8Gj',
          },
          request_id: 'ab70f701-beb4-496b-aec6-add05cdf3f19',
       */
      const res = await this.upload(url, formData);

      if (res.code === 0) {
        return this.json({
          code: 0,
          status: 'success',
          data: {
            url: res.data.url,
            image_id: res.data.image_id,
          },
        });
      } else {
        return this.json({
          status: 'failed',
          message: res.msg.toString(),
        });
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 真正的后端上传
  upload(url, formData, headers = {}) {
    return new Promise((resolve, reject) => {
      request.post({ url, formData, headers }, (err, response, body) => {
        if (err) {
          reject(err.toString());
        }
        resolve(JSON.parse(body));
      });
    });
  }

  // 加密
  fileMd5(imgBytes) {
    return crypto
      .createHash('md5')
      .update(imgBytes, 'utf8')
      .digest('hex');
  }

  // 加密
  bytes2md5(bts) {
    return crypto
      .createHash('md5')
      .update(bts)
      .digest('hex');
  }
};
