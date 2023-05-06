module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args)
    
    this.config.database = 'headlines'
  }

  getTopNews (condition) {
    return this.table('channel').where(condition).field('top_news,top_ts,lifespan').find()
  }

  // 只获取置顶数据
  onlyGetTopNews (condition) {
    return this.table('channel').where({'top_news': { $exists: true, $ne: []}}).field('top_news').select()
  }

  delNewsbyDocid(condition) {
    return this.table('channel').where(condition).field('del_news').find();
  }

  getTopNewsCount (condition) {
    return this.table('channel').where(condition).count()
  }

  addTopNews (data) {
    return this.table('channel').add(data)
  }

  updateTopNews (condition, data) {
    return this.table('channel').where(condition).update(data)
  }

  saveTopNewsLog (data) {
    return this.table('top_news').add(data)
  }
}