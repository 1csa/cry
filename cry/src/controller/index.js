const Base = require('./base.js');
module.exports = class extends Base {
  async indexAction() {
    const pageCode = this.get('page') || '404';
    this.assign({
      pageCode,
    });

    await this.display('40x', 'pug');
  }
};
