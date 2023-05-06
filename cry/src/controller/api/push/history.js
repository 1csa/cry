/**
 * 这里开发调的是后端本机的地址，容易出错
 */

const Base = require("../../base");
const axios = require('axios');
module.exports = class extends Base {

  async indexAction() {
    const querys = this.get() || {};

    try {
      let fetchRes = ''
      if (think.env !== 'production') {
        fetchRes = await axios.get(`http://10.103.17.207/push/get_push_task_history.php`, { params: querys }); // 服务端:邢雨  测试环境 历史数据接口
      } else {
        fetchRes = await axios.get(`${this.config('PUSH_CONFIG').old_push}/push/get_push_task_history.php`, { params: querys });
      }
      // const fetchRes = await axios.get(`http://10.60.106.29:8703/get_push_task_history.php`, { params: querys });

      if (fetchRes.data.status === "success") {
        return this.json(fetchRes.data)
      } else {
        throw new Error(fetchRes.data.result || "获取push history失败");
      }
    } catch (err) {
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 暂停/恢复推送
  async updatepushAction() {
    const id = this.get('push_id');
    const type = this.get('type');

    try {
      if (!id || !type) {
        throw new Error("字段缺失");
      }

      const update_res = await axios.get(`${this.config('PUSH_CONFIG').task}/${type}/${id}`);

      if (update_res.data && update_res.data.status === "success") {
        return this.json({ status: "success" })
      } else {
        throw new Error(update_res.data.msg);
      }
    } catch (err) {
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 更新push内容：TODO 接口信息未验证
  async updatecontentAction() {
    const pushId = this.get('pushId');
    const newTitle = this.get('newTitle');
    const newSummary = this.get('newSummary');

    try {
      if (!pushId || !newTitle || !newSummary) {
        throw new Error("参数不全");
      }

      const update_res = await axios.get({
        url: `${this.config('PUSH_CONFIG').task}/rename`,
        params: { pushId, newTitle, newSummary }
      });

      if (update_res.data && update_res.data.status === "success") {
        return this.json({ status: "success" })
      } else {
        throw new Error(update_res.data.msg);
      }
    } catch (err) {
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }
}
