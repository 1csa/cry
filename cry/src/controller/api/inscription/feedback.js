module.exports = class extends think.Controller {
  constructor(props) {
    super(props);
    this.feedback = this.model("inscription/feedback", think.env === "production" ? "mysql_inscription_prod" : "mysql_inscription_dev");
  }

  __before() {
    const debug = this.ctx.param("debug");

    // 额外根据传入的参数来修正使用的数据库
    if (debug === undefined) { // 无debug参数，忽略
      return true;
    }

    this.feedback = debug ? this.model('inscription/feedback', 'mysql_inscription_dev') : this.model('inscription/cards', "mysql_inscription_prod");
  }
  indexAction() {}

  // 获取单条
  async getAction() {
    const feedback_id = this.ctx.param('fb_id');

    try {
      if (!feedback_id) {
        throw new Error(this.config('errors').param_value);
      }
      const get_res = await this.feedback.getFeedback(feedback_id);

      return this.json({
        status: "success",
        data: get_res
      })
    } catch (err) {
      console.log(err.message, '========error happened when get feedback item========');
      this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 新增或修改
  async postAction() {
    const feedback = this.post('feedback');
    const isnew = this.ctx.param('isnew') === 'true';
    const username = this.cookie('username');

    try {
      const post_res = await this.feedback.postFeedback(feedback, username, Date.now(), isnew);

      return this.json({
        status: "success",
        data: post_res
      })
    } catch (err) {
      console.log(err, '============err happened when post feedback item========');
      return this.json({
        status: "faild",
        message: err.message
      })
    }
  }

  // 负反馈列表
  async listAction() {
    const query = this.ctx.param();

    try {
      const list_res = await this.feedback.listFeedback(query);

      return this.json({
        status: "success",
        data: list_res
      })
    } catch (err) {
      console.log(err, '============err happened when get feedback list========');
      return this.json({
        status: "faild",
        message: err.message
      })
    }
  }

  async deleteAction() {
    const feedback_id = this.ctx.param('feedback_id');
    const username = this.cookie('username');

    try {
      if (!feedback_id) {
        throw new Error(this.config('errors').param_value);
      }

      await this.feedback.deleteFeedback(feedback_id, username, Date.now());
      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err, '============err happened when delete feedback item========');
      return this.json({
        status: "faild",
        message: err.message
      })
    }
  }

  async optionAction () {
    const fb_name = this.get('fb_name') || '';

    try {
      const option_res = await this.feedback.getFbOptions(fb_name);

      return this.json({
        status: "success",
        data: option_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch feedbackoption=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }
}
