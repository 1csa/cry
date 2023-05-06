module.exports = class extends think.Mongo {
  constructor(...args) {
    super(...args);
    this.config.database = 'hotpool';
  }

  getList(conditions, pageNum, pageSize, order) {
    return this.where(conditions)
      .order(order)
      .page(pageNum, pageSize)
      .select();
  }

  getCurrentCount(conditions) {
    return this.where(conditions).count('_id');
  }

  getTotalCount() {
    return this.count('_id');
  }

  getItem(_id) {
    return this.where({ _id }).find();
  }

  addItem(data) {
    return this.add(data);
  }

  updateItem(_id, data) {
    return this.where({ _id }).update(data);
  }

  deleteItem(_id) {
    return this.where({ _id }).delete();
  }
};
