const Base = require('../../base');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.history = think.env === "production" ? this.model('inscription/history', "mysql_inscription_prod") : this.model('inscription/history', "mysql_inscription_dev");
  }

  __before() {
    const debug = this.get("debug");

    // 额外根据传入的参数来修正使用的数据库
    if (debug !== undefined) {
      this.history = debug ? this.model('inscription/history', 'mysql_inscription_dev') : this.model('inscription/history', "mysql_inscription_prod");
    }

    return true;
  }

  // 根据id返回投放数据
  indexAction() {
    const querys = this.get();

    console.log(querys, '=============stratlist=============');

    try {
      return this.json({
        status: "success",
        data: {
          list: [
          {
            oper_id: '2333',
            oper_target: "card",
            oper_type: "add",
            oper_name: '随便什么卡片标题',
            oper_target_id: '111111111',
            appid: 'yidian',
            operator: 'zhangsan@yidian-inc.com',
            timekey: '2020-11-04 12: 00',
          },
          {
            oper_id: '2233',
            oper_target: "strategy",
            oper_type: "delete",
            oper_name: '随便什么卡片标题',
            oper_target_id: '22222222',
            appid: 'yidian',
            operator: 'zhangsan@yidian-inc.com',
            timekey: '2020-11-04 12: 00',
          }, ],
          total: 2
        }
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch stratlist=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 新增历史记录
  addAction() {
    const form = this.post();
    const username = this.cookie('username');
    const userid = this.cookie('uid');

    try {
      return this.json({
        status: "success",
        data: 1 // 需要返回卡片ID
      })
    } catch (err) {
      console.log(err.message, '===========error happended when add history==========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  async listAction() {
    const query = this.get();

    try {
      const list_res = await this.history.getHistoryList(query);

      return this.json({
        status: "success",
        data: list_res
      })
    } catch (err) {
      console.log(err.message, '===========error happended when add history==========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }
}
