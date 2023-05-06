module.exports = class extends think.Controller {
  constructor(...args) {
    super(...args);

    const db = think.env === 'production' ? 'mongo_editor' : 'mongo_10';

    this.hotNewsSourceModel = this.model('app/hotpool/hot_news_source', db);
  }

  async indexAction() {
    const method = this.ctx.method;
    switch (method.toUpperCase()) {
      case 'GET':
        return this.getSource();
      case 'POST':
        return this.addSource();
      case 'PUT':
        return this.updateSource();
      case 'DELETE':
        return this.deleteSource();
      default:
        this.body = {
          code: -1,
          status: 'failed',
          message: `Not support this method: ${method}`,
        };
    }
  }

  getSource() {
    const query = this.get();
    const id = query.id;
    if (id) return this.getSourceItem(id);
    return this.getSources();
  }

  async getSourceItem(id) {
    try {
      const ret = await this.hotNewsSourceModel.getItem(id);
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

  async getSources() {
    const query = this.get();
    const keywords = query.keywords || '';
    const type = query.type;
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 20;
    const conditions = {};

    if (keywords !== '') {
      Object.assign(conditions, { account_name: new RegExp(keywords) });
    }

    if (type) {
      Object.assign(conditions, { type: parseInt(type) });
    }

    try {
      const ret = await this.hotNewsSourceModel.getList(
        conditions,
        pageNum,
        pageSize,
        'updateTime DESC',
      );
      const currentCount = await this.hotNewsSourceModel.getCurrentCount(conditions);
      const total = await this.hotNewsSourceModel.getTotalCount();
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
        current_count: currentCount,
        total,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  async addSource() {
    const sourceData = this.post();
    try {
      await this.hotNewsSourceModel.addItem(sourceData);

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

  async updateSource() {
    const sourceData = this.post();
    try {
      await this.hotNewsSourceModel.updateItem(sourceData._id, sourceData);

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

  async deleteSource() {
    try {
      await this.hotNewsSourceModel.deleteItem(this.get().id);

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
