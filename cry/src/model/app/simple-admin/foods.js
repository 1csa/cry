module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    // set database name
    this.config.database = 'simple-admin';
    // Q: how to set table name ?
    // A: filename is table name
  }

  getFoods(conditions) {
    return this.where(conditions).select();
  }

  getFoodItem(_id) {
    return this.where({ _id }).find();
  }

  addFood(foodData) {
    return this.add(foodData);
  }

  updateFood(_id, foodData) {
    return this.where({ _id }).update(foodData);
  }

  deleteFood(_id) {
    return this.where({ _id }).delete();
  }
};
