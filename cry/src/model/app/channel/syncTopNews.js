module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args)
    
    this.config.database = 'headlines'
  }

  getSyncTopNews (condition) {
    return this.table('sync-top-news').where(condition).select()
  }

  addSyncTopNews (data) {
    return this.table('sync-top-news').add(data)
  }
}