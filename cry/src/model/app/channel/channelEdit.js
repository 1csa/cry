module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args)

    this.config.database = 'headlines'
  }

  searchChannelEdit (conditions) {
    return this.table('channel_edit').where(conditions).select()
  }
}
