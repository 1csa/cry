const moment = require('moment');

module.exports = class extends think.Controller {
  constructor(...args) {
    super(...args);

    const db = think.env === 'production' ? 'mongo_editor' : 'mongo_10';

    this.articleMonitorModel = this.model('app/hotpool/article_monitor', db);
    this.operateLogModel = this.model('app/hotpool/operate_log', db);
  }

  async indexAction() {
    const query = this.get();
    const data = this.post();

    // http://dev.yidian-inc.com:4000/api/app/hotpool/records?logType=events

    // 文章监控，文章踢出记录
    if (query.logType === 'article_monitor' || data.logType === 'article_monitor') {
      return this.handleArticleMonitorLog();
    }

    // 事件列表，1. 用于「操作记录模块」 2. 后端需要读取数据库做更改 merge
    if (query.logType === 'events' || data.logType === 'events') {
      return this.handleEventsLog();
    }
  }

  // mock findAndModify
  // https://docs.mongodb.com/v3.0/tutorial/create-an-auto-incrementing-field/
  async getNextSequence(name) {
    await this.countersModel.where({ _id: name }).increment('seq', 1);
    const ret = await this.countersModel.where({ _id: name }).find();
    return ret.seq;
  }

  // 把不为空的字段组合成查询条件
  getConditionWithoutEmptyField(obj, excludeKeys) {
    const condition = {};
    for (const key in obj) {
      if (obj[key] !== '' && excludeKeys.indexOf(key) === -1) {
        condition[key] = obj[key];
      }
    }
    return condition;
  }

  async handleEventsLog() {
    const method = this.ctx.method.toUpperCase();
    const query = this.get();
    const data = this.post();

    if (method === 'POST' && Object.keys(data).length > 0) {
      Object.assign(data, {
        updateTime: new Date(),
        username: this.cookie('username'),
        // userid 和 nickname 暂不存储，有接口获取
        // userid: self.cookie('userid'),
        // nickname: this.cookie('nickname'),
      });

      console.log('+++++++++++++');
      console.log(data);
      console.log('+++++++++++++');

      // 获取 id 自增值
      // const logid = await this.getNextSequence('logid');

      try {
        await this.operateLogModel.add(data);

        return this.json({
          code: 0,
          message: 'add operate log success',
        });
      } catch (e) {
        return this.json({
          code: -1,
          message: 'add operate log failed: ' + e.toString,
        });
      }
    } else if (method === 'GET' && Object.keys(query).length > 0) {
      return this.getOperateLog();
    } else {
      return this.json({
        code: -1,
        message: '参数或请求不合法',
      });
    }
  }

  async handleArticleMonitorLog() {
    const method = this.ctx.method.toUpperCase();
    const query = this.get();
    const data = this.post();

    if (method === 'POST' && Object.keys(data).length > 0) {
      Object.assign(data, {
        updateTime: new Date(),
        username: this.cookie('username'),
      });

      try {
        await this.articleMonitorModel.add(data);

        return this.json({
          code: 0,
          message: 'add article log success',
        });
      } catch (e) {
        return this.json({
          code: -1,
          message: 'add article log failed: ' + e.toString,
        });
      }
    } else if (method === 'GET' && Object.keys(query).length > 0) {
      const ret = await this.articleMonitorModel.field('docId').select();

      return this.json({
        code: 0,
        message: 'success',
        data: ret.map(item => item.docId),
      });
    } else {
      return this.json({
        code: -1,
        message: '参数或请求不合法',
      });
    }
  }

  async getOperateLog() {
    const query = this.get();
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;

    const condition = this.getConditionWithoutEmptyField(query, [
      'pageNum',
      'pageSize',
      'startTime',
      'endTime',
      'logType',
    ]);

    if (query.startTime && query.endTime) {
      condition.updateTime = {
        '>=': new Date(query.startTime),
        '<=': new Date(query.endTime),
      };
    }

    console.log('+===========');
    console.log(condition);

    try {
      const total = await this.operateLogModel.where(condition).count('_id');
      const ret = await this.operateLogModel
        .where(condition)
        .order('updateTime DESC')
        .page(pageNum, pageSize)
        .select();

      ret.map(item => {
        item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
      });

      return this.json({
        code: 0,
        message: 'success',
        data: ret,
        total,
      });
    } catch (e) {
      return this.json({
        code: -1,
        message: e,
      });
    }
  }
};
