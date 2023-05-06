module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    this.config.database = 'hotpool';
  }
};
