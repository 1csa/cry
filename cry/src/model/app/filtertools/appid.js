module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    this.config.database = 'meta_data';
  }

  getAllAppid() {
    return this.table('pandora')
      .where({ _id: '252' })
      .find();
  }

  addAppid(appid, updatetime) {
    return this.table('pandora')
      .where({ _id: '252' })
      .update({ appid: appid, update_time: updatetime });
  }
};
