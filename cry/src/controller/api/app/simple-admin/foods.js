module.exports = class extends think.Controller {
  constructor(...args) {
    super(...args);

    // app/simple-admin/foods 表示的是 model 目录下的 app/simple-admin/foods.js
    this.foodModel = this.model('app/simple-admin/foods', 'mongo_10');
  }

  async indexAction() {
    const method = this.ctx.method;
    switch (method.toUpperCase()) {
      case 'GET':
        return this.getFood();
      case 'POST':
        return this.addFood();
      // PUT vs PATCH
      // https://medium.com/backticks-tildes/restful-api-design-put-vs-patch-4a061aa3ed0b
      case 'PUT':
        return this.updateFood();
      case 'DELETE':
        return this.deleteFood();
      default:
        this.body = {
          code: -1,
          status: 'failed',
          message: `Not support this method: ${method}`,
        };
    }
  }

  getFood() {
    const query = this.get();
    const id = query.id;
    if (id) return this.getFoodItem(id);
    return this.getFoods();
  }

  async getFoodItem(id) {
    try {
      const ret = await this.foodModel.getFoodItem(id);
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  async getFoods() {
    const query = this.get();
    const keywords = query.keywords || '';
    const buyType = (query.buyType && parseInt(query.buyType)) || -1;
    const healthType = (query.healthType && parseInt(query.healthType)) || -1;
    const conditions = {};

    if (keywords !== '') {
      conditions.foodName = new RegExp(keywords);
    }

    if (buyType !== -1) {
      conditions.buyType = buyType;
    }

    if (healthType !== -1) {
      conditions.healthType = healthType;
    }

    try {
      const ret = await this.foodModel.getFoods(conditions);
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  async addFood() {
    const foodData = this.post();
    try {
      await this.foodModel.addFood(foodData);

      this.body = {
        code: 0,
        status: 'success add',
        data: [],
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  async updateFood() {
    const foodData = this.post();
    try {
      await this.foodModel.updateFood(foodData._id, foodData);

      this.body = {
        code: 0,
        status: 'success',
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  async deleteFood() {
    try {
      await this.foodModel.deleteFood(this.get().id);

      this.body = {
        code: 0,
        status: 'success',
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
};
