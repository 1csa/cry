const fs = require('fs');
const Base = require('./base');

// 这里来做页面的访问，那么实际工具的访问权限是可以放在这里的
// 无权限、无内容 ==> 403、404
module.exports = class extends Base {
  async indexAction() {
    const name = this.get('name');

    // fix name undefined error: http://dev.yidian-inc.com:4000/app/
    if (!name) return this.redirect('/?page=404');

    // 从缓存中读取内容
    let page = await this.cache(name);

    if (think.isEmpty(page)) {
      try {
        page = await think.promisify(fs.readFile, fs)(
          `${think.ROOT_PATH}/www/dist/app/${name}/index.html`,
          'utf8',
        );
      } catch (e) {
        page = '';
      }
    }

    if (page) {
      if (think.env === 'production') {
        this.cache(name, page);
      }
      return (this.body = page);
    } else {
      this.redirect('/?page=404');
    }
  }
};
