const Base = require('../../base');

module.exports = class extends think.Controller {
  constructor(...args) {
    super(...args);
    //this.testModel = this.mongo('app/test', 'mongo_10');
    this.testModel = this.mongo('app/test');//默认使用11的Mongo，如果使用其它的mongo参考上面一行
    this.testService = this.service('app/test');
  }
  async indexAction() {
    const db_data = await this.testModel.getTopics();
    const service_data = await this.testService.getServiceData(decodeURIComponent(this.cookie('YD_PANDORA_JWT_TOKEN')));
    this.body = {
      status: 'success',
      db_data: db_data,
      service_data: service_data
    };
  }
};
