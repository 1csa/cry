module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    this.config.database = 'tools';
  }

  getAllUserRiseCS() {
    return this.table('preset_cards_test')
      .field('_id')
      .select();
  }
};
