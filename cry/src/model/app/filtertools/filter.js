module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    this.config.database = 'unitool';
  }

  getAllUserCover() {
    return this.table('usercoverconditions')
      .order({ _id: 'DESC' })
      .select();
  }
  getAllUserCoverGroupId() {
    return this.table('usercoverconditions')
      .field('groupId')
      .select();
  }
  // deleteUserCover(id) {
  //   return this.table('usercoverconditions')
  //     .where({ groupId: id })
  //     .delete();
  // }

  // 物理删除改为逻辑删除 delete改为update
  deleteUserCover(data) {
    return this.table('usercoverconditions')
      .where({ groupId: data.groupId })
      .update(data);
  }

  addUserCover(data) {
    return this.table('usercoverconditions').add(data);
  }

  updateUserCover(data) {
    return this.table('usercoverconditions')
      .where({ groupId: data.groupId })
      .update(data);
  }

  searchUserCover(data) {
    const keyword = new RegExp(data);
    // let conditions = { 'appId.content': { $all: [keyword] } };
    const conditions = {
      $or: [
        { 'appId.content': keyword },
        { ruleId: keyword },
        { videoId: keyword },
      ],
    };
    return this.table('usercoverconditions')
      .where(conditions)
      .order({ _id: 'DESC' })
      .select();
  }

  getUserCoverById(id) {
    return this.table('usercoverconditions')
      .where({ groupId: id })
      .select();
  }

  getAllNewsRuleId() {
    return this.table('graphicpurification')
      .field('ruleId')
      .select();
  }
  getAllNewsRules(current, pageSize) {
    return this.table('graphicpurification')
      .order({ _id: 'DESC' })
      .page(current, pageSize)
      .countSelect();
  }
  // 获取图文导出数据
  getAllNewsRulesExport() {
    return this.table('graphicpurification')
      .order({ _id: 'DESC' })
      .select()
  }
  addNewsRule(data) {
    return this.table('graphicpurification').add(data);
  }

  searchNewsRule(data) {
    const keyword = new RegExp(data);
    const conditions = {
      $or: [{ name: keyword }, { desc: keyword }],
    };
    return this.table('graphicpurification')
      .where(conditions)
      .order({ _id: 'DESC' })
      // .select();
      .page(data.current, data.pageSize)
      .countSelect();
  }

  updateNewsRule(data) {
    return this.table('graphicpurification')
      .where({ ruleId: data.ruleId })
      .update(data);
  }

  deleteNewsRules(data) {
    return this.table('graphicpurification')
      .where({ ruleId: data.ruleId })
      .update(data);
  }

  getNewsRuleById(data) {
    return this.table('graphicpurification')
      .where({ ruleId: data.id })
      .page(data.current, data.pageSize)
      .countSelect();
  }
  getNewsEditById(id) {
    return this.table('graphicpurification')
      .where({ ruleId: id })
      .select();
  }

  getNewsDeleteById(id) {
    return this.table('graphicpurification')
      .where({ ruleId: id })
      .select();
  }

  getAllVideoRulesName() {
    return this.table('videopurification')
      .field('name')
      .select();
  }
  getAllVideoRuleId() {
    return this.table('videopurification')
      .field('ruleId')
      .select();
  }
  getAllVideoRules(current, pageSize) {
    return this.table('videopurification')
      .order({ _id: 'DESC' })
      .page(current, pageSize)
      .countSelect();
  }
  //获取所有视频规则导出的数据
  getAllVideoRulesExport() {
    return this.table('videopurification')
      .order({ _id: 'DESC' })
      .select()
  }
  searchVideoRule(data) {
    const keyword = new RegExp(data);
    const conditions = {
      $or: [{ name: keyword }, { desc: keyword }],
    };
    return this.table('videopurification')
      .where(conditions)
      .order({ _id: 'DESC' })
      .page(data.current, data.pageSize)
      .countSelect();
  }

  addVideoRule(data) {
    return this.table('videopurification').add(data);
  }

  updateVideoRule(data) {
    return this.table('videopurification')
      .where({ ruleId: data.ruleId })
      .update(data);
  }

  deleteVideoRules(data) {
    return this.table('videopurification')
      .where({ ruleId: data.ruleId })
      .update(data);
  }

  getVideoRuleById(data) {
    return this.table('videopurification')
      .where({ ruleId: data.id })
      .page(data.current, data.pageSize)
      .countSelect();
  }
  getVideoEditRuleById(data) {
    return this.table('videopurification')
      .where({ ruleId: data })
      .select();
  }
  getVideoDeleteRuleById(data) {
    return this.table('videopurification')
      .where({ ruleId: data })
      .select();
  }
  getAllNewsThreshold() {
    return this.table('graphicthresholdnew').select();
  }

  getAllNewsRulesName() {
    return this.table('graphicthresholdnew')
      .field('name')
      .select();
  }

  getAllVideoThreshold() {
    return this.table('videothreshold').select();
  }

  updateNewsThreshold(data) {
    return this.table('graphicthresholdnew')
      .where({ _id: data[0]._id })
      .update(data[0]);
  }

  updateVideoThreshold(data) {
    return this.table('videothreshold')
      .where({ _id: data[0]._id })
      .update(data[0]);
  }
};
