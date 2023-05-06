const Base = require('../../base');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.strategy = think.env === "production" ? this.model('inscription/strategy', "mysql_inscription_prod") : this.model('inscription/strategy', "mysql_inscription_dev");
  }

  // 策略包含额外的权限要求
  __before() {
    const debug = this.get("debug");

    // 额外根据传入的参数来修正使用的数据库
    if (debug === undefined) { // 无debug参数，忽略
      return;
    }

    this.strategy = debug ? this.model('inscription/strategy', 'mysql_inscription_dev') : this.model('inscription/strategy', "mysql_inscription_prod");
  }

  indexAction() {
    return this.json({
      status: 'success'
    });
  }

  async getAction() {
    const strat_id = this.get('strat_id');

    try {
      if (!strat_id) {
        throw new Error(think.config('errors').param_value);
      }

      const taregt_strat = await this.strategy.getStratById(strat_id);

      return this.json({
        status: 'success',
        data: taregt_strat
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch stratitem=========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  async postAction() {
    const form = this.post('strat');
    const username = this.cookie('username');
    const isnew = this.ctx.param('isnew') === "true";

    console.log(isnew, this.ctx.param('isnew'), form);

    try {
      if (!form || Object.keys(form).length === 0) {
        throw new Error(this.config('errors').param_value);
      }

      const post_res = await this.strategy.postStrat(form, username, Date.now(), isnew);

      return this.json({
        status: "success",
        data: post_res // 需要返回卡片ID
      });
    } catch (err) {
      console.log(err.message, '===========error happended when add strategy==========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  // 停用策略: 更新 status 字段
  async stopAction() {
    const strat_id = this.get("strat_id");
    const username = this.cookie('username');

    try {
      if (!strat_id) {
        throw new Error(this.config('errors').param_value);
      }

      await this.strategy.stopStrat(strat_id, username, Date.now());

      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err.message, '=========error happended when stop strategy=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 启用策略: 更新status字段, 删除仅针对已停用策略
  async reuseAction() {
    const strat_id = this.get("strat_id");
    const username = this.cookie('username');

    try {
      if (!strat_id) {
        throw new Error(this.config('errors').param_value);
      }

      await this.strategy.reuseStrat(strat_id, username, Date.now());

      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err.message, '=========error happended when delete strategy=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 获取策略列表：过滤已删除策略。不包含权限校验
  async listAction() {
    const querys = this.get();

    try {
      const list_res = await this.strategy.getStratList(querys);
      return this.json({
        status: "success",
        data: list_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch stratlist=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 关联投放：根据给定的策略id获取关联的投放
  async relateAction() {
    const strat_id = this.get('id');

    try {
      if (!strat_id) {
        throw new Error(this.config('errors').param_value);
      }

      const relate_list = await this.strategy.relateList(strat_id);

      return this.json({
        status: "success",
        data: relate_list
      })
    } catch (err) {
      console.log(err.message, '=========error happended when stop launch=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async deleteAction () {
    const strat_id = this.get('strat_id');
    const username = this.cookie('username');

    try {
      if (!strat_id) {
        throw new Error(this.config('errors').param_value);
      }

      await this.strategy.deleteStrat(strat_id, username, Date.now());

      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err.message, '=========error happended when delete launch=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async optionAction () {
    const strat_id = this.get('strat_id');

    try {
      const option_res = await this.strategy.getStratOptions(strat_id);

      return this.json({
        status: "success",
        data: option_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch strategyoption=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }
}
