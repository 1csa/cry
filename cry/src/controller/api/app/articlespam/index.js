const Base = require('../../../base.js');
const axios = require('axios');

// cpp 董征宇
// const CPP_BASE_URL = 'http://cl-k8s.yidian-inc.com/apis/cpp-doc'; // 线上
const CPP_BASE_URL = 'http://cl-k8s-staging.yidian-inc.com/apis/cpp-doc'; // 测试
module.exports = class extends Base {
  testAction() {
    this.body = {
      status: 'success',
    };
  }
  async updateDocAction() {
    const params = this.get();
    const data = this.post();
    try {
      const response = await axios({
        url: `${CPP_BASE_URL}/prv/document/update`,
        method: 'post',
        params,
        data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
      this.body = {
        status: 'success',
        result: response.data,
      };
    } catch (err) {
      this.body = {
        status: 'failed',
        reason: new Error(err),
      };
    }
  }
};
