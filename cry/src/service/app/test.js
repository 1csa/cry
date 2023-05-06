module.exports = class extends think.Service {
  async getServiceData(token) {
    // 从公共的service拿数据src/extend/service.js
    // const user_info = await this.getUserInfo(token);
    const user_info = 'fake data';

    // 用fetch获取数据，fetch用法参考：https://github.com/thinkjs/think-fetch和https://github.com/bitinn/node-fetch
    const api_data = await this.fetch(
      'http://web-rest.int.yidian-inc.com/api/v1/pandora/auth',
    ).then(res => res.text());
    return { user_info: user_info, api_data: api_data };
  }
};
