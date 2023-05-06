module.exports = class extends think.Model {
  get tableName() {
    return 'jingpin_log';
  }

  async updateSendLogTable(data) {
    const { user_name, action, page, action_id, env, context, createtime } = data;
    let sendLogId = await this.add({
      user_name,
      action,
      page,
      action_id,
      env,
      context,
      createtime,
    });
    return "success"
  }
};
