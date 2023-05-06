module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);

    this.config.database = 'tools';
  }

  async getTempList(puid, biz) {
    if (biz) {
      // return await this.where({ create_user: puid, temp_biz: biz }).select();
      return await this.table("editor_push_temp").where({ temp_biz: biz }).order('temp_id').select();
    }
    // return await this.where({ create_user: puid }).select();
    return await this.table("editor_push_temp").where({}).select();
  }

  // 获取存储的分类和标签信息
  async getStoredCates(puid) {
    // 有记录。但是无字段。会返回空记录
    const get_res = await this.table("editor_push").where({ _id: puid }).select({ field: { "cates": 1, _id: 0 } });

    if (get_res.length > 0) {
      return get_res.map(item => item.cates || [])[0]
    }
    return [];
  }

  // 存储分类
  // 神奇，this.table偶尔能够生效？一旦出错就不能生效？
  async saveStoredCates(puid, cates) {
    const cate_res = await this.table("editor_push").where({ _id: puid }).select();

    if (cate_res.length === 0) {
      return await this.table("editor_push").add({ _id: puid, cates: cates });
    } else {
      return await this.table("editor_push").where({ _id: puid }).update({ cates })
    }
  }

  // 获取标签
  async getStoredTags(puid) {
    const get_res = await this.table("editor_push").where({ _id: puid }).select({ field: { "tags": 1, "extags": 1, "interTags": 1, _id: 0 } });

    if (get_res.length > 0) {
      return get_res.map(item => ({
        channels: item.tags || {},
        exclude_channels: item.extags || {},
        inter_channels: item.interTags || {},
      }))[0]
    }

    return { channels: {}, exclude_channels: {}, inter_channels: {} };
  }

  // 存储标签
  async saveStoredTags(puid, tags, extags, interTags) {
    const tag_res = await this.table("editor_push").where({ _id: puid }).select();

    if (tag_res.length === 0) {
      return await this.table("editor_push").add({ _id: puid, tags, extags, interTags });
    } else {
      return await this.table("editor_push").where({ _id: puid }).update({ tags, extags, interTags });
    }
  }
};
