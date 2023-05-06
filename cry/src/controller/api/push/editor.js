const Base = require('../../base');
const axios = require('axios');
const request = require('request');
const fs = require('fs');
module.exports = class extends Base {
  async userlayerAction() {
    try {
      const fetch_res = await axios.get(`${this.config('PUSH_CONFIG').push}/editor/get-layer-list`);

      if (fetch_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: fetch_res.data.layer,
        });
      } else {
        throw new Error(`Error-${fetch_res.data.code}: ${fetch_res.data.reason}`);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 搜索标签
  async tagsAction() {
    const keyword = this.get('keyword');
    const tag_type = this.get('type') || 'pushtag'; // 默认使用channel作为tag搜索的方式
    const username = this.cookie('username');

    try {
      if (!keyword) {
        throw new Error('参数不全');
      }

      let tag_res;

      if (tag_type === 'pushtag') {
        tag_res = await this.getChannelTagsWithCount(keyword);
      } else {
        tag_res = await this.getUsersetTagsWithCount(keyword, username);
      }

      return this.json({
        status: 'success',
        result: tag_res,
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 获取标签对应的人数
  async tagcountAction() {
    const fromids = this.get('fromid');

    try {
      if (!fromids) {
        throw new Error('fromid参数不能为空');
      }

      const fromid_arr = fromids.split(',');
      const count_res = await this.getChannelUserCount(fromid_arr);

      return this.json({
        status: 'success',
        result: count_res,
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async pushusercountAction() {
    const tags = this.get('tags') || '';
    const extags = this.get('extags') || '';
    const inter_channels = this.get('inter_channels') || '';
    if (!tags) {
      // tag 必须传 如果不传 就是0
      return this.json({
        status: 'success',
        result: {
          together: 0,
        },
      });
    }
    try {
      const count_res = await axios.get(
        // `${this.config('PUSH_CONFIG').push}/channel/channel-user-count?channels=${tags}&exclude_channels=${extags}&inter_channels=${inter_channels}`,
        `${
          this.config('PUSH_CONFIG').newPush
        }/tag/totalCount?channels=${tags}&exclude_channels=${extags}&inter_channels=${inter_channels}`,
      );
      if (count_res.data.code == 0) {
        return this.json({
          status: 'success',
          result: {
            together: count_res.data.data,
          },
        });
      } else {
        throw new Error(count_res.data.msg);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 获取同步触达端
  async syncplatformAction() {
    try {
      const fetch_res = await axios.get(
        `${this.config('PUSH_CONFIG').push}/editor/get-sync-platform-list`,
      );

      if (fetch_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: fetch_res.data.list,
        });
      } else {
        throw new Error(`Error-${fetch_res.data.code}: ${fetch_res.data.reason}`);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 获取推送历史的推送数据字段
  async getPushDataAction() {
    const data = this.post();
    const url = 'http://raptor-site-hj-dataplatform.int.yidian-inc.com/oak/druid/query';
    try {
      const fetch_res = await axios.post(url, data);
      if (fetch_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: fetch_res.data.data,
        });
      } else {
        throw new Error(`Error-${fetch_res.data.code}: ${fetch_res.data.reason}`);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 获取推送分类列表
  async catelistAction() {
    try {
      const fetch_res = await axios.get(`${this.config('PUSH_CONFIG').push}/editor/get-cate-list`);

      if (fetch_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: fetch_res.data.cate,
        });
      } else {
        throw new Error(`Error-${fetch_res.data.code}: ${fetch_res.data.reason}`);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 上传push图片
  // type=xiaomi表示上传至小米，其他表示上传内网
  async pushimageAction() {
    const type = this.get('type');
    const file = this.file('file');

    try {
      if (!file || !file.path) {
        throw new Error('未获取到图片');
      }

      const formData =
        type === 'xiaomi'
          ? {
              is_global: 'false',
            is_icon: 'false',
              file: {
              value: fs.createReadStream(file.path),
              options: { filename: 'file.png', contentType: 'image/png' },
              },
            }
          : {
              pic: {
                value: fs.createReadStream(file.path),
              options: { contentType: 'image/png' },
              },
          };
      const url =
        type === 'xiaomi'
          ? `${this.config('PUSH_CONFIG').xiaomi}/media/upload/image`
          : `${this.config('PUSH_CONFIG').image}/image?action=insert&type=editor`;
      const header = type === 'xiaomi' ? { Authorization: 'key=bs8gNxzMdfwj53+JYGAvkg==' } : {};
      const res = await this.upload(url, formData, header);

      return this.json({
        code: 0,
        status: 'success',
        data: {
          url: res,
          image_id: '',
        },
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  async quotaAction() {
    try {
      const quota_res = await axios.get(
        `${this.config('PUSH_CONFIG').old_push}/push/push_limitation_info/oppo_doage_info.php`,
      );

      if (quota_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: quota_res.data.data,
        });
      } else {
        throw new Error(quota_res.data.desc);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 真正的上传
  async upload(url, formData, header = {}) {
    return new Promise((resolve, reject) => {
      request.post({ url, formData, headers: header }, (err, res, body) => {
        const json_body = body ? JSON.parse(body) : {};

        // 一点 上传 成功 {"status":"success","url":"https:\/\/si1.go2yd.com\/get-image\/0hmwCQazbFo","format":"PNG","size":[288,288]}
        if (json_body.status === 'success') {
          return resolve(json_body.url);
        }

        // 小米 上传 成功 {"result":"ok","trace_id":"Xdm5985259339548194541","code":0,"data":{"icon_url":"http://t3.market.mi-img.com/thumcrop/webp/h120/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/icon.webp?crop=l276r600","sha1":"e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd","pic_url":"http://f6.market.xiaomi.com/download/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd.png"},"description":"成功"}
        if (json_body.result === 'ok') {
          return resolve(json_body.data.pic_url);
        }

        reject(err || json_body.reason);
      });
    });
  }

  // 根据关键词搜索频道
  async getChannelsByKeyword(keyword) {
    let useKeyWord = keyword;
    if (keyword && typeof keyword === 'string') {
      useKeyWord = useKeyWord.toLocaleLowerCase(); // 转为小写 大写的NBA搜不到， 小写的就可以
    }
    const channel_res = await axios.get(
      `${this.config('PUSH_CONFIG').lion}/assistant2?word=${encodeURIComponent(
        useKeyWord,
      )}&count=5000000&edit=*`,
    );

    if (channel_res.data && channel_res.data.status === 'success') {
      return channel_res.data.channels.map(({ id, name }) => ({ id, name }));
    } else {
      throw new Error(channel_res.data.reason);
    }
  }

  // 获取用户组对应的人数
  async getUsersetTagsWithCount(keyword, username) {
    const postdata = { userSetIdOrName: keyword };
    const userset_res = await axios.post(
      `${this.config('PUSH_CONFIG').pushtag_api}/userset/get`,
      postdata,
      {
        headers: {
          Cookie: `username=${username};YD_PANDORA_JWT_TOKEN=tuffy_test@yidian-inc.com`, // token写死，后端设为了白名单
          'Content-Type': 'application/json',
        },
      },
    );

    if (userset_res.data.header.code === 0) {
      console.log(userset_res.data, 'get userset tags with count');
      return userset_res.data.data
        .map(({ userSetName, userSetAliasName, userEstimateFull }) => ({
          id: userSetName,
          name: userSetAliasName,
          count: userEstimateFull,
        }))
        .filter(userset => userset.count !== 0);
    } else {
      throw new Error(userset_res.data.message);
    }
  }

  // 获取频道的用户数：{[key]: count}, 领域爆文已经下线，这里不再处理
  // 失败不抛错，仅返回空值
  async getChannelUserCount(channels = []) {
    if (channels.length === 0) {
      return {};
    }
    // const fetch_res = await axios.get(`${this.config('PUSH_CONFIG').pushtag}/get_channel_user_count.php?channel_id=${channels.join(',')}`);
    const fetch_res = await axios.get(
      `${this.config('PUSH_CONFIG').newPush}/tag/multiCount?channel_id=${channels.join(',')}`,
    );
    const channel_with_count = fetch_res.data.data;

    // 去掉数量为0的tag
    if (fetch_res.data.code === 0) {
      for (const key in channel_with_count) {
        if (channel_with_count[key] === 0) {
          delete channel_with_count[key];
        } else {
          const temp = channel_with_count[key];
          if (temp >= 10000) {
            // 大于万的 转换成万单位
            channel_with_count[key] = Math.floor(temp / 10000) + '万';
          }
        }
      }
      return channel_with_count;
    } else {
      return {};
    }
  }

  // 获取频道对应的用户数: {[key]: label_count}
  async getChannelTagsWithCount(keyword) {
    const channels = await this.getChannelsByKeyword(keyword);
    const count_map = await this.getChannelUserCount(channels.map(item => item.id));

    return channels
      .map(channel => ({
        ...channel,
        count: count_map[`${channel.id}`] || 0,
      }))
      .filter(channel => channel.count !== 0);
  }

  async pushAction() {
    const data = this.post();
    const isForce = this.get('isForce');
    const isTest = this.get('isTest');

    try {
      if (!data.key) {
        throw new Error('未获取到操作者的push key');
      }

      console.log('push 推送的数据');
      console.log(data);
      const pushUrl = this.formatPushUrl(data, isForce, isTest, false);
      // console.log('===pushUrl=' + pushUrl);
      const res = await axios.get(pushUrl, { timeout: 20000 });
      if (res.data.status === 'success') {
        return this.json({
          status: 'success',
          data: res.data || '',
        });
      } else {
        throw new Error(res.data.reason || '推送失败');
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // push 接入鸿蒙推送
  async harmonyOSPushAction() {
    const data = this.post();
    const testUrl = 'http://open-push.test.yidian-inc.com/push/add-tool-push-message';
    // const prodUrl = 'http://open-push.test.yidian-inc.com/push/add-tool-push-message'
    const prodUrl = 'http://open-push.int.yidian-inc.com/push/add-tool-push-message';

    const url = think.env === 'development' ? testUrl : prodUrl;
    try {
      const res = await axios.post(url, data, { timeout: 20000 });
      if (res.data.code === 0) {
        return this.json({
          status: 'success',
          data: res.data || '',
        });
      } else {
        throw new Error(res.data.reason || '请求失败');
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  /**
   *
   * @param {*} data 请求参数
   * @param {*} isForce
   * @param {*} isTest
   * @param {*} isSection 是否分段式
   * @returns url参数
   */
  formatPushUrl(data, isForce, isTest, isSection) {
    // let flag = think.env === "production"
    // let flag = think.env
    // console.log(flag)
    // 线上
    let pushUrl = `${
      this.config('PUSH_CONFIG').old_push
    }/push/add_task.php?back_btn_bubble_num=12&show_tips=0&back_btn_show_bubble=1&type=editor&key=${
      data.key
    }&biz_id=${data.biz_id}&docid=${data.doc_id}&head=${encodeURIComponent(
      data.title,
    )}&title=${encodeURIComponent(data.summary)}&sound=${
      data.sound
    }&template=summary&quota_bizcode=${data.quota_bizcode}`;
    // 测试1 这个不用了
    // let pushUrl = `http://10.60.106.29:8703/add_task.php?back_btn_bubble_num=12&show_tips=0&back_btn_show_bubble=1&type=editor&key=${data.key}&biz_id=${data.biz_id}&docid=${data.doc_id}&head=${encodeURIComponent(data.title)}&title=${encodeURIComponent(data.summary)}&sound=${data.sound}&template=summary&quota_bizcode=${data.quota_bizcode}`;
    // 测试2 测试用这个 key 在url中写死了
    // let pushUrl = `http://10.103.17.207/push/add_task.php?is_test=1&back_btn_bubble_num=12&show_tips=0&back_btn_show_bubble=1&type=editor&key=07535d7fd9f4193216bbdb698d142ae8&biz_id=${data.biz_id}&docid=${data.doc_id}&head=${encodeURIComponent(data.title)}&title=${encodeURIComponent(data.summary)}&sound=${data.sound}&template=summary&quota_bizcode=${data.quota_bizcode}`;
    if (isSection) {
      // 分段式把前面域名和docid rstype summary title干掉
      pushUrl = `back_btn_bubble_num=12&show_tips=0&back_btn_show_bubble=1&type=editor&key=${data.key}&biz_id=${data.biz_id}&sound=${data.sound}&template=summary&quota_bizcode=${data.quota_bizcode}`;
    }

    if (isForce) {
      pushUrl += '&ignore_cache=1';
    }

    if (isTest) {
      pushUrl += '&is_test=1';
    }

    // 指定用户时该字段为具体的用户id， 否则为pushType
    if (data.userids) {
      pushUrl += `&userids=${data.userids.trim()}`;
    } else {
      pushUrl += `&userids=${data.pushType}`;
    }

    if (data.hot_level) {
      pushUrl += `&hot_level=${data.hot_level}`;
    }

    // 是否小米高优
    if (data.xiaomi_priority !== undefined) {
      pushUrl += `&xiaomi_priority=${data.xiaomi_priority}`;
    }

    // 是否开启 oppo 付费推送
    if (data.oppo_pay !== undefined) {
      pushUrl += `&oppo_pay=${data.oppo_pay}`;
    }

    // 圈选标签
    if (data.tags) {
      pushUrl += `&channel=${encodeURIComponent(data.tags.join(','))}`;
    }

    // 排除标签
    if (data.excludeTags) {
      pushUrl += `&exclude_channel=${encodeURIComponent(data.excludeTags.join(','))}`;
    }

    // 交集标签
    if (data.inter_channel) {
      pushUrl += `&inter_channel=${encodeURIComponent(data.inter_channel.join(','))}`;
    }

    // 配图
    if (data.img) {
      pushUrl += `&img_url=${encodeURIComponent(data.img)}`;
    }

    // 小米配图
    if (data.xiaomi_img_url) {
      pushUrl += `xiaomi_img_url=${encodeURIComponent(data.xiaomi_img_url)}`;
    }

    // oppo通知栏配图
    if (data.oppo_push_notification_img_url) {
      pushUrl += `oppo_push_notification_img_url=${encodeURIComponent(
        data.oppo_push_notification_img_url,
      )}`;
    }

    // 包含的appid
    if (data.appid) {
      pushUrl += `&apps=${encodeURIComponent(data.appid)}`;
    }

    // 排除的appid
    if (data.exappid) {
      pushUrl += `&exapps=${data.exappid}`;
    }

    // 触达平台
    if (data.platform) {
      pushUrl += `&platform=${encodeURIComponent(data.platform)}`;
    }

    // 同步触达端
    if (data.sync_platform) {
      pushUrl += `&sync_platform=${encodeURIComponent(data.sync_platform)}`;
    }

    // 推送分类
    if (data.cate) {
      pushUrl += `&cate=${data.cate}`;
    }

    // 用户层级划分
    if (data.user_layer_channel) {
      pushUrl += `&user_layer_channel=${data.user_layer_channel.join(',')}`;
    }

    // 内容类型 如果是分段式就去掉
    if (data.rstype && !isSection) {
      pushUrl += `&rstype=${data.rstype}`;
    }

    // 最小版本
    if (data.inVersion) {
      pushUrl += `&version=${data.inVersion}`;
    }

    // 排除版本
    if (data.exVersion) {
      pushUrl += `&exclude_version=${data.exVersion}`;
    }

    // 最小客户端版本
    if (data.inClientVersion) {
      pushUrl += `&cv=${data.inClientVersion}`;
    }

    // 排除客户端版本
    if (data.exClientVersion) {
      pushUrl += `&exclude_cv=${data.exClientVersion}`;
    }

    // 过期时间---目前是都默认3小时
    if (data.expireTime) {
      pushUrl += `&expire_time=${data.expireTime}`;
    }

    // 是否延迟推送
    if (data.delay_push !== undefined) {
      // 这里传过来是string 0 或者 1
      pushUrl += `&delay_push=${data.delay_push}`;
    }

    // 延迟推送时间
    if (data.delay_push_time) {
      pushUrl += `&delay_push_time=${Math.floor(new Date(data.delay_push_time).getTime() / 1000)}`;
    }

    // 热点脉络的推送方式
    if (data.retrieve_strategy !== undefined) {
      pushUrl += `&retrieve_strategy=${data.retrieve_strategy}`;
    }

    // 热点脉络文章
    if (data.veins_docids) {
      pushUrl += `&veins_docids=${data.veins_docids}`;
    }

    // 冠名推送
    if (data.ad_code) {
      pushUrl += `&ad_code=${data.ad_code}`;
    }

    // 配额业务
    if (data.quota_code) {
      pushUrl += `&quota_code=${data.quota_code}`;
    }
    return pushUrl;
  }

  /**
   *
   * @returns 分段式分发推送
   */
  async pushSectionAction() {
    const data = this.post();
    const isForce = this.get('isForce');
    const isTest = this.get('isTest');

    try {
      if (!data.key) {
        throw new Error('未获取到操作者的push key');
      }
      const commonUrl = this.formatPushUrl(data, isForce, isTest, true);
      const pushUrl = `${this.config('PUSH_CONFIG').section_push}`;
      const postdata = this.formatPushPostData(data, commonUrl);

      console.log('--------------');
      console.log(postdata, '分段式推送数据');
      console.log('--------------');

      const res = await axios.post(pushUrl, postdata, { timeout: 20000 });
      console.log(res.data, 'resdata');
      // 对应的返回结果
      // Exception_Runtime(1, "exception runtime:"),
      // Exception_NotRuntime(2, "exception not runtime:"),
      // MISS_PARAMS(3, "missing parameters"),
      // ERROR_PARAMS(4, "error parameters"),
      // ERROR_REQUEST(5, "error request:"),
      // ERROR_BUSINESS(6, "error business:"),
      // ERROR_DB(7, "error db:"),
      // ERROR_UNKNOWN(-1, "unknown error"),
      // SUCCESS(200, "success");
      if (res.data.code === 200) {
        return this.json({ status: 'success', data: res.data.data });
      } else {
        throw new Error(res.data.msg || '推送失败');
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }
  /**
   *
   * @param {*} data
   * @returns 处理post数据
   */
  formatPushPostData(data, commonUrl) {
    const pkGroup = Object.values(data.section).map((item, index) => ({
      groupUrl: `&rstype=${item.rstype}&docid=${item.doc_id}&head=${encodeURIComponent(
        item.title,
      )}&title=${encodeURIComponent(item.summary)}`,
      bucketName: data.groupmsg[index].bucketName,
      percent: data.groupmsg[index].percent,
    }));

    // post数据格式
    const postdata = {
      observeTime: Number(data.observeTime) || 60, // 实验窗口时长，单位分钟
      commonUrl, // 各组共用配置
      defaultGroup: {
        // 默认组配置
        bucketName: data.groupmsg[data.groupmsg.length - 1].bucketName, // bucketName
        percent: data.groupmsg[data.groupmsg.length - 1].percent, // 比例 80%
      },
      pkGroup,
    };

    return postdata;
  }

  // 校验重复性,并返回重复信息
  async duplicateAction() {
    const docid = this.get('docid');
    const title = this.get('title');
    const summary = this.get('summary');

    try {
      const dup_params = { docid, title, summary, filter_push_types: '49,50' };
      const dup_res = await axios.get(
        `${this.config('PUSH_CONFIG').push}/content/duplicate-check`,
        { params: dup_params },
      );

      if (dup_res.data.status === 'success') {
        const { duplicate_push, title_duplicate_push, summary_duplicate_push } = dup_res.data;

        // 标注重复原因
        const dup_doc = duplicate_push.map(item => ({ ...item, reason: 'docid' }));
        const dup_title = title_duplicate_push.map(item => ({ ...item, reason: 'title' }));
        const dup_summary = summary_duplicate_push.map(item => ({ ...item, reason: 'summary' }));

        const dups = [...dup_doc, ...dup_title, ...dup_summary];

        for (const item of dups) {
          const { include_channels = '', exclude_channels = '' } = item;

          item.include_channels = include_channels.split('/');
          item.exclude_channels = exclude_channels.split('/');
        }

        const fromid = dups.reduce(
          (prev, cur) => [...prev, ...cur.include_channels, ...cur.exclude_channels],
          [],
        );
        const uniqe_fromid = Array.from(new Set(fromid));
        const channel_info = await this.getChannelDetailByFromids(uniqe_fromid);

        for (const item of dups) {
          const { include_channels, exclude_channels } = item;

          item.include_channels = include_channels.map(fromid => ({
            channelId: fromid,
            info: channel_info[fromid],
          }));
          item.exclude_channels = exclude_channels.map(fromid => ({
            channelId: fromid,
            info: channel_info[fromid],
          }));
        }

        return this.json({
          status: 'success',
          result: dups,
        });
      } else {
        throw new Error(dup_res.data.reason);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 通过 fromid 获取 channel 信息
  async getChannelDetailByFromids(fromids) {
    const channel_url = `${this.config('API_URL').a4}/Website/mysql/default-channel`;
    const channel_res = await axios.get(channel_url, {
      params: { ids: fromids.join(','), fields: 'topicName', edit: '*' },
    });

    if (channel_res.data.status === 'success') {
      return channel_res.data.result;
    } else {
      throw new Error(channel_res.data.reason);
    }
  }

  /*
   * 获取文章信息
   * 1. 校验push白名单
   * 2. 判定文章serving状态
   * 3. 判定文章push状态
   * 4. 拿到文章标题，摘要，配图信息
   * 5. 拿到文章的推荐标签
   */
  async docinfoAction() {
    const docid = this.get('docid');
    const bizId = this.get('biz_id'); // 当前对应的模版id

    try {
      if (!docid) {
        throw new Error('未获取到docid');
      }

      const white_list = await this.getPushWhitelist();
      const doc_status = await this.getDocServingStatus(docid, bizId);
      const push_status = await this.getDocPushStatus(docid);
      const doc_info = await this.getDocInfo(docid);

      const { status, reason } = doc_status;
      const { summary = '', title = '', image = '', image_urls } = doc_info;
      const { wm_id = '', disable_op = 0, ncat_class = [], nsubcat_class = [] } = push_status;

      const rec_tags = {};

      // 新增标签处理
      const doc_tags = await this.getDocRecTags(docid);
      const tags_user = await this.getChannelUserCount(Object.keys(doc_tags));
      const doc_cate = await this.getCateIdMap(ncat_class, nsubcat_class);
      const cate_user = await this.getChannelUserCount(Object.keys(doc_cate));

      for (const tag in tags_user) {
        if (tags_user[tag]) {
          rec_tags[tag] = `${doc_tags[tag]}_${tags_user[tag]}`;
        }
      }
      for (const cate in cate_user) {
        if (cate_user[cate]) {
          rec_tags[cate] = `${doc_cate[cate]}_${cate_user[cate]}`;
        }
      }

      const copyright_risk = (disable_op >> 3 && 1) === 1;

      // 身边five 状态为Serving,可正常推送，否则返回原因
      if (status === 'Serving' && bizId === 'LOCALSIDE') {
        return this.json({
          status: 'success',
          result: {
            image,
            title,
            summary,
            image_urls,
            ncat: ncat_class[0],
            nsubcat: nsubcat_class[0],
            rec_tags,
            serving_status: true,
          },
        });
      }
      // 一点客户端 认为服务状态为白名单包含 或者无版权风险且状态为Serving,可正常推送，否则返回原因
      if (
        (white_list.includes(wm_id) || copyright_risk === false) &&
        status === 'Serving' &&
        bizId === 'YDZX'
      ) {
        return this.json({
          status: 'success',
          result: {
            image,
            title,
            summary,
            image_urls,
            ncat: ncat_class[0],
            nsubcat: nsubcat_class[0],
            rec_tags,
            serving_status: true,
          },
        });
      }

      console.log(copyright_risk, reason, copyright_risk ? '版权风险，不可推送' : reason);

      return this.json({
        status: 'success',
        result: {
          image,
          title,
          summary,
          image_urls,
          ncat: ncat_class[0],
          nsubcat: nsubcat_class[0],
          rec_tags,
          serving_status: false,
          serving_info: copyright_risk ? '版权风险，不可推送' : reason,
        },
      });
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // 获取源白名单, 失败不抛错，返回空值
  async getPushWhitelist() {
    const whitelist_res = await axios.get(
      `${this.config('PUSH_CONFIG').push}/editor/get-source-list`,
    );

    if (whitelist_res.data.status === 'success') {
      return whitelist_res.data.list.map(item => item.id);
    } else {
      return [];
    }
  }

  // 获取文章的服务状态：如文章scope值的判定， 失败不抛错，返回空值
  async getDocServingStatus(docid, bizId) {
    const serving_res = await axios.get(
      `${this.config('PUSH_CONFIG').article}/news_editor/php/watch.php?id=${docid}&biz_id=${bizId}`,
    );

    return serving_res.data;
  }

  // 从doc-feature获取文章的可推送状态，通过disable_op字段进行判断
  async getDocPushStatus(docid) {
    const doc_push_res = await axios(
      `${
        this.config('PUSH_CONFIG').doc_feature
      }?service=editor_push&fields=disable_op,wm_id,ncat_class,nsubcat_class&docids=${docid}`,
    );

    // console.log(doc_push_res.data, 'get doc push status')

    if (doc_push_res.data.status === 'success') {
      return (doc_push_res.data.result && doc_push_res.data.result[0]) || {};
    } else {
      return {};
    }
  }

  // 获取文章信息：如标题、配图等, 失败时不抛错，返回空值
  async getDocInfo(docid) {
    const info_res = await axios.get(
      `${
        this.config('API_URL').a2
      }/contents/content-meta?fields=title&version=999999&docid=${docid}`,
    );

    // console.log(info_res.data, 'get doc info')

    if (
      info_res.data.status !== 'success' ||
      !info_res.data.documents ||
      info_res.data.documents.length === 0
    ) {
      return {};
    } else {
      return info_res.data.documents[0];
    }
  }

  // 获取文章推荐标签，以[key]: value的形式返回。失败不抛错，以空值返回
  async getDocRecTags(docid) {
    // 这个接口没啥用， 还一直报错，先这样了
    return {}
    const rec_res = await axios.get(
      `${this.config('PUSH_CONFIG').lc1}/relatedchannel/pushchannel?docid=${docid}`,
    );

    // console.log(rec_res.data, 'get doc rec tags')

    if (rec_res.data.status !== 'success') {
      return {};
    }

    const tag_name_map = {};
    const none_empty_tags = rec_res.data.result
      ? rec_res.data.result.filter(item => item.fromId)
      : [];

    for (const { fromId, name } of none_empty_tags) {
      tag_name_map[fromId] = name;
    }

    return tag_name_map;
  }

  // 获取applo中的大小类名称id映射
  async getCateMapList() {
    const cate_map_res = await axios.get(
      `${this.config('APOLLO')}/editor-push-news/default/operation.database`,
    );

    // console.log(cate_map_res.data, 'get cate map list')

    if (!cate_map_res.data.catEnum) {
      return {};
    }

    return JSON.parse(cate_map_res.data.catEnum);
  }

  // 获取对应的cate和id之间的映射关系
  async getCateIdMap(ncate, nsubcate) {
    const cate_map_list = await this.getCateMapList();
    const cate_id_map = {};

    for (const item of ncate) {
      cate_id_map[cate_map_list[item]] = `${item}(大类)`;
    }
    for (const item of nsubcate) {
      cate_id_map[cate_map_list[item]] = `${item}(小类)`;
    }

    return cate_id_map;
  }

  /**
   * 获取 oppo push 配额是否使用完
   * @returns
   */
  async getOppoPushIsOverAction() {
    try {
      const quota_res = await axios.get(
        `${this.config('PUSH_CONFIG').oppoPushIsOver}/pushUnity/getChannelQuota`,
      );
      if (quota_res.data.status === 'success') {
        return this.json({
          status: 'success',
          // result: {
          //   result: [
          //     {
          //       'appId': 'yidian',
          //       'channel': 'OPPO',
          //       'num': 0
          //     }
          //   ],
          //   code: 0
          // }
          result: quota_res.data,
        });
      } else {
        throw new Error(quota_res.data.desc);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  /**
   * 获取oppo xiaomi 预算预警
   * oppoPushIsOvwer------oppo限额和oppo xiaomi 预算预警的线上和线下的域名是一样的
   * @returns
   */
  async getPushStatisticsAction() {
    try {
      const warning_res = await axios.get(
        `${this.config('PUSH_CONFIG').oppoPushIsOver}/push_statistics/channel_warning`,
      );
      if (warning_res.data.status === 'success') {
        return this.json({
          status: 'success',
          result: warning_res.data,
        });
      } else {
        throw new Error(warning_res.data.desc);
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        message: err.toString(),
      });
    }
  }

  // // 上传推送配图
  // async pushimageAction() {
  //   const type = this.get('type') || 'normal';
  //   const file = this.file('file');

  //   console.log(type, 'type');

  //   try {
  //     if (!file || !file.path) {
  //       throw new Error('上传配图为空');
  //     }

  //     let image_url = '';

  //     if (type === 'normal') {
  //       image_url = await this.uploadNormalImage(file);
  //     }
  //     if (type === 'xiaomi') {
  //       image_url = await this.uploadXiaomiImage(file);
  //     }

  //     console.log(image_url, 'image url');

  //     return this.json({
  //       status: 'success',
  //       result: image_url,
  //     });
  //   } catch (err) {
  //     return this.json({
  //       status: 'failed',
  //       message: err.toString(),
  //     });
  //   }
  // }

  // // 上传图片
  // async uploadNormalImage(file) {
  //   const formdata = {
  //     pic: {
  //       value: fs.createReadStream(file.path),
  //       options: { contentType: 'image/png' },
  //     },
  //   };
  //   const url = `${this.config('PUSH_CONFIG').image}/image?action=insert&type=editor`;

  //   return new Promise((resolve, reject) => {
  //     request.post(url, formdata, (err, res, body) => {
  //       console.log(body, 'body');
  //       if (err || !body) {
  //         reject(err || '上传失败');
  //       }
  //       const json_body = body ? JSON.parse(body) : {};

  //       if (json_body.status === 'success') {
  //         resolve(json_body.url);
  //       } else {
  //         reject(json_body.reason || err);
  //       }

  //       // 小米 上传 成功 {"result":"ok","trace_id":"Xdm5985259339548194541","code":0,"data":{"icon_url":"http://t3.market.mi-img.com/thumcrop/webp/h120/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/icon.webp?crop=l276r600","sha1":"e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd","pic_url":"http://f6.market.xiaomi.com/download/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd.png"},"description":"成功"}
  //       // 一点 上传 成功 {"status":"success","url":"https:\/\/si1.go2yd.com\/get-image\/0hmwCQazbFo","format":"PNG","size":[288,288]}
  //     });
  //   });
  // }

  // async uploadXiaomiImage(file) {
  //   const formdata = {
  //     is_global: 'false',
  //     is_icon: 'false',
  //     file: {
  //       value: fs.createReadStream(file.path),
  //       options: { filename: 'file.png', contentType: file.type || 'image/png' },
  //     },
  //   };
  //   const url = `${this.config('PUSH_CONFIG').xiaomi}/media/upload/image`;

  //   return new Promise((resolve, reject) => {
  //     request.post(url, formdata, function(err, res, body) {
  //       console.log(body);
  //       if (err || !body) {
  //         reject(err || '上传失败');
  //       }
  //       const json_body = body ? JSON.parse(body) : {};

  //       if (json_body.status === 'success') {
  //         resolve(json_body.data.pic_url);
  //       } else {
  //         reject(json_body.reason || err);
  //       }
  //     });
  //   });
  // }
};
