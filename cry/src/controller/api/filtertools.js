const Base = require('../base');
const moment = require('moment')
const axios = require('axios');
const isDev = think.env === 'development';
const apiServerA4 = 'http://a4.go2yd.com/Website';
const apiLogOnline = 'http://m.v.yidian-inc.com/auth';
const apiLogTest = 'http://test.m.yidian-inc.com/auth';
const DingTalkUrl = 'https://oapi.dingtalk.com';
const apiLog = isDev ? apiLogTest : apiLogOnline;
module.exports = class extends Base {

  // 切换环境
  changeDev(data) {
    const allModel = {};
    let db = 'mongo_10';
    let db2 = 'mongo_10';
    if (data.isdev && data.isdev !== 'true') {
      db = 'mongo_editor';
      db2 = 'mongo_meta_data';
    }
    allModel.filterToolsModel = this.mongo('app/filtertools/filter', db);
    allModel.appidModel = this.mongo('app/filtertools/appid', db2);
    return allModel;
  }
  // 获取城市列表
  async getCityListAction() {
    try {
      const {
        data: { status, result, code },
      } = await axios({
        method: 'get',
        url: `${apiServerA4}/talk/get-city-info`,
        params: {
          key: '28095ff68523ee55c358bc5bd8a1f259',
        },
      });
      this.body = {
        result,
        status,
        code,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }

  // 获取所有过滤策略覆盖用户设置表
  async getUserCoverAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllUserCover();
      this.body = {
        code: 0,
        status: 'success',
        result: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 删除过滤策略覆盖用户数据
  async deleteUserCoverAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    // data.lastmodified = Date.now();
    // data.deleteStatus = true;
    if (data.debug) {
      delete data.debug;
    }
    // console.log(data);
    if (data.groupId) {
      try {
        // 通过groupId精确查找，确保推送被删除数据信息
        const newData = await allModel.filterToolsModel.getUserCoverById(data.groupId)
        newData[0].lastmodified = Date.now();
        newData[0].deleteStatus = true;
        this.msgToDingTalk({ ...newData[0], userName: data.userName }, null, 'userCover', '过滤策略覆盖用户删除')
        const ret = await allModel.filterToolsModel.deleteUserCover(newData[0]);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 增加过滤策略覆盖用户数据
  async addUserCoverAction() {
    const data = this.post();
    // copy接收到的数据
    const newData = { ...data };
    // 判断service字段是否为空，且是否为多个字段
    if (newData.service && newData.service.length !== 0 && newData.service.indexOf(',') !== -1) {
      newData.service = newData.service.split(',')
      // 遍历数组 删除为空无效字段
      newData.service.forEach((item, index) => {
        if (item.length === 0) {
          newData.service.splice(index, 1)
        }
      });
    } else if (newData.service && newData.service.length !== 0) {
      newData.service = [].push(newData.service)
    }
    const allModel = this.changeDev(this.get());
    const group = [];
    try {
      const groupIds = await allModel.filterToolsModel.getAllUserCoverGroupId();
      groupIds.map(item => {
        group.push(item.groupId);
      });
      newData.lastmodified = Date.now();
      newData.groupId = (Math.max(...group) + 1).toString();
      if (newData.debug) {
        delete newData.debug;
      }
      this.msgToDingTalk(newData, null, 'userCover', '过滤策略覆盖用户添加')
      // 数据库不能添加userName字段
      // 钉钉通知需要确定操作人
      if (newData.userName) {
        delete newData.userName
      }
      const ret = await allModel.filterToolsModel.addUserCover(newData);
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
        result: newData,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 更新过滤策略覆盖用户数据
  async updateUserCoverAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    data.lastmodified = Date.now();
    if (data.debug) {
      delete data.debug;
    }
    // console.log(data);
    if (data.groupId) {
      try {
        const res = await allModel.filterToolsModel.getUserCoverById(data.groupId);
        this.msgToDingTalk(data, res[0], 'userCover', '过滤策略覆盖用户更新')
        if (data.userName) {
          delete data.userName
        }
        const ret = await allModel.filterToolsModel.updateUserCover(data);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 搜索过滤策略覆盖用户数据
  async searchUserCoverAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.searchUserCover(data.keywords);
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
  // 通过groupId搜索过滤策略覆盖用户数据
  async searchUserCoverByIdAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.getUserCoverById(data.id);
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
  // 获取所有渠道号
  async getAllUserRiseCSAction() {
    try {
      const ret = await this.userRiseCSModel.getAllUserRiseCS();
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
  // 获取所有appid
  async getAllAppidAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.appidModel.getAllAppid();
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
  // 添加appid
  async addAppidAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    if (data.appid) {
      try {
        const ret = await allModel.appidModel.getAllAppid();
        if (ret.appid.includes(data.appid)) {
          this.body = {
            code: -1,
            status: 'failed',
            message: 'appid已经存在，不需要重复添加',
          };
        } else {
          ret.appid.push(data.appid);
          const updatetime = new Date();
          const ret2 = await allModel.appidModel.addAppid(ret.appid, updatetime);
          this.body = {
            code: 0,
            status: 'success',
            data: ret2,
          };
        }
      } catch (e) {
        this.body = {
          code: -1,
          status: 'failed',
          message: e.toString(),
        };
      }
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 获取所有图文过滤规则
  async getAllNewsRulesAction() {
    const data = this.get()
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllNewsRules(data.current , data.pageSize);
      this.body = {
        code: 0,
        status: 'success',
        result: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 获取所有图文过滤规则导出数据
  async getAllNewsRulesExportAction() {
    const data = this.get()
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllNewsRulesExport();
      this.body = {
        code: 0,
        status: 'success',
        result: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 获取所有图文过滤规则名称
  async getAllNewsRulesNameAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllNewsRulesName();
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
  // 搜索图文过滤规则名称
  async searchNewsRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.searchNewsRule(data.keywords);
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
  // 根据id搜索图文过滤规则
  async searchNewsRuleByIdAction() {
    const data = this.post()
    console.log(data , 'data')
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.getNewsRuleById(data)
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
      };
    } catch (err) {
      this.body = {
        code: -1,
        status: 'failed',
        message: err.toString(),
      };
    }
  }
  // 删除图文过滤规则
  async deleteNewsRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    if (data.ruleId) {
      const newData = await allModel.filterToolsModel.getNewsDeleteById(data.ruleId);
      newData[0].lastmodified = Date.now();
      newData[0].newsDelStatus = true;
      this.msgToDingTalk({ ...newData[0], userName: data.userName }, null, 'newsRule', '图文过滤规则删除')
      try {
        const ret = await allModel.filterToolsModel.deleteNewsRules(newData[0]);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 添加图文过滤规则
  async addNewsRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    const group = [];
    try {
      const groupIds = await allModel.filterToolsModel.getAllNewsRuleId();
      groupIds.map(item => {
        group.push(item.ruleId);
      });
      data.lastmodified = Date.now();
      data.ruleId = (Math.max(...group) + 1).toString();
      if (data.debug) {
        delete data.debug
      }
      this.msgToDingTalk(data, null, 'newsRule', '图文过滤规则添加')
      // 避免破坏现有表结构 在保存前删除userName字段
      if (data.userName) {
        delete data.userName
      }
      const ret = await allModel.filterToolsModel.addNewsRule(data);
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
        result: data,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 更新图文过滤规则
  async updateNewsRuleAction() {
    const data = this.post();

    const allModel = this.changeDev(this.get());
    data.lastmodified = Date.now();
    // console.log(data);
    if (data.ruleId) {
      try {
        // 通过id获取更新前的数据对比
        const editBefore = await allModel.filterToolsModel.getNewsEditById(data.ruleId)
        this.msgToDingTalk(data, editBefore[0], 'newsRule', '图文过滤规则更新')
        // 避免破坏现有表结构 在保存前删除userName字段
        if (data.userName) {
          delete data.userName
        }
        const ret = await allModel.filterToolsModel.updateNewsRule(data);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 获取所有视频过滤规则
  async getAllVideoRulesAction() {
    const data = this.get()
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllVideoRules(data.current , data.pageSize);
      this.body = {
        code: 0,
        status: 'success',
        result: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 获取所有视频过滤规则 导出的数据
  async getAllVideoRulesExportAction() {
    const data = this.get()
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllVideoRulesExport();
      this.body = {
        code: 0,
        status: 'success',
        result: ret,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 搜索视频过滤规则名称
  async searchVideoRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.searchVideoRule(data.keywords);
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
  // 根据id搜索视频过滤规则
  async searchVideoRuleByIdAction() {
    const data = this.post()
    const allModel = this.changeDev(this.get());
    try {
      const ret = await allModel.filterToolsModel.getVideoRuleById(data)
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
      };
    } catch (err) {
      this.body = {
        code: -1,
        status: 'failed',
        message: err.toString(),
      };
    }
  }
  // 获取所有视频过滤规则名称
  async getAllVideoRulesNameAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllVideoRulesName();
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
  // 删除视频过滤规则
  async deleteVideoRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    if (data.ruleId) {
      const newData = await allModel.filterToolsModel.getVideoDeleteRuleById(data.ruleId);
      newData[0].lastmodified = Date.now();
      newData[0].videoDelStatus = true;
      if (newData[0].source) {
        delete newData[0].source
      }
      this.msgToDingTalk({ ...newData[0], userName: data.userName }, null, 'videoRule', '视频过滤规则删除')
      try {
        const ret = await allModel.filterToolsModel.deleteVideoRules(newData[0]);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 添加视频过滤规则
  async addVideoRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    const group = [];
    try {
      const groupIds = await allModel.filterToolsModel.getAllVideoRuleId();
      groupIds.map(item => {
        group.push(item.ruleId);
      });
      data.lastmodified = Date.now();
      data.ruleId = (Math.max(...group) + 1).toString();
      if (data.debug) {
        delete data.debug;
      }
      this.msgToDingTalk(data, null, 'videoRule', '视频过滤规则添加')
      // 避免破坏现有表结构 在保存前删除userName字段
      if (data.userName) {
        delete data.userName
      }
      const ret = await allModel.filterToolsModel.addVideoRule(data);
      this.body = {
        code: 0,
        status: 'success',
        data: ret,
        result: data,
      };
    } catch (e) {
      this.body = {
        code: -1,
        status: 'failed',
        message: e.toString(),
      };
    }
  }
  // 更新视频过滤规则
  async updateVideoRuleAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    data.lastmodified = Date.now();
    if (data.debug) {
      delete data.debug;
    }
    // console.log(data);
    if (data.ruleId) {
      try {
        const editBefore = await allModel.filterToolsModel.getVideoEditRuleById(data.ruleId);
        this.msgToDingTalk(data, editBefore[0], 'videoRule', '视频过滤规则更新')
        // 避免破坏现有表结构 在保存前删除userName字段
        if (data.userName) {
          delete data.userName
        }
        const ret = await allModel.filterToolsModel.updateVideoRule(data);
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
    } else {
      this.body = {
        code: -1,
        status: 'failed',
        message: '参数错误',
      };
    }
  }
  // 获取所有图文过滤阈值
  async getAllNewsThresholdAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllNewsThreshold();
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
  // 更新所有图文过滤阈值
  async updateNewsThresholdAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    data[0].lastmodified = Date.now();
    if (data.debug) {
      delete data.debug;
    }
    try {
      const ret = await allModel.filterToolsModel.updateNewsThreshold(data);
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

  // 获取所有视频过滤阈值
  async getAllVideoThresholdAction() {
    try {
      const allModel = this.changeDev(this.get());
      const ret = await allModel.filterToolsModel.getAllVideoThreshold();
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

  // 更新所有视频过滤阈值
  async updateVideoThresholdAction() {
    const data = this.post();
    const allModel = this.changeDev(this.get());
    data[0].lastmodified = Date.now();
    if (data.debug) {
      delete data.debug;
    }
    try {
      const ret = await allModel.filterToolsModel.updateVideoThreshold(data);
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

  // 获取日志列表
  async getLogsAction() {
    const data = this.get();
    const ids = [];
    // console.log(data);
    try {
      const {
        data: { status, result, code, total },
      } = await axios({
        method: 'get',
        url: `${apiLog}/get_logs`,
        params: data,
      });
      // id换name
      result.map(item => {
        ids.push(item.userid);
      });
      const ret = await axios({
        method: 'get',
        url: 'http://web-api.v.yidian-inc.com/users/pandora/by_userid',
        params: {
          userid: ids.join(','),
        },
      });
      if (ret.data.status === 'success' && ret.data.result.length > 0) {
        ret.data.result.map(item => {
          result.map(k => {
            if (item._id === k.userid) {
              k.nickname = item.nickname;
              k.email = item.name;
            }
          });
        });
      }
      this.body = {
        result,
        status,
        code,
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
  // 需注意 如果日后有更新字段格式或类型需求
  // 需要考虑是否更新以下配置项的代码
  // 防止服务端报错，影响钉钉推送和日常操作正常运行
  // data.text.content's type is string 有空格会导致钉钉消息格式不正确 只能压缩到一行
  async msgToDingTalk(result, editBefore, type, actionType) {
    const access_token_development = 'f7064d2f8ee1ffa9e55574133a87a952dc92324414b90398e7054c20570c94f5'
    const access_token = 'e0e7b5bbfd80d59b72dba1d776a15f7bcfb4e6c34af1ca8453e0c45aee25162f'
    let data = {};
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    // 目前使用此方法配置消息提醒格式，有更优解会优化：）
    if (type === 'userCover') {
      console.log(`操作类型: ${actionType}`)
      if (editBefore === null) {
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\ngroupId：${result.groupId}\n${result.ruleId !== '无' ?
            '图文过滤规则：' + result.ruleId + '\n' : ''}${result.videoId !== '无' ?
            '视频过滤规则：' + result.videoId + '\n' : ''}环境：${result.env}\n操作系统：${result.os}\nappId：${result.appId.include ? '包含' : '不包含'}  ${result.appId.content.join(',')}\n${result.refresh_mode && result.refresh_mode.length > 0 ?
            '刷新模式：' + result.refresh_mode.join(',') + '\n' : ''}${result.age_group !== '无' ?
            '年龄段：' + result.age_group + '\n' : ''}是否仅在 -3 屏可分发：${result.minus3 ? '是' : '否'}\n渠道号：${result.userRiseCS.include ? '包含' : '不包含'}  ${result.userRiseCS.content.join(',')}\n品牌：${result.distribution.join(',')}\n用户维度：${result.userType}\n用户分层：${result.userLabel}\n性别：${result.gender}\n设备型号：${result.brand.include ? '包含' : '不包含'}  ${result.brand.content.join(',')}\n城市：${result.city.include ? '包含' : '不包含'}  ${result.city.content === 'all' ? '全国' : result.city.content}\n是否在核心城市可分发：${result.cityCore ? '是' : '否'}\n设备型号：${result.bucket.include ? '包含' : '不包含'}  ${result.bucket.content}\n操作时间：${date}\n操作人：${result.userName}`,
          }
        }
      } else {
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\n groupId：${result.groupId} \n${result.ruleId !== '无' ? result.ruleId !== editBefore.ruleId ?
            '图文过滤规则：更新前：' + editBefore.ruleId + ';' +
            '更新后：' + result.ruleId + '\n' : '图文过滤规则：' + result.ruleId + ' \n' : ''}${result.videoId !== '无' ? result.videoId !== editBefore.videoId ?
            '视频过滤规则：更新前：' + editBefore.videoId + ';' +
            '更新后：' + result.videoId + '\n' : '视频过滤规则：' + result.videoId + ' \n' : ''}${result.env !== 'all' ? result.env !== editBefore.env ?
            '环境：更新前：' + editBefore.env + ';' +
            '更新后：' + result.env : '环境：' + result.env + ' \n' : ''}${result.os !== 'all' ? result.os !== editBefore.os ?
            '操作系统：更新前：' + editBefore.os + ';' +
            '更新后：' + result.os : '操作系统：' + result.os + ' \n' : ''}appId：${result.appId.include ? '包含' : '不包含'} ${result.appId.content.join(',') !== editBefore.appId.content.join(',') ?
            '更新前：' + editBefore.appId.content.join(',') + ';' +
            '更新后：' + result.appId.content.join(',') + ' \n' : result.appId.content.join(',') + ' \n'}${editBefore.refresh_mode && result.refresh_mode && result.refresh_mode.join(',') !== editBefore.refresh_mode.join(',') ?
            '刷新模式：更新前：' + editBefore.refresh_mode.join(',') + ';' +
            '更新后：' + result.refresh_mode.join(',') : result.refresh_mode && result.refresh_mode.length > 0 ? '刷新模式：' + result.refresh_mode.join(',') + '\n' : ''}${editBefore.age_group && result.age_group && result.age_group !== editBefore.age_group ?
            '年龄段：更新前：' + editBefore.age_group + ';' +
            '更新后：' + result.age_group : result.age_group !== '无' ? '年龄段：' + result.age_group + '\n' : ''}${result.minus3 ? '是否仅在 -3 屏可分发：是' : '是否仅在 -3 屏可分发：否'} \n${result.userRiseCS.include ? '渠道号：包含' : '渠道号：不包含'}  ${result.userRiseCS.content.join(',')} \n${'品牌：' + result.distribution.join(',')} \n${'用户维度：' + result.userType} \n用户分层：${result.userLabel} \n${'性别：' + result.gender} \n${result.brand.include ? '设备型号：包含' : '设备型号：不包含'}  ${result.brand.content.join(',')} \n${result.city.include ? '城市：包含' : '城市：不包含'}  ${result.city.content === 'all' ? '全国' : result.city.content} \n${result.cityCore ? '是否在核心城市可分发：是' : '是否在核心城市可分发：否'} \n${result.bucket.include ? 'bucket：包含' : 'bucket：不包含'}  ${result.bucket.content} \n${'操作时间：' + date} \n${'操作人：' + result.userName}`,
          }

        }
      }
    } else if (type === 'videoRule') {
      console.log(`操作类型: ${actionType}`)
      if (editBefore === null) {
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\n规则ID：${result.ruleId}\n过滤规则：${result.name}\n规则说明：${result.desc !== "" ? result.desc : '请补全说明'}\n涉领导人：${result.security.length > 0 ? result.security.join(',') : '空'}\n频道黑/白名单：${result.channelList.type}\n具体频道黑/白名单：${result.channelList.content.length > 0 ? result.channelList.content.join(',') : '空'}\n逻辑：${result.logic}\n${result.vct !== "" ?
            '一级分类：' + result.vct + '\n' : ''}${result.vsct !== "" ?
            '二级分类：' + result.vsct + '\n' : ''}${result.ncat_class !== "" ?
            '新一级分类：' + result.ncat_class + '\n' : ''}${result.nsubcat_class !== "" ?
            '新二级分类：' + result.nsubcat_class + '\n' : ''}${result.ttkey !== "" ?
            '标题关键词：共配置' + result.ttkey.split(',').length + '个\n' : ''}${result.video_tags.length > 0 ?
            '标签：共配置' + result.video_tags.length + '个\n' : ''}低俗/血腥/重口味标签：${result.dirtyTag ? '是' : '否'}\n轻度低俗：${result.mild_dirty ? '是' : '否'}\n${result.vlevel !== '无' ?
            '视频等级：' + result.vlevel + '\n' : ''}${result.new_sourcelevel && result.new_sourcelevel.length > 0 ?
            '自媒体等级：' + result.new_sourcelevel.join(',') + '\n' : ''}${result.batch > -1 ?
            '控制刷数：' + result.batch + '\n' : ''}${result.blur > 0 ?
            '一点模糊图：' + result.blur + '\n' : ''}${result.unclarity > 0 ?
            '百度模糊图：' + result.unclarity + '\n' : ''}${result.yd_porny.length > 0 ?
            '自研色情图：' + result.yd_porny.join(',') + '\n': ''}${result.micro_yd_porny.length > 0 ?
            '小视频自研色情图：' + result.micro_yd_porny.join(',') + '\n': ''}${result.yd_sexy.length > 0 ?
            '自研低俗图：' + result.yd_sexy.join(',') + '\n': ''}${result.micro_yd_sexy.length > 0 ?
            '小视频自研低俗图：' + result.yd_sexy.join(',') + '\n': ''}${result.title_quality.length > 0 ?
            '视频标题低质：' + result.title_quality.join(',') + '\n': ''}${result.micro_title_quality.length > 0 ?
            '小视频标题低质：' + result.micro_title_quality.join(',') + '\n': ''}${result.sc_dirty > 0 ?
            '标题低俗：' + result.sc_dirty + '\n' : ''}${result.micro_sc_dirty > 0 ?
            '小视频标题低俗：' + result.micro_sc_dirty + '\n' : ''}${result.bait > 0 ?
            '标题党：' + result.bait + '\n' : ''}${result.duration > 0 ?
            '视频时长过滤：' + result.duration + '\n' : ''}${result.micro_duration > 0 ?
            '小视频时长过滤：' + result.micro_duration + '\n' : ''}${result.micro_bait > 0 ?
            '小视频标题党：' + result.micro_bait + '\n' : ''}${result.sick > 0 ?
            '标题重口：' + result.sick + '\n' : ''}${result.micro_sick > 0 ?
            '小视频标题重口：' + result.micro_sick + '\n' : ''}${result.c_imgs_dirty > 0 ?
            '低俗图：' + result.c_imgs_dirty + '\n' : ''}${result.micro_c_imgs_dirty > 0 ?
            '小视频低俗图：' + result.micro_c_imgs_dirty + '\n' : ''}${result.c_imgs_sexy > 0 ?
            '涉性图：' + result.c_imgs_sexy + '\n' : ''}${result.micro_c_imgs_sexy > 0 ?
            '小视频涉性图：' + result.micro_c_imgs_sexy + '\n' : ''}${result.c_imgs_disgusting > 0 ?
            '恶心图：' + result.c_imgs_disgusting + '\n' : ''}${result.micro_c_imgs_disgusting > 0 ?
            '小视频恶心图：' + result.micro_c_imgs_disgusting + '\n' : ''}${result.female_sexy > 0 ?
            '女性性感图：' + result.female_sexy + '\n' : ''}${result.micro_female_sexy > 0 ?
            '小视频女性性感图：' + result.micro_female_sexy + '\n' : ''}${result.male_sexy > 0 ?
            '男性性感图：' + result.male_sexy + '\n' : ''}${result.micro_male_sexy > 0 ?
            '小视频男性性感图：' + result.micro_male_sexy + '\n' : ''}${result.intimacy > 0 ?
            '亲密行为图：' + result.intimacy + '\n' : ''}${result.micro_intimacy > 0 ?
            '小视频亲密行为图：' + result.micro_intimacy + '\n' : ''}${result.yd_general_sexy > 0 ?
            '自研一般性感图：' + result.yd_general_sexy + '\n' : ''}${result.micro_yd_general_sexy > 0 ?
            '小视频自研一般性感图：' + result.micro_yd_general_sexy + '\n' : ''}${result.yd_disgusting > 0 ?
            '自研重口味图：' + result.yd_disgusting + '\n' : ''}${result.micro_yd_disgusting > 0 ?
            '小视频自研重口味图：' + result.micro_yd_disgusting + '\n' : ''}${result.yd_intimacy > 0 ?
            '自研亲密行为图：' + result.yd_intimacy + '\n' : ''}${result.micro_yd_intimacy > 0 ?
            '小视频自研亲密行为图：' + result.micro_yd_intimacy + '\n' : ''}${result.over_image_baidu_unclarity > 0 ?
            '封面模糊图：' + result.over_image_baidu_unclarity + '\n' : ''}${result.cover_stretch > 0 ?
            '封面拉伸：' + result.cover_stretch + '\n' : ''}${result.micro_cover_stretch > 0 ?
            '小视频封面拉伸：' + result.micro_cover_stretch + '\n' : ''}${result.cover_frame > 0 ?
            '封面边框：' + result.cover_frame + '\n' : ''}${result.micro_cover_frame > 0 ?
            '小视频封面边框：' + result.micro_cover_frame + '\n' : ''}${result.cover_mosaic_piece > 0 ?
            '封面马赛克块数：' + result.cover_mosaic_piece + '\n' : ''}${result.micro_cover_mosaic_piece > 0 ?
            '小视频封面马赛克块数：' + result.micro_cover_mosaic_piece + '\n' : ''}${result.cover_mosaic_proportion > 0 ?
            '封面马赛克面积：' + result.cover_mosaic_proportion + '\n' : ''}${result.micro_cover_mosaic_proportion > 0 ?
            '小视频封面马赛克面积：' + result.micro_cover_mosaic_proportion + '\n' : ''}${result.micro_over_image_baidu_unclarity > 0 ?
            '小视频封面模糊图：' + result.micro_over_image_baidu_unclarity + '\n' : ''}${result.over_image_blur > 0 ?
            '自研封面模糊图：' + result.over_image_blur + '\n' : ''}${result.micro_over_image_blur > 0 ?
            '小视频自研封面模糊图：' + result.micro_over_image_blur + '\n' : ''}${result.cover_image_yd_sexy > 0 ?
            '自研封面性感图：' + result.cover_image_yd_sexy + '\n' : ''}${result.micro_cover_image_yd_sexy > 0 ?
            '小视频自研封面性感图：' + result.micro_cover_image_yd_sexy + '\n' : ''}${result.video_image_baidu_unclarity > 0 ?
            '百度视频内容模糊图：' + result.video_image_baidu_unclarity + '\n' : ''}${result.yd_porny_animal > 0 ?
            '自研动物交配模型：' + result.yd_porny_animal + '\n' : ''}${result.micro_yd_porny_animal > 0 ?
            '小视频自研动物交配模型：' + result.micro_yd_porny_animal + '\n' : ''}${result.micro_video_image_baidu_unclarity > 0 ?
            '小视频百度视频内容模糊图：' + result.micro_video_image_baidu_unclarity + '\n' : ''}${result.video_image_blur > 0 ?
            '自研视频封面模糊图：' + result.video_image_blur + '\n' : ''}${result.video_image_blur > 0 ?
            '小视频自研视频封面模糊图：' + result.micro_video_image_blur + '\n' : ''}是否保护编辑操作内容：${result.editorProtect ? '是' : '否'}\n人审内容保护：${result.review_protect ? '是' : '否'}\n历史内容映射：${result.enable_derives ? '是' : '否'}\n过滤的自媒体类型：${result.wemediaType.length > 0 ? result.wemediaType.join(',') : '空'}\n审核内容过滤：${result.topview_quality_tags.length > 0 ? result.topview_quality_tags.join(',') : '空'}\n是否豁免文章：${result.filter_escape.length > 0 ? result.filter_escape.join(',') : '空'}\n白名单账号数量：${result.protect_source.length > 0 ? '共配置' + result.protect_source.length + '个' : '空'}\n自媒体ID数量：${result.wm_ids.length > 0 ? '共配置' + result.wm_ids.length + '个' : '空'}\n可分发时长：${typeof result.distributionTime === 'number' ? result.distributionTime + '小时' : '未配置可分发时长，长期有效'}\n操作时间：${date}\n操作人：${result.userName}`,
          }
        }
      } else {
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\n规则ID：${result.ruleId}\n${result.name!==editBefore.name?
            '过滤规则：\n更新前：'+editBefore.name+';\n'+
            '更新后：'+result.name:'过滤规则：'+result.name}\n规则说明：${result.desc !== "" ? result.desc+'\n' : '请补全说明\n'}${result.security.length > 0 ? '涉领导人：'+result.security.join(',')+'\n' : ''}${result.channelList.type!==editBefore.channelList.type?
            '频道黑/白名单：\n更新前：'+editBefore.channelList.type+';\n'+
            '更新后'+result.channelList.type:'频道黑/白名单：'+result.channelList.type}\n${result.channelList.content.length > 0?editBefore.channelList.content.join(',')!==result.channelList.content.join(',')?
            '具体频道黑/白名单：\n更新前：'+editBefore.channelList.content.join(',')+';\n'+
            '更新后：'+ result.channelList.content.join(',')+'\n': '具体频道黑/白名单：'+result.channelList.content.join(',')+'\n':''}逻辑：${result.logic}\n${result.vct !== ""?result.vct!==editBefore.vct?
            '一级分类：更新前：'+editBefore.vct+';'+
            '更新后：'+result.vct+'\n':
            '一级分类：'+result.vct+'\n' : ''}${result.vsct !== ""?result.vsct!==editBefore.vsct?
            '二级分类：更新前：'+editBefore.vsct+';'+
            '更新后：'+result.vsct+'\n':
            '二级分类：'+result.vsct+'\n' : ''}${result.ncat_class !== ""?result.ncat_class!==editBefore.ncat_class?
            '新一级分类：更新前：'+editBefore.ncat_class+';'+
            '更新后：'+result.ncat_class+'\n':
            '新一级分类：'+result.ncat_class+'\n' : ''}${result.nsubcat_class !== ""?result.nsubcat_class!==editBefore.nsubcat_class?
            '新二级分类：更新前：'+editBefore.nsubcat_class+';'+
            '更新后：'+result.nsubcat_class+'\n':
            '新二级分类：'+result.nsubcat_class+'\n' : ''}${result.ttkey !== "" ?
            '标题关键词：共配置' + result.ttkey.split(',').length + '个'+'\n' : ''}${result.video_tags.length > 0 ?
            '标签：共配置' + result.video_tags.length + '个'+'\n' : ''}低俗/血腥/重口味标签：${result.dirtyTag ? '是' : '否'}\n轻度低俗：${result.mild_dirty ? '是' : '否'}\n${result.vlevel!=='无'?result.vlevel!==editBefore.vlevel?
            '视频等级：更新前：'+editBefore.vlevel+';'+
            '更新后：'+result.vlevel+'\n':
            '视频等级：'+result.vlevel+'\n':''}${result.new_sourcelevel && result.new_sourcelevel.length>0?editBefore.new_sourcelevel.join(',')!==result.new_sourcelevel.join(',')?
            '自媒体等级：更新前：'+editBefore.new_sourcelevel.join(',')+';'+
            '更新后'+result.new_sourcelevel.join(',')+'\n':
            '自媒体等级：'+result.new_sourcelevel.join(',')+'\n': ''}${result.batch > -1?editBefore.batch!==result.batch?
            '控制刷数：更新前：'+editBefore.batch+';'+
            '更新后：'+result.batch+'\n':
            '控制刷数：'+result.batch+'\n': ''}${result.blur > 0?editBefore.blur!==result.blur?
            '一点模糊图：更新前：'+editBefore.blur+';'+
            '更新后：'+result.blur+'\n':
            '一点模糊图：'+result.blur+'\n': ''}${result.unclarity > 0?editBefore.unclarity!==result.unclarity?
            '百度模糊图：更新前：'+editBefore.unclarity+';'+
            '更新后：'+result.unclarity+'\n':
            '百度模糊图：'+result.unclarity+'\n': ''}${result.title_quality && result.title_quality.length>0?editBefore.title_quality.join(',')!==result.title_quality.join(',')?
            '视频标题低质：更新前：'+editBefore.title_quality.join(',')+';'+
            '更新后'+result.title_quality.join(',')+'\n':
            '视频标题低质：'+result.title_quality.join(',')+'\n': ''}${result.micro_title_quality && result.micro_title_quality.length>0?editBefore.micro_title_quality.join(',')!==result.micro_title_quality.join(',')?
            '小视频标题低质：更新前：'+editBefore.micro_title_quality.join(',')+';'+
            '更新后'+result.micro_title_quality.join(',')+'\n':
            '小视频标题低质：'+result.micro_title_quality.join(',')+'\n': ''}${result.sc_dirty > 0 ?editBefore.sc_dirty!==result.sc_dirty?
            '标题低俗：更新前：'+editBefore.sc_dirty+';'+
            '更新后：'+result.sc_dirty+'\n':
            '标题低俗：'+result.sc_dirty+'\n': ''}${result.micro_sc_dirty > 0 ?editBefore.micro_sc_dirty!==result.micro_sc_dirty?
            '小视频标题低俗：更新前：'+editBefore.micro_sc_dirty+';'+
            '更新后：'+result.micro_sc_dirty+'\n':
            '小视频标题低俗：'+result.micro_sc_dirty+'\n': ''}${result.bait > 0 ?editBefore.bait!==result.bait?
            '标题党：更新前：'+editBefore.bait+';'+
            '更新后：'+result.bait+'\n':
            '标题党：'+result.bait+'\n': ''}${result.micro_bait > 0 ?editBefore.bait!==result.bait?
            '小视频标题党：更新前：'+editBefore.micro_bait+';'+
            '更新后：'+result.micro_bait+'\n':
            '小视频标题党：'+result.micro_bait+'\n': ''}${result.duration > 0 ?editBefore.duration!==result.duration?
            '视频时长过滤：更新前：'+editBefore.duration+';'+
            '更新后：'+result.duration+'\n':
            '视频时长过滤：'+result.duration+'\n': ''}${result.micro_duration > 0 ?editBefore.micro_duration!==result.micro_duration?
            '小视频时长过滤：更新前：'+editBefore.micro_duration+';'+
            '更新后：'+result.micro_duration+'\n':
            '小视频时长过滤：'+result.micro_duration+'\n': ''}${result.sick > 0 ?editBefore.sick!==result.sick?
            '标题重口：更新前：'+editBefore.sick+';'+
            '更新后：'+result.sick+'\n':
            '标题重口：'+result.sick+'\n': ''}${result.cover_stretch > 0 ?editBefore.cover_stretch!==result.cover_stretch?
            '封面拉伸：更新前：'+editBefore.cover_stretch+';'+
            '更新后：'+result.cover_stretch+'\n':
            '封面拉伸：'+result.cover_stretch+'\n': ''}${result.micro_cover_stretch > 0 ?editBefore.micro_cover_stretch!==result.micro_cover_stretch?
            '小视频封面拉伸：更新前：'+editBefore.micro_cover_stretch+';'+
            '更新后：'+result.micro_cover_stretch+'\n':
            '小视频封面拉伸：'+result.micro_cover_stretch+'\n': ''}${result.cover_frame > 0 ?editBefore.cover_frame!==result.cover_frame?
            '封面边框：更新前：'+editBefore.cover_frame+';'+
            '更新后：'+result.cover_frame+'\n':
            '封面边框：'+result.cover_frame+'\n': ''}${result.micro_cover_frame > 0 ?editBefore.micro_cover_frame!==result.micro_cover_frame?
            '小视频封面边框：更新前：'+editBefore.micro_cover_frame+';'+
            '更新后：'+result.micro_cover_frame+'\n':
            '小视频封面边框：'+result.micro_cover_frame+'\n': ''}${result.cover_mosaic_piece > 0 ?editBefore.cover_mosaic_piece!==result.cover_mosaic_piece?
            '封面马赛克块数：更新前：'+editBefore.cover_mosaic_piece+';'+
            '更新后：'+result.cover_mosaic_piece+'\n':
            '封面马赛克块数：'+result.cover_mosaic_piece+'\n': ''}${result.micro_cover_mosaic_piece > 0 ?editBefore.micro_cover_mosaic_piece!==result.micro_cover_mosaic_piece?
            '小视频封面马赛克块数：更新前：'+editBefore.micro_cover_mosaic_piece+';'+
            '更新后：'+result.micro_cover_mosaic_piece+'\n':
            '小视频封面马赛克块数：'+result.micro_cover_mosaic_piece+'\n': ''}${result.cover_mosaic_proportion > 0 ?editBefore.cover_mosaic_proportion!==result.cover_mosaic_proportion?
            '封面马赛克面积：更新前：'+editBefore.cover_mosaic_proportion+';'+
            '更新后：'+result.cover_mosaic_proportion+'\n':
            '封面马赛克面积：'+result.cover_mosaic_proportion+'\n': ''}${result.micro_cover_mosaic_proportion > 0 ?editBefore.micro_cover_mosaic_proportion!==result.micro_cover_mosaic_proportion?
            '小视频封面马赛克面积：更新前：'+editBefore.micro_cover_mosaic_proportion+';'+
            '更新后：'+result.micro_cover_mosaic_proportion+'\n':
            '小视频封面马赛克面积：'+result.micro_cover_mosaic_proportion+'\n': ''}${result.micro_sick > 0 ?editBefore.micro_sick!==result.micro_sick?
            '小视频标题重口：更新前：'+editBefore.micro_sick+';'+
            '更新后：'+result.micro_sick+'\n':
            '小视频标题重口：'+result.micro_sick+'\n': ''}${result.c_imgs_dirty > 0 ?editBefore.c_imgs_dirty!==result.c_imgs_dirty?
            '低俗图：更新前：'+editBefore.c_imgs_dirty+';'+
            '更新后：'+result.c_imgs_dirty+'\n':
            '低俗图：'+result.c_imgs_dirty+'\n': ''}${result.micro_c_imgs_dirty > 0 ?editBefore.micro_c_imgs_dirty!==result.micro_c_imgs_dirty?
            '小视频低俗图：更新前：'+editBefore.micro_c_imgs_dirty+';'+
            '更新后：'+result.micro_c_imgs_dirty+'\n':
            '小视频低俗图：'+result.micro_c_imgs_dirty+'\n': ''}${result.c_imgs_sexy > 0 ?editBefore.c_imgs_sexy!==result.c_imgs_sexy?
            '涉性图：更新前：'+editBefore.c_imgs_sexy+';'+
            '更新后：'+result.c_imgs_sexy+'\n':
            '涉性图：'+result.c_imgs_sexy+'\n': ''}${result.micro_c_imgs_sexy > 0 ?editBefore.micro_c_imgs_sexy!==result.micro_c_imgs_sexy?
            '小视频涉性图：更新前：'+editBefore.micro_c_imgs_sexy+';'+
            '更新后：'+result.micro_c_imgs_sexy+'\n':
            '小视频涉性图：'+result.micro_c_imgs_sexy+'\n': ''}${result.c_imgs_disgusting > 0 ?editBefore.c_imgs_disgusting!==result.c_imgs_disgusting?
            '恶心图：更新前：'+editBefore.c_imgs_disgusting+';'+
            '更新后：'+result.c_imgs_disgusting+'\n':
            '恶心图：'+result.c_imgs_disgusting+'\n': ''}${result.micro_c_imgs_disgusting > 0 ?editBefore.micro_c_imgs_disgusting!==result.micro_c_imgs_disgusting?
            '小视频恶心图：更新前：'+editBefore.micro_c_imgs_disgusting+';'+
            '更新后：'+result.micro_c_imgs_disgusting+'\n':
            '小视频恶心图：'+result.micro_c_imgs_disgusting+'\n': ''}${result.female_sexy > 0 ?editBefore.female_sexy!==result.female_sexy?
            '女性性感图：更新前：'+editBefore.female_sexy+';'+
            '更新后：'+result.female_sexy+'\n':
            '女性性感图：'+result.female_sexy+'\n': ''}${result.micro_female_sexy > 0 ?editBefore.micro_female_sexy!==result.micro_female_sexy?
            '小视频女性性感图：更新前：'+editBefore.micro_female_sexy+';'+
            '更新后：'+result.micro_female_sexy+'\n':
            '小视频女性性感图：'+result.micro_female_sexy+'\n': ''}${result.male_sexy > 0 ?editBefore.male_sexy!==result.male_sexy?
            '男性性感图：更新前：'+editBefore.male_sexy+';'+
            '更新后：'+result.male_sexy+'\n':
            '男性性感图：'+result.male_sexy+'\n': ''}${result.micro_male_sexy > 0 ?editBefore.micro_male_sexy!==result.micro_male_sexy?
            '小视频男性性感图：更新前：'+editBefore.micro_male_sexy+';'+
            '更新后：'+result.micro_male_sexy+'\n':
            '小视频男性性感图：'+result.micro_male_sexy+'\n': ''}${result.intimacy > 0 ?editBefore.intimacy!==result.intimacy?
            '亲密行为图：更新前：'+editBefore.intimacy+';'+
            '更新后：'+result.intimacy+'\n':
            '亲密行为图：'+result.intimacy+'\n': ''}${result.micro_intimacy > 0 ?editBefore.micro_intimacy!==result.micro_intimacy?
            '小视频亲密行为图：更新前：'+editBefore.micro_intimacy+';'+
            '更新后：'+result.micro_intimacy+'\n':
            '小视频亲密行为图：'+result.micro_intimacy+'\n': ''}${result.yd_porny > 0 ?editBefore.yd_porny!==result.yd_porny?
            '自研色情图：更新前：'+editBefore.yd_porny+';'+
            '更新后：'+result.yd_porny+'\n':
            '自研色情图：'+result.yd_porny+'\n': ''}${result.micro_yd_porny > 0 ?editBefore.micro_yd_porny!==result.micro_yd_porny?
            '小视频自研色情图：更新前：'+editBefore.micro_yd_porny+';'+
            '更新后：'+result.micro_yd_porny+'\n':
            '小视频自研色情图：'+result.micro_yd_porny+'\n': ''}${result.yd_sexy > 0 ?editBefore.yd_sexy!==result.yd_sexy?
            '自研低俗图：更新前：'+editBefore.yd_sexy+';'+
            '更新后：'+result.yd_sexy+'\n':
            '自研低俗图：'+result.yd_sexy+'\n': ''}${result.micro_yd_sexy > 0 ?editBefore.micro_yd_sexy!==result.micro_yd_sexy?
            '小视频自研低俗图：更新前：'+editBefore.micro_yd_sexy+';'+
            '更新后：'+result.micro_yd_sexy+'\n':
            '小视频自研低俗图：'+result.micro_yd_porny+'\n': ''}${result.yd_general_sexy > 0 ?editBefore.yd_general_sexy!==result.yd_general_sexy?
            '自研一般性感图：更新前：'+editBefore.yd_general_sexy+';'+
            '更新后：'+result.yd_general_sexy+'\n':
            '自研一般性感图：'+result.yd_general_sexy+'\n': ''}${result.micro_yd_general_sexy > 0 ?editBefore.micro_yd_general_sexy!==result.micro_yd_general_sexy?
            '小视频自研一般性感图：更新前：'+editBefore.micro_yd_general_sexy+';'+
            '更新后：'+result.micro_yd_general_sexy+'\n':
            '小视频自研一般性感图：'+result.micro_yd_general_sexy+'\n': ''}${result.yd_disgusting > 0 ?editBefore.yd_disgusting!==result.yd_disgusting?
            '自研重口味图：更新前：'+editBefore.yd_disgusting+';'+
            '更新后：'+result.yd_disgusting+'\n':
            '自研重口味图：'+result.yd_disgusting+'\n': ''}${result.micro_yd_disgusting > 0 ?editBefore.micro_yd_disgusting!==result.micro_yd_disgusting?
            '小视频自研重口味图：更新前：'+editBefore.micro_yd_disgusting+';'+
            '更新后：'+result.micro_yd_disgusting+'\n':
            '小视频自研重口味图：'+result.micro_yd_disgusting+'\n': ''}${result.yd_intimacy > 0 ?editBefore.yd_intimacy!==result.yd_intimacy?
            '自研亲密行为图：更新前：'+editBefore.yd_intimacy+';'+
            '更新后：'+result.yd_intimacy+'\n':
            '自研亲密行为图：'+result.yd_intimacy+'\n': ''}${result.micro_yd_intimacy > 0 ?editBefore.micro_yd_intimacy!==result.micro_yd_intimacy?
            '小视频自研亲密行为图：更新前：'+editBefore.micro_yd_intimacy+';'+
            '更新后：'+result.micro_yd_intimacy+'\n':
            '小视频自研亲密行为图：'+result.micro_yd_intimacy+'\n': ''}${result.yd_porny_animal > 0 ?editBefore.yd_porny_animal!==result.yd_porny_animal?
            '自研动物交配模型：更新前：'+editBefore.yd_porny_animal+';'+
            '更新后：'+result.yd_porny_animal+'\n':
            '自研动物交配模型：'+result.yd_porny_animal+'\n': ''}${result.micro_yd_porny_animal > 0 ?editBefore.micro_yd_porny_animal!==result.micro_yd_porny_animal?
            '小视频自研动物交配模型：更新前：'+editBefore.micro_yd_porny_animal+';'+
            '更新后：'+result.micro_yd_porny_animal+'\n':
            '小视频自研动物交配模型：'+result.micro_yd_porny_animal+'\n': ''}${result.over_image_baidu_unclarity > 0 ?editBefore.over_image_baidu_unclarity!==result.over_image_baidu_unclarity?
            '封面模糊图：更新前：'+editBefore.over_image_baidu_unclarity+';'+
            '更新后：'+result.over_image_baidu_unclarity+'\n':
            '封面模糊图：'+result.over_image_baidu_unclarity+'\n': ''}${result.micro_over_image_baidu_unclarity > 0 ?editBefore.micro_over_image_baidu_unclarity!==result.micro_over_image_baidu_unclarity?
            '小视频封面模糊图：更新前：'+editBefore.micro_over_image_baidu_unclarity+';'+
            '更新后：'+result.micro_over_image_baidu_unclarity+'\n':'小视频封面模糊图：'+result.micro_over_image_baidu_unclarity+'\n': ''}${result.over_image_blur > 0 ?editBefore.over_image_blur!==result.over_image_blur?
            '自研封面模糊图：更新前：'+editBefore.over_image_blur+';'+
            '更新后：'+result.over_image_blur+'\n':
            '自研封面模糊图：'+result.over_image_blur+'\n': ''}${result.micro_over_image_blur > 0 ?editBefore.micro_over_image_blur!==result.micro_over_image_blur?
            '小视频自研封面模糊图：更新前：'+editBefore.micro_over_image_blur+';'+
            '更新后：'+result.micro_over_image_blur+'\n':
            '小视频自研封面模糊图：'+result.micro_over_image_blur+'\n': ''}${result.cover_image_yd_sexy > 0 ?editBefore.cover_image_yd_sexy!==result.cover_image_yd_sexy?
            '自研封面性感图：更新前：'+editBefore.cover_image_yd_sexy+';'+
            '更新后：'+result.cover_image_yd_sexy+'\n':
            '自研封面性感图：'+result.cover_image_yd_sexy+'\n': ''}${result.micro_cover_image_yd_sexy > 0 ?editBefore.micro_cover_image_yd_sexy!==result.micro_cover_image_yd_sexy?
            '小视频自研封面性感图：更新前：'+editBefore.micro_cover_image_yd_sexy+';'+
            '更新后：'+result.micro_cover_image_yd_sexy+'\n':
            '小视频自研封面性感图：'+result.micro_cover_image_yd_sexy+'\n': ''}${result.video_image_baidu_unclarity > 0 ?editBefore.video_image_baidu_unclarity!==result.video_image_baidu_unclarity?
            '百度视频内容模糊图：更新前：'+editBefore.video_image_baidu_unclarity+';'+
            '更新后：'+result.video_image_baidu_unclarity+'\n':
            '百度视频内容模糊图：'+result.video_image_baidu_unclarity+'\n': ''}${result.micro_video_image_baidu_unclarity > 0 ?editBefore.micro_video_image_baidu_unclarity!==result.micro_video_image_baidu_unclarity?
            '小视频百度视频内容模糊图：更新前：'+editBefore.micro_video_image_baidu_unclarity+';'+
            '更新后：'+result.micro_video_image_baidu_unclarity+'\n':
            '小视频百度视频内容模糊图：'+result.micro_video_image_baidu_unclarity+'\n': ''}${result.video_image_blur > 0 ?editBefore.video_image_blur!==result.video_image_blur?
            '自研视频封面模糊图：更新前：'+editBefore.video_image_blur+';'+
            '更新后：'+result.video_image_blur+'\n':
            '自研视频封面模糊图：'+result.video_image_blur+'\n': ''}${result.micro_video_image_blur > 0 ?editBefore.micro_video_image_blur!==result.micro_video_image_blur?
            '小视频自研视频封面模糊图：更新前：'+editBefore.micro_video_image_blur+';'+
            '更新后：'+result.micro_video_image_blur+'\n':
            '小视频自研视频封面模糊图：'+result.micro_video_image_blur+'\n': ''}是否保护编辑操作内容：${result.editorProtect ? '是' : '否'}\n人审内容保护：${result.review_protect ? '是' : '否'}\n历史内容映射：${result.enable_derives ? '是' : '否'}\n过滤的自媒体类型：${result.wemediaType.length > 0 ? result.wemediaType.join(',') : '空'}\n审核内容过滤：${result.topview_quality_tags.length > 0 ? result.topview_quality_tags.join(',') : '空'}\n是否豁免文章：${result.filter_escape.length > 0 ? result.filter_escape.join(',') : '空'}\n${result.protect_source.length > 0 ?result.protect_source.length!==editBefore.protect_source.length?
            '白名单账号数量：更新前：'+editBefore.protect_source.length+'个;'+
            '更新后：'+result.protect_source.length + '个\n':'白名单账号数量：共配置' + result.protect_source.length + '个\n' : ''}自媒体ID数量：${result.wm_ids.length > 0 ? '共配置' + result.wm_ids.length + '个' : '空'}\n可分发时长：${typeof result.distributionTime === 'number' ? result.distributionTime + '小时' : '未配置可分发时长，长期有效'}\n操作时间：${date}\n操作人：${result.userName}`,
          }
        }
      }
    } else {
      console.log(`操作类型: ${actionType}`)
      if (editBefore === null) {
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\n规则ID：${result.ruleId}\n过滤规则：${result.name}\n规则说明：${result.desc !== "" ? result.desc : '请补全说明'}\n逻辑：${result.logic}\n${result.security.length > 0 ?
            '涉领导人：'+result.security.join(',')+'\n' : ''}频道黑/白名单：${result.channelList.type}\n具体频道黑/白名单：${result.channelList.content.length > 0 ? result.channelList.content.join(',') : '空'}\n低俗/重口味标签：${result.dirtyTag ? '是' : '否'}\n是否过滤无图内容：${result.noImage ? '是' : '否'}\n${result.category.length > 0 ?
            '类别：'+result.category.join(',')+'\n' : ''}${result.ncat_class !== "" ?
            '新一级分类：'+result.ncat_class+'\n' : ''}${result.nsubcat_class !== "" ?
            '新二级分类：'+result.nsubcat_class+'\n' : ''}${result.titleKeywords !== '' ?
            '标题关键词：共配置' + result.titleKeywords.split(',').length + '个\n' : ''}${result.new_sourcelevel && result.new_sourcelevel.length > 0 ?
            '自媒体等级：'+result.new_sourcelevel.join(',')+'\n' : ''}${result.batch > -1 ?
            '控制刷数：' + result.batch + '\n' : ''}${result.dirty > 0 ?
            '标题低俗：' + result.dirty + '\n' : ''}${result.bait > 0 ?
            '标题党：' + result.bait + '\n' : ''}${result.title_quality.length > 0 ?
            '图文标题低质：' + result.title_quality + '\n': ''}${result.spam > 0 ?
            '软文：' + result.spam + '\n' : ''}${result.sick > 0 ?
            '标题重口：' + result.sick + '\n' : ''}${result.c_imgs_dirty > 0 ?
            '低俗图：' + result.c_imgs_dirty + '\n' : ''}${result.c_imgs_sexy > 0 ?
            '涉性图：' + result.c_imgs_sexy + '\n' : ''}${result.c_imgs_disgusting > 0 ?
            '恶心图：' + result.c_imgs_disgusting + '\n' : ''}${result.blur > 0 ?
            '一点模糊图：' + result.blur + '\n' : ''}${result.unclarity > 0 ?
            '百度模糊图：' + result.unclarity + '\n' : ''}${result.female_sexy > 0 ?
            '女性性感图：' + result.female_sexy + '\n' : ''}${result.male_sexy > 0 ?
            '男性性感图：' + result.male_sexy + '\n' : ''}${result.intimacy > 0 ?
            '亲密行为图：' + result.intimacy + '\n' : ''}${result.yd_general_sexy > 0 ?
            '自研一般性感图：' + result.yd_general_sexy + '\n' : ''}${result.yd_porny > 0 ?
            '自研色情图：' + result.yd_porny + '\n' : ''}${result.yd_sexy > 0 ?
            '自研低俗图：' + result.yd_sexy + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '纯外文：' + result.yd_watery.score[0] + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '文字缺失：' + result.yd_watery.score[1] + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '标题缺失：' + result.yd_watery.score[2] + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '内容不完整：' + result.yd_watery.score[3] + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '文字占比过大：' + result.yd_watery.score[4] + '\n' : ''}${Object.keys(result.yd_watery).length > 0 ?
            '断行：' + result.yd_watery.score[5] + '\n' : ''}${result.yd_disgusting > 0 ?
            '自研重口味图：' + result.yd_disgusting + '\n' : ''}${result.yd_intimacy > 0 ?
            '自研亲密行为图：' + result.yd_intimacy + '\n' : ''}${result.yd_porny_animal > 0 ?
            '自研动物交配模型：' + result.yd_porny_animal + '\n' : ''}是否保护编辑操作内容：${result.editorProtect ? '是' : '否'}\n人审内容保护：${result.review_protect ? '是' : '否'}\n历史内容映射：${result.enable_derives ? '是' : '否'}\n是否豁免文章：${result.filter_escape.length > 0 ? result.filter_escape.join(',') : '空'}\n过滤的自媒体类型：${result.wemediaType.length > 0 ? result.wemediaType.join(',') : '空'}\n审核内容过滤：${result.topview_quality_tags.length > 0 ? result.topview_quality_tags.join(',') : '空'}\n白名单账号数量：${result.protect_source.length > 0 ? '共配置' + result.protect_source.length + '个' : '空'}\n自媒体ID数量：${result.wm_ids.length > 0 ? '共配置' + result.wm_ids.length + '个' : '空'}\n可分发时长：${typeof result.distributionTime === 'number' ? result.distributionTime + '小时' : '未配置可分发时长，长期有效'}\n操作时间：${date}\n操作人：${result.userName}`,

          }
        }
      } else {
        //因水文yd_watery 字段特殊 为空时暂时做赋值处理 可根据需求修改
        Object.keys(editBefore.yd_watery).length > 0 ?  editBefore.yd_watery : editBefore.yd_watery = {type: [ 1, 2, 3 ,4 ,5 ], score: [ 0, 0, 0 ,0 ,0]}
        data = {
          msgtype: 'text',
          text: {
            content: `${actionType}\n规则ID：${result.ruleId}\n${result.name!==editBefore.name?
            '过滤规则：\n更新前：'+editBefore.name+';\n'+
            '更新后：'+result.name:'过滤规则：'+result.name}\n规则说明：${result.desc !== "" ? result.desc+'\n' : '请补全说明\n'}${result.security.length > 0 ? '涉领导人：'+result.security.join(',')+'\n' : ''}${result.channelList.type!==editBefore.channelList.type?
            '频道黑/白名单：\n更新前：'+editBefore.channelList.type+';\n'+
            '更新后'+result.channelList.type:'频道黑/白名单：'+result.channelList.type}\n${result.channelList.content.length > 0?editBefore.channelList.content.join(',')!==result.channelList.content.join(',')?
            '具体频道黑/白名单：\n更新前：'+editBefore.channelList.content.join(',')+';\n'+
            '更新后：'+ result.channelList.content.join(',')+'\n': '具体频道黑/白名单：'+result.channelList.content.join(',')+'\n':''}低俗/重口味标签：${result.dirtyTag ? '是' : '否'}\n是否过滤无图内容：${result.noImage ? '是' : '否'}\n${result.category.length > 0 ?
            '类别：'+result.category.join(',')+'\n' : ''}逻辑：${result.logic}\n${result.ncat_class !== ""?result.ncat_class!==editBefore.ncat_class?
            '新一级分类：更新前：'+editBefore.ncat_class+';'+
            '更新后：'+result.ncat_class+'\n':
            '新一级分类：'+result.ncat_class+'\n' : ''}${result.nsubcat_class !== ""?result.nsubcat_class!==editBefore.nsubcat_class?
            '新二级分类：更新前：'+editBefore.nsubcat_class+';'+
            '更新后：'+result.nsubcat_class+'\n':
            '新二级分类：'+result.nsubcat_class+'\n' : ''}${result.titleKeywords !== "" ?
            '标题关键词：共配置' + result.titleKeywords.split(',').length + '个'+'\n' : ''}轻度低俗：${result.mild_dirty ? '是' : '否'}\n${result.new_sourcelevel && result.new_sourcelevel.length>0?editBefore.new_sourcelevel.join(',')!==result.new_sourcelevel.join(',')?
            '自媒体等级：更新前：'+editBefore.new_sourcelevel.join(',')+';'+
            '更新后'+result.new_sourcelevel.join(',')+'\n':
            '自媒体等级：'+result.new_sourcelevel.join(',')+'\n': ''}${result.batch > -1?editBefore.batch!==result.batch?
            '控制刷数：更新前：'+editBefore.batch+';'+
            '更新后：'+result.batch+'\n':
            '控制刷数：'+result.batch+'\n': ''}${result.dirty > 0 ?editBefore.dirty!==result.dirty?
            '标题低俗：更新前：'+editBefore.dirty+';'+
            '更新后：'+result.dirty+'\n':
            '标题低俗：'+result.dirty+'\n': ''}${result.title_quality && result.title_quality.length>0?editBefore.title_quality.join(',')!==result.title_quality.join(',')?
            '图文标题低质：更新前：'+editBefore.title_quality.join(',')+';'+
            '更新后'+result.title_quality.join(',')+'\n':
            '图文标题低质：'+result.title_quality.join(',')+'\n': ''}${result.bait > 0 ?editBefore.bait!==result.bait?
            '标题党：更新前：'+editBefore.bait+';'+
            '更新后：'+result.bait+'\n':
            '标题党：'+result.bait+'\n': ''}${result.spam > 0 ?editBefore.spam!==result.spam?
            '软文：更新前：'+editBefore.spam+';'+
            '更新后：'+result.spam+'\n':
            '软文：'+result.spam+'\n': ''}${result.sick > 0 ?editBefore.sick!==result.sick?
            '标题重口：更新前：'+editBefore.sick+';'+
            '更新后：'+result.sick+'\n':
            '标题重口：'+result.sick+'\n': ''}${result.c_imgs_dirty > 0 ?editBefore.c_imgs_dirty!==result.c_imgs_dirty?
            '低俗图：更新前：'+editBefore.c_imgs_dirty+';'+
            '更新后：'+result.c_imgs_dirty+'\n':
            '低俗图：'+result.c_imgs_dirty+'\n': ''}${result.c_imgs_sexy > 0 ?editBefore.c_imgs_sexy!==result.c_imgs_sexy?
            '涉性图：更新前：'+editBefore.c_imgs_sexy+';'+
            '更新后：'+result.c_imgs_sexy+'\n':
            '涉性图：'+result.c_imgs_sexy+'\n': ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[0] ?editBefore.yd_watery && editBefore.yd_watery.score[0]!==result.yd_watery&&result.yd_watery.score[0]?
            '纯外文：更新前：'+editBefore.yd_watery.score[0]+';'+
            '更新后：'+result.yd_watery.score[0]+'\n':
            '纯外文：'+result.yd_watery.score[0]+'\n': '' : ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[1] ?editBefore.yd_watery && editBefore.yd_watery.score[1]!==result.yd_watery&&result.yd_watery.score[1]?
            '文字缺失：更新前：'+editBefore.yd_watery.score[1]+';'+
            '更新后：'+result.yd_watery.score[1]+'\n':
            '文字缺失：'+result.yd_watery.score[1]+'\n': '' : ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[2] ? editBefore.yd_watery && editBefore.yd_watery.score[2]!==result.yd_watery&&result.yd_watery.score[2]?
            '标点缺失：更新前：'+editBefore.yd_watery.score[2]+';'+
            '更新后：'+result.yd_watery.score[2]+'\n':
            '标点缺失：'+result.yd_watery.score[2]+'\n': '' : ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[3] ? editBefore.yd_watery && editBefore.yd_watery.score[3]!==result.yd_watery&&result.yd_watery.score[3]?
            '内容不完整：更新前：'+editBefore.yd_watery.score[3]+';'+
            '更新后：'+result.yd_watery.score[3]+'\n':
            '内容不完整：'+result.yd_watery.score[3]+'\n': '' : ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[4] ? editBefore.yd_watery && editBefore.yd_watery.score[4]!==result.yd_watery&&result.yd_watery.score[4]?
            '文字占比过大：更新前：'+editBefore.yd_watery.score[4]+';'+
            '更新后：'+result.yd_watery.score[4]+'\n':
            '文字占比过大：'+result.yd_watery.score[4]+'\n': '' : ''}${Object.keys(result.yd_watery).length > 0 ? result.yd_watery && result.yd_watery.score[5] ? editBefore.yd_watery && editBefore.yd_watery.score[5]!==result.yd_watery&&result.yd_watery.score[5]?
            '断行：更新前：'+editBefore.yd_watery.score[5]+';'+
            '更新后：'+result.yd_watery.score[5]+'\n':
            '断行：'+result.yd_watery.score[5]+'\n': '' : ''}${result.c_imgs_disgusting > 0 ?editBefore.c_imgs_disgusting!==result.c_imgs_disgusting?
            '恶心图：更新前：'+editBefore.c_imgs_disgusting+';'+
            '更新后：'+result.c_imgs_disgusting+'\n':
            '恶心图：'+result.c_imgs_disgusting+'\n': ''}${result.blur > 0?editBefore.blur!==result.blur?
            '一点模糊图：更新前：'+editBefore.blur+';'+
            '更新后：'+result.blur+'\n':
            '一点模糊图：'+result.blur+'\n': ''}${result.unclarity > 0?editBefore.unclarity!==result.unclarity?
            '百度模糊图：更新前：'+editBefore.unclarity+';'+
            '更新后：'+result.unclarity+'\n':
            '百度模糊图：'+result.unclarity+'\n': ''}${result.female_sexy > 0 ?editBefore.female_sexy!==result.female_sexy?
            '女性性感图：更新前：'+editBefore.female_sexy+';'+
            '更新后：'+result.female_sexy+'\n':
            '女性性感图：'+result.female_sexy+'\n': ''}${result.male_sexy > 0 ?editBefore.male_sexy!==result.male_sexy?
            '男性性感图：更新前：'+editBefore.male_sexy+';'+
            '更新后：'+result.male_sexy+'\n':
            '男性性感图：'+result.male_sexy+'\n': ''}${result.intimacy > 0 ?editBefore.intimacy!==result.intimacy?
            '亲密行为图：更新前：'+editBefore.intimacy+';'+
            '更新后：'+result.intimacy+'\n':
            '亲密行为图：'+result.intimacy+'\n': ''}${result.yd_porny > 0 ?editBefore.yd_porny!==result.yd_porny?
            '自研色情图：更新前：'+editBefore.yd_porny+';'+
            '更新后：'+result.yd_porny+'\n':
            '自研色情图：'+result.yd_porny+'\n': ''}${result.yd_sexy > 0 ?editBefore.yd_sexy!==result.yd_sexy?
            '自研低俗图：更新前：'+editBefore.yd_sexy+';'+
            '更新后：'+result.yd_sexy+'\n':
            '自研低俗图：'+result.yd_sexy+'\n': ''}${result.yd_general_sexy > 0 ?editBefore.yd_general_sexy!==result.yd_general_sexy?
            '自研一般性感图：更新前：'+editBefore.yd_general_sexy+';'+
            '更新后：'+result.yd_general_sexy+'\n':
            '自研一般性感图：'+result.yd_general_sexy+'\n': ''}${result.yd_disgusting > 0 ?editBefore.yd_disgusting!==result.yd_disgusting?
            '自研重口味图：更新前：'+editBefore.yd_disgusting+';'+
            '更新后：'+result.yd_disgusting+'\n':
            '自研重口味图：'+result.yd_disgusting+'\n': ''}${result.yd_intimacy > 0 ?editBefore.yd_intimacy!==result.yd_intimacy?
            '自研亲密行为图：更新前：'+editBefore.yd_intimacy+';'+
            '更新后：'+result.yd_intimacy+'\n':
            '自研亲密行为图：'+result.yd_intimacy+'\n': ''}${result.yd_porny_animal > 0 ?editBefore.yd_porny_animal!==result.yd_porny_animal?
            '自研动物交配模型：更新前：'+editBefore.yd_porny_animal+';'+
            '更新后：'+result.yd_porny_animal+'\n':
            '自研动物交配模型：'+result.yd_porny_animal+'\n': ''}是否保护编辑操作内容：${result.editorProtect ? '是' : '否'}\n人审内容保护：${result.review_protect ? '是' : '否'}\n历史内容映射：${result.enable_derives ? '是' : '否'}\n过滤的自媒体类型：${result.wemediaType.length > 0 ? result.wemediaType.join(',') : '空'}\n审核内容过滤：${result.topview_quality_tags.length > 0 ? result.topview_quality_tags.join(',') : '空'}\n是否豁免文章：${result.filter_escape.length > 0 ? result.filter_escape.join(',') : '空'}\n${result.protect_source.length > 0 ?result.protect_source.length!==editBefore.protect_source.length?
            '白名单账号数量：更新前：'+editBefore.protect_source.length+'个;'+
            '更新后：'+result.protect_source.length + '个\n':'白名单账号数量：共配置' + result.protect_source.length + '个\n' : ''}自媒体ID数量：${result.wm_ids.length > 0 ? '共配置' + result.wm_ids.length + '个' : '空'}\n可分发时长：${typeof result.distributionTime === 'number' ? result.distributionTime + '小时' : '未配置可分发时长，长期有效'}\n操作时间：${date}\n操作人：${result.userName}`,
          }
        }
      }
    }
    await axios({
      method: 'post',
      url: `${DingTalkUrl}/robot/send?access_token=${isDev ? access_token_development : access_token}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    });
  }
};
