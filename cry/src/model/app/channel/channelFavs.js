module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args)

    this.config.database = think.env === 'production' ? 'headlines-channels-bak' : 'headlines-test'
  }

  getFavsByUserid (condition) {
    return this.table('channels').where(condition).find()
  }

  getFavsCount (condition) {
    return this.table('channels').where(condition).countSelect()
  }

  addFavs (data) {
    return this.table('channels').add(data)
  }

  updateFavs (condition, data) {
    return this.table('channels').where(condition).update(data)
  }
}
