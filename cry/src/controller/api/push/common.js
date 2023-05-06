const Base = require('../../base');
const axios = require('axios');

module.exports = class extends Base {
  constructor(props) {
    super(props);

    const pushdb = think.env === 'production' ? 'mongo_editor' : 'mongo_10';

    this.pushmodel = this.model('app/push', pushdb);
  }

  async pushauthAction() {
    const user = this.cookie('username');

    try {
      if (!user) {
        throw new Error('未获取到用户邮箱');
      }

      const fetch_res = await axios.get(
        `${this.config('PUSH_CONFIG').push}/editor/get-editor-info`,
        {
          headers: { cookie: `JEMAILID=${user}` },
        },
      );

      if (fetch_res.data.code === 0) {
        const { push_key, permission = [], channels = [], exclude_channels = [] } = fetch_res.data;

        return this.json({
          status: 'success',
          result: { push_key, permission, channels, exclude_channels },
        });
      } else {
        throw new Error(`Error-${fetch_res.data.code}: ${fetch_res.data.reason}`);
      }
    } catch (err) {
      console.log(err.message, 'error happened when fetch user permission');
      return this.json({
        status: 'failed',
        message: err.message,
      });
    }
  }

  async testApiAction() {
    const res = await axios.get('http://push_task.ha.in.yidian.com:8703/push/add_task_debug.php');
    // const res = await axios.get(`http://10.103.17.207/push/get_push_task_history.php`);
    console.log(res.data);
    return this.json({
      status: 'success',
      message: 'abc',
      data: res.data,
    });
  }

  async toolauthAction() {
    const tool_id = '3541078614';
    try {
      const tool_res = await axios.get(
        `${this.config('TOOL_CONFIG').pandora}/tools/auth?tool=${tool_id}`,
      );
      const { user, info, result: authes, status, reason } = tool_res.data;

      console.log(tool_res.data, 'tool_res');

      if (status === 'success') {
        const auth_map = {};

        for (const { _id, name } of info.child || []) {
          auth_map[_id] = name;
        }

        return this.json({
          status: 'success',
          result: { user, authes, auth_map },
        });
      } else {
        throw new Error(reason);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async tempAction() {
    const puid = this.cookie('YD_PANDORA_UID');
    const biz = this.get('biz');

    try {
      if (!puid) {
        throw new Error('当前用户未登录');
      }

      const templist = await this.pushmodel.getTempList(puid, biz);
      const nowDate = new Date().getTime();
      const currentDate = new Date(new Date().toLocaleDateString()).getTime() + 12 * 60 * 60 * 1000;
      const diffSecond = nowDate - currentDate;
      if (diffSecond > 0) {
        templist.map((value, index) => {
          if (value.values.excludeTags.length) {
            value.values.excludeTags.splice(
              value.values.excludeTags.findIndex(item => item == 'e2465899'),
              1,
            );
          }
        });
      }

      templist.forEach(item => {
        item['forms']['strat'].splice(2, 0, 'oppopay'); // 添加opp付费推送字段
        item['values']['oppo_pay'] = 0; // 添加opp付费推送字段
        if (item['temp_id'] === '001') {
          item['forms']['strat'].splice(3, 0, 'major'); // 添加重大全量
          item['values']['major_quantity'] = 0; // 添加重大全量
        }
      });

      return this.json({
        status: 'success',
        result: templist,
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async getcateAction() {
    const puid = this.cookie('YD_PANDORA_UID');
    try {
      if (!puid) {
        throw new Error('未获取到常用分类或者用户未登录');
      }

      const cates = await this.pushmodel.getStoredCates(puid);

      return this.json({
        status: 'success',
        result: cates,
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async gettagAction() {
    const puid = this.cookie('YD_PANDORA_UID');

    try {
      if (!puid) {
        throw new Error('用户未登录');
      }

      const tags = await this.pushmodel.getStoredTags(puid);

      return this.json({
        status: 'success',
        result: tags,
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async postcateAction() {
    const cates = this.post('cates');
    const puid = this.cookie('YD_PANDORA_UID');

    try {
      if (!cates || !puid) {
        throw new Error('未获取到常用分类或者用户未登录');
      }

      await this.pushmodel.saveStoredCates(puid, cates);

      return this.json({
        status: 'success',
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // // 暂时标签存储于后端
  // async posttagAction() {
  //   const tags = this.post("tags");
  //   const extags = this.post("extags");
  //   const username = this.cookie("username");

  //   try {
  //     if (!username) {
  //       throw new Error("用户未登录");
  //     }
  //     if (!tags && !extags) {
  //       throw new Error("未获取到收藏的标签");
  //     }

  //     const postdata = { channels: tags, exclude_channels: extags };
  //     const postconfig = { headers: { cookie: `JEMAILID=${decodeURIComponent(username)}` } };

  //     const update_res = await axios.post(`${this.config("PUSH_CONFIG").push}/editor/update-editor-tags`, postdata, postconfig);

  //     if (update_res.data.status === "success") {
  //       return this.json({ status: "success" })
  //     } else {
  //       throw new Error(update_res.data.reason);
  //     }
  //   } catch (err) {
  //     return this.json({
  //       status: "failed",
  //       message: err.message
  //     });
  //   }
  // }

  // 标签存储于前端mongo
  async posttagAction() {
    const tags = this.post('tags');
    const extags = this.post('extags');
    const interTags = this.post('interTags');
    const puid = this.cookie('YD_PANDORA_UID');

    try {
      if (!puid) {
        throw new Error('用户未登录');
      }
      if (!tags && !extags && !interTags) {
        throw new Error('未获取到收藏的标签');
      }

      await this.pushmodel.saveStoredTags(puid, tags, extags, interTags);

      return this.json({ status: 'success' });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // push权限统一控制
  async permissionAction() {
    const type = this.get('type');
    const userEmail = this.get('user_email');
    const userName = this.get('user_name');
    const permission = this.get('permission');
    const switch_value = this.get('switch_value');
    const status = this.get('status');
    const user = this.cookie('username');
    const puid = this.cookie('YD_PANDORA_UID');

    let url = `${this.config('PUSH_CONFIG').push}/editor/${type}?`;

    /* 测试环境的接口地址，上线前记得注释 */

    /* let host="http://10.103.17.207"
    if (type === 'get-editor-list') { // 列表
      url = `${host}/generator/editor/GetEditorListAction.php?`
    } else if (type === 'create-editor') { // 新建
      url = `${host}/generator/editor/CreateEditorAction.php?`
    } else if (type === 'update-editor-info' && status === 'inactive') { // 删除
      url = `${host}/generator/editor/UpdateEditorInfoAction.php?`
    } else { // 更新
      url = `${host}/generator/editor/UpdateEditorInfoAction.php?`
    } */

    /******************************************************************/

    if (type === 'get-editor-list') {
      // 查看用户权限 user_name不传就是所有人
      url += `status=${status}&user_name=${userName}`;
    } else if (type === 'create-editor') {
      // 新建
      url += `user_email=${userEmail}&permission=${permission}&switch=${switch_value}`;
    } else if (type === 'update-editor-info' && status === 'inactive') {
      // 删除
      url += `user_email=${userEmail}&status=${status}&switch=${switch_value}`;
    } else {
      // 更新
      url += `user_email=${userEmail}&permission=${permission}&switch=${switch_value}`;
    }

    try {
      if (!puid) {
        throw new Error('用户未登录');
      }
      if (!user) {
        throw new Error('未获取到用户邮箱');
      }
      const res = await axios.get(url, {
        headers: { cookie: `JEMAILID=${user}` },
      });
      if (res.data.code === 0 && res.data.status === ('success' || 'active')) {
        return this.json({
          status: 'success',
          result: res.data,
        });
      } else {
        return this.json({
          status: 'failed',
          reason: res.data.reason,
        });
      }
    } catch (err) {
      return this.json({
        status: 'permission failed',
        message: err.toString(),
        reason: err.toString(),
      });
    }
  }
};
