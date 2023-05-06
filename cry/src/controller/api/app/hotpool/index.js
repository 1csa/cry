module.exports = class extends think.Controller {
  async indexAction() {
    this.body = {
      code: 0,
      status: 'success',
      message: 'nothing',
    };
  }
};
