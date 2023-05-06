const Base = require('../base.js');
const axios = require('axios');

const API_URI = 'http://a2.v.yidian-inc.com/Website';

// cpp 董征宇
const CPP_BASE_URL = 'http://cl-k8s.yidian-inc.com/apis/cpp-doc'; // 线上
// const CPP_BASE_URL = 'http://cl-k8s-staging.yidian-inc.com/apis/cpp-doc'; // 测试
module.exports = class extends Base {
  testAction() {
    this.body = {
      status: 'success',
    };
  }
  async searchDocsByKeywordAction() {
    const ctx = this.ctx;
    const { keyword } = ctx.query;
    try {
      const {
        data: { result, status, reason },
      } = await axios({
        method: 'get',
        url: `${API_URI}/channel/news-list-for-keyword`,
        params: {
          days: 1,
          rewrite: false,
          word_type: 'token',
          display: keyword,
          search: true,
          cstart: 0,
          cend: 800,
          fields:
            'title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date',
          infinite: false,
          request_source: 'oak',
          version: 999999,
          ranker: 'search',
        },
        headers: {
          cookie: 'JSESSIONID=constant-session-1',
        },
      });
      this.body = {
        result,
        status,
        reason,
      };
    } catch (err) {
      this.body = {
        status: 'failed',
        reason: new Error(err),
      };
    }
  }
  async searchDocsByDocidsAction() {
    const ctx = this.ctx;
    const { docids } = ctx.query;
    try {
      const {
        data: { status, documents: result, reason },
      } = await axios({
        method: 'get',
        url: `${API_URI}/contents/content-meta`,
        params: {
          docid: docids,
          fields: 'upload_images',
          version: 999999,
        },
      });
      this.body = {
        result,
        status,
        reason,
      };
    } catch (err) {
      this.body = {
        status: 'failed',
        reason: new Error(err),
      };
    }
  }

  async saveDocToTopicAction() {
    const params = this.get();
    const data = this.post();
    data['talk_id'] = Number(data['talk_id']);
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
