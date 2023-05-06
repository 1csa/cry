//  TODO 当前所有接口均为普通接口，有空修改为graphql接口
const Base = require('../../base');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.card = this.model("inscription/cards", think.env === "production" ? "mysql_inscription_prod" : "mysql_inscription_dev");
  }

  __before() {
    const debug = this.ctx.param("debug");

    // 额外根据传入的参数来修正使用的数据库
    if (debug === undefined) { // 无debug参数，忽略
      return true;
    }

    this.card = debug ? this.model('inscription/cards', 'mysql_inscription_dev') : this.model('inscription/cards', "mysql_inscription_prod");
  }

  // 根据id返回具体的card表单
  async indexAction() {
    const method = this.ctx.method;

    return this.end("card");
  }

  selectionSort(arr) { // 冒泡排序
    let length = arr.length;
    for (let i = 0; i < length - 1; i++) {
      let indexMIn = i;
      for (let j = i; j < length; j++) {
        if (arr[j] < arr[indexMIn]) {
          indexMIn = j;
        }
      }
      const temp = arr[i];
      arr[i] = arr[indexMIn];
      arr[indexMIn] = temp;
    }
    return arr;
  }

  // 提交卡片
  async postAction() {
    const card = this.post('card');
    const username = this.cookie('username');
    const cards_delete = this.ctx.param("delete");
    const isnew = this.ctx.param('isnew') === 'true';

    try {
      if (!card || Object.keys(card).length === 0) {
        throw new Error(think.config('errors').param_type);
      }

      // 用于处理卡片顺序变更逻辑 保留cardid时间戳 按照大小顺序重新排序
      if (Array.isArray(card.card_items) && card.card_items.length > 0) {
        let card_idSort = [];
        card.card_items.map((item, index) => {
          // 新建的卡片这里自动生成card_id 都是当前时间戳 map循环返回时间 不区分先后 都是一样的 所以加个索引
          card_idSort.push(item.card_id || (Date.now() + index));
        });
        card_idSort = this.selectionSort(card_idSort);
        card.card_items.map((item, index) => {
          item.card_id = card_idSort[index];
        });
      }

      // console.log('card------------');
      // console.log(card.card_items, 'card');
      // console.log('card------------');
      const post_res = await this.card.postCard(card, cards_delete, username, Date.now(), isnew); // 手动写入的时间

      return this.json({
        status: "success",
        data: post_res
      });
    } catch (err) {
      console.log(err.message, '=========error happended when add carditem=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 获取单条
  async getAction() {
    const card_id = this.get('card_id');

    try {
      if (!card_id) {
        throw new Error(think.config('errors').param_type);
      }

      const card = await this.card.getCardById(card_id);

      return this.json({
        status: 'success',
        data: card
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch carditem=========');
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  // 启用卡片: 同样调用update card model，更新status状态
  async reuseAction() {
    const card_id = this.get("card_id");
    const username = this.cookie('username');

    try {
      if (!card_id) {
        throw new Error(this.config('errors').param_type);
      }

      const resetRes = await this.card.reuseCard(card_id, username, Date.now());

      return this.json({
        status: "success",
        data: resetRes
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch cardlist=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 停用卡片: 同样调用update card model，更新status字段
  async stopAction() {
    const card_id = this.get("card_id");
    const username = this.cookie('username');

    try {
      if (!card_id) {
        throw new Error(this.config('errors').param_type);
      }

      await this.card.stopCard(card_id, username, Date.now());
      return this.json({
        status: "success"
      })
    } catch (err) {
      console.log(err.message, `=========error happended when stop card ${card_id}=========`);
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async deleteAction() {
    const card_id = this.get('card_id');
    const username = this.cookie('username');

    try {
      if (!card_id) {
        throw new Error(this.config('erros').param_value);
      }
      await this.card.deleteCard(card_id, username, Date.now());

      return this.json({
        status: "success"
      });
    } catch (err) {
      console.log(err.message, `=========error happended when delete card ${card_id} =========`);
      return this.json({
        status: "failed",
        message: err.message
      });
    }
  }

  // 列表接口
  async listAction() {
    const querys = this.get();
    const username = this.cookie('username');
    try {
      const list_res = await this.card.getCardList(querys, username);

      return this.json({
        status: "success",
        data: list_res
      })
    } catch (err) {
      console.log(err.message, '=========error happended when fetch cardlist=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  async optionAction() {
    const inputId = this.get('id');

    try {
      const option_res = await this.card.getCardOptions(inputId);

      return this.json({
        status: "success",
        data: option_res
      });
    } catch (err) {
      console.log(err.message, '=========error happended when fetch cardoptions=========');
      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // async updateAction() {
  //   try {
  //     if (!this.isCli) {
  //       return this.fail(100, 'deny');
  //     }


  //   } catch (err) {

  //   }
  // }
}
