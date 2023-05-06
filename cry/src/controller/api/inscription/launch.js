const Base = require('../../base');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.launch = think.env === "production" ? this.model('inscription/launch', "mysql_inscription_prod") : this.model('inscription/launch', "mysql_inscription_dev");
  }

  __before() {
    const debug = this.get("debug");

    // 额外根据传入的参数来修正使用的数据库
    if (debug !== undefined) {
      this.launch = debug ? this.model('inscription/launch', 'mysql_inscription_dev') : this.model('inscription/launch', "mysql_inscription_prod");
    }

    return true;
  }

  async indexAction() {
    return this.success("投放数据");
  }

  // 根据id返回投放数据
  async getAction() {
    const launch_id = this.get('launch_id');

    try {
      if (!launch_id) {
        throw new Error(think.config('errors').param_type);
      }

      const get_res = await this.launch.getLaunchById(launch_id);

      return this.json({
        status: 'success',
        data: get_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch launchitem=========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  // 新增投放: 新增之前是否需要检测卡片和策略的状态
  async postAction() {
    const form = this.post('launch');
    const method = this.ctx.method;
    const name = this.cookie('username');
    const isnew = this.ctx.param('isnew') === "true";

    try {
      if (!method || method.toLowerCase() !== 'post') {
        throw new Error(this.config('errors').method_unsupport);
      }

      const post_res = await this.launch.postLaunch(form, name, Date.now(), isnew);
      return this.json({
        status: "success",
        data: post_res
      })
    } catch (err) {
      console.log(err.message, '===========error happended when add launch==========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  // 复制投放: 看是拿全字段新增还是仅提供id进行复制
  // async copyAction() {
  //   const launch_id = this.get('launch_id');
  //   const username = this.cookie('username');

  //   try {
  //     if (!launch_id) {
  //       throw new Error(this.config('errors').param_value);
  //     }

  //     const copy_res = await this.launch.copyLaunch(launch_id, username, Date.now());

  //     return this.json({
  //       status: "success",
  //       data: copy_res
  //     })
  //   } catch (err) {
  //     console.log(err.message, '=========error happended when copy launch=========');
  //     return this.json({
  //       status: "failed",
  //       message: err.message
  //     })
  //   }
  // }

  // 停止投放: 更新 status 字段
  async stopAction() {
    const launch_id = this.get("launch_id");
    const username = this.cookie("username");

    try {
      if (!launch_id) {
        throw new Error(this.config('errors').param_type);
      }

      const stop_res = await this.launch.stopLaunch(launch_id, username, Date.now());

      if (!stop_res) {
        throw new Error("停止投放失败");
      }
      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err.message, '=========error happended when stop launch=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async listAction() {
    const querys = this.get();

    try {
      const list_res = await this.launch.getLaunchList(querys);
      return this.json({
        status: "success",
        data: list_res
      });
    } catch (err) {
      console.log(err.message, '=========error happended when fetch launchlist=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async optionAction() {
    const inputId = this.get('id');

    console.log(inputId);

    try {
      const option_res = await this.launch.getLaunchOptions(inputId);

      console.log(option_res, '=====option res =====')
      return this.json({
        status: "success",
        data: option_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch launchoption=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async updatestatusAction () {
    console.log(this.isCli, "launch_status 变更")

    try {
      if (!this.isCli) {
        throw new Error();
      }

      await this.launch.updateLaunchStatus();

      return this.success(0);
    } catch (err) {
      return this.fail(1000, "deny");
    }
  }
}
