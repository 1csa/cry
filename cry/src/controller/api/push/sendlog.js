const Base = require('../../base');
const axios = require('axios');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.sendlog = this.model(
      'app/push_sendlog',
      think.env === 'production' ? 'mysql_pushsendlog_prod' : 'mysql_pushsendlog_dev',
    );
  }

  formatTime(data) { // 格式化时间戳 变成mysql的timestamp格式
    var date = new Date(data);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  async indexAction() {
    const user_name = this.cookie('username');
    const action = this.get('action');
    const page = this.get('page');
    const action_id = this.get('action_id');
    const env = this.get('env');
    const context = JSON.stringify(this.get('context'));

    let data = {
      user_name,
      action,
      page,
      action_id,
      env,
      context,
      createtime: this.formatTime(Date.now()),
    };

    const status = await this.sendlog.updateSendLogTable(data);
    if (status === 'success') {
      this.json({
        status: 'success',
      });
    } else {
      this.json({
        status: 'fail',
      });
    }
  }
};
