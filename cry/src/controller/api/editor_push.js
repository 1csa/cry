const Base = require('../base');
const fs = require('fs');
const request = require('request');

const PUSH_CHANNEL_SEARCH_HOST = 'http://lion-assistant.int.yidian-inc.com/service/assistant2';
const APOLLO_HOST =
  'http://apollo-configcenter.ha.in.yidian.com:8108/configfiles/json/editor-push-news/default';
const API_COMMENT_HOST = 'http://m.v.yidian-inc.com';
const API_A2_HOST = 'http://a2.v.yidian-inc.com';
const API_A4_HOST = 'http://a4.go2yd.com.ha.in.yidian.com';
const IMAGE_HOST = 'http://static_image_api.ha.in.yidian.com/image?action=insert&type=editor';
const XIAOMI_IMAGE_HOST = 'https://api.xmpush.xiaomi.com/media/upload/image';
const NEW_PUSH_API_HOST = 'http://push.yidian.com';
const OLD_PUSH_API_HOST = 'http://push_task.ha.in.yidian.com:8703';
const PAUSE_HOST = 'http://infoflow-push-keep-intercept-api-prod.yidian-inc.com';

module.exports = class extends Base {
  constructor(props) {
    super(props);
  }

  // 初始化 将 JEMAILID 写入到 cookie 中
  // 但是 username 可能不是邮箱这个怎么整啊
  indexAction() {
    const email = this.cookie('username').indexOf('@yidian-inc.com')
      ? this.cookie('username')
      : this.cookie('username') + '@yidian-inc.com';
    const JEMAILID = this.cookie('JEMAILID');
    if (!JEMAILID) {
      this.cookie('JEMAILID', email, {
        maxAge: 60 * 60 * 8 * 1000,
        path: '/',
        httpOnly: false,
        domain: '.yidian-inc.com',
      });
    }
  }

  // 获取 push 历史
  async getPushHistoryAction() {
    const { docid, channel } = this.get();

    const { status, related_push } = await this.fetch(
      `${OLD_PUSH_API_HOST}/push/gen_push_notify.php?docid=${docid}&channel=${channel}`,
    ).then(res => res.json());
    if (status === 'success') {
      const pushIds = (related_push && related_push.map(item => item.push_id)) || [];

      const { status, result } = await this.getPauseInfoByPushId(pushIds);
      if (status === 'success') {
        const pauseMap = {};
        result.forEach(item => (pauseMap[item.pushId] = push));

        related_push.forEach(item => {
          if (item.push_id in pauseMap) {
            item.head = pushMap[item.push_id].newTitle || item.head;
            item.title = pushMap[item.push_id].newSummary || item.title;
          }
          item.pause = (pauseMap[item.push_id] && pauseMap[item.push_id].pause) || false;
        });
      }
    } else {
      return this.json({
        status: 'failed',
        reason: `get push history failed, url ${OLD_PUSH_API_HOST}/push/gen_push_notify.php?docid=${docid}&channel=${channel}`,
      });
    }

    this.json({
      status: 'success',
      data: related_push,
    });
  }

  // 获取 文章 pause 信息
  async getPauseInfoByPushId(pushIds) {
    pushIds = pushIds.join(',');

    const res = await this.fetch(`${PAUSE_HOST}/find?pushIds=${pushIds}`);
    if (Array.isArray(res)) {
      return this.json({
        status: 'success',
        result: res,
      });
    } else {
      return res; // res 是 json 吗？
    }
  }

  // 搜索频道
  async searchChannelAction() {
    const { keyword } = this.get();

    if (!keyword) {
      return this.json({
        status: 'failed',
        reason: 'keyword not null',
      });
    }

    const res = await this.fetch(
      `${PUSH_CHANNEL_SEARCH_HOST}?word=${encodeURIComponent(keyword)}&count=50&edit=*`,
    ).then(res => res.json());
    let searchChannelRes;

    if (res.status === 'success') {
      searchChannelRes = res.channels.reduce((prev, cur) => {
        return [
          ...prev,
          {
            fromId: cur.id,
            name: cur.name,
            type: cur.type,
          },
        ];
      }, []);
    }

    // 因 标签上不用展示 人数 注释掉下面逻辑
    const channelUserCountMap = await this.getChannelUserCountByChannelIds(searchChannelRes);
    searchChannelRes = this.mergeChannelWithUserCount(searchChannelRes, channelUserCountMap);

    // console.log(searchChannelRes)
    this.json({
      status: 'success',
      data: searchChannelRes,
    });
  }

  // 获取频道下用户订阅数
  async getChannelUserCountByChannelIds(channels) {
    const channelIds = channels.map(item => item.fromId).join(',');

    const res = await this.fetch(
      `${OLD_PUSH_API_HOST}/push/get_channel_user_count.php?channel_id=${channelIds}`,
    ).then(res => res.json());

    if (res.status === 'success') {
      return res.result;
    }
    return {};
  }

  // 合并 搜索结果 和 订阅数
  mergeChannelWithUserCount(searchChannelRes, channelUserCountMap) {
    searchChannelRes =
      searchChannelRes.map(item => {
        item.userCount = Number(channelUserCountMap[item.fromId]) || 0;
        return item;
      }) || [];
    return searchChannelRes;
  }

  // 获取 editor push 相关枚举
  async getPushtypeEnumAction() {
    const res = await this.fetch(`${APOLLO_HOST}/operation.database`).then(res => res.json());
    // res 不为空对象
    if (Object.keys(res).length) {
      return this.json({
        status: 'success',
        data: {
          usersEnum: JSON.parse(res.usersEnum) || [],
          triggerTypeEnum: JSON.parse(res.triggerTypeEnum) || [],
          statusEnum: JSON.parse(res.statusEnum) || [],
          appidEnum: JSON.parse(res.appidEnum) || [],
        },
      });
    } else {
      return this.json({
        status: 'failed',
        reason: `get pushtype enum failed, url: ${APOLLO_HOST}/operation.database`,
      });
    }
  }

  // 获取 account 相关枚举
  async getAccountEnumAction() {
    const res = await this.fetch(`${APOLLO_HOST}/operation.database`).then(res => res.json());
    // res 不为空对象
    if (Object.keys(res).length) {
      return this.json({
        status: 'success',
        data: {
          permissionEnum: JSON.parse(res.permissionEnum) || [],
        },
      });
    } else {
      return this.json({
        status: 'failed',
        reason: `get account enum failed, url: ${APOLLO_HOST}/operation.database`,
      });
    }
  }

  // 根据 docid 判断文章状态 获取文章信息
  async getArticleInfoByDocidAction() {
    const { docid } = this.get();
    if (!docid) {
      return this.json({
        status: 'failed',
        reason: 'docid not null',
      });
    }

    const { status: servingStatus } = await this.fetch(
      `${API_COMMENT_HOST}/news_editor/php/watch.php?id=${docid}`,
    ).then(res => res.json());
    if (servingStatus === 'Serving') {
      const { status, documents } = await this.fetch(
        `${API_A2_HOST}/Website/contents/content-meta?docid=${docid}&fields=title&version=999999`,
      ).then(res => res.json());
      if (status === 'success' && documents.length > 0) {
        return this.json({
          status: 'success',
          title: documents[0].title,
          articleImages: [...new Set([...documents[0].image_urls, documents[0].image])],
        });
      } else {
        return this.json({
          status: 'failed',
          reason: `get article info failed, docid ${docid}`,
        });
      }
    } else {
      return this.json({
        status: 'failed',
        reason: `article is not serving, docid ${docid}`,
      });
    }
  }

  // 上传 push 图片
  // type '' 表示上传内网 xiaomi 表示上传至小米
  async uploadPushImageAction() {
    const { type } = this.get();
    const file = this.file('file');

    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        reason: 'upload image is null',
      });
    }

    const formData = type
      ? {
          is_global: 'false',
          is_icon: 'false',
          file: {
            value: fs.createReadStream(file.path),
            options: {
              filename: 'file.png',
              contentType: 'image/png',
            },
          },
        }
      : {
          pic: {
            value: fs.createReadStream(file.path),
            options: {
              contentType: 'image/png',
            },
          },
        };
    const url = type ? XIAOMI_IMAGE_HOST : IMAGE_HOST;
    const header = type ? { Authorization: 'key=bs8gNxzMdfwj53+JYGAvkg==' } : {};

    const res = await this.upload(url, formData, header);

    this.body = res;
  }

  // 真正的上传
  async upload(url, formData, header = {}) {
    // console.log('url: ', url, 'formData: ', formData, 'header: ', header)
    return new Promise((resolve, reject) => {
      request.post({ url, formData, headers: header }, (err, res, body) => {
        console.log(body);
        body = JSON.parse(body);

        const result = {
          status: 'success',
        };

        // 小米 上传 成功 {"result":"ok","trace_id":"Xdm5985259339548194541","code":0,"data":{"icon_url":"http://t3.market.mi-img.com/thumcrop/webp/h120/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/icon.webp?crop=l276r600","sha1":"e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd","pic_url":"http://f6.market.xiaomi.com/download/MiPass/048fcd5742c494eab1edd1dc00e60d5693865c4e5/e1d864a4d4ef5cfdcf1651b69e38f214ac873bdd.png"},"description":"成功"}
        // 一点 上传 成功 {"status":"success","url":"https:\/\/si1.go2yd.com\/get-image\/0hmwCQazbFo","format":"PNG","size":[288,288]}
        if ((body.status === 'success' && body.url) || body.result === 'ok') {
          result.url = body.url || body.data.pic_url;
        } else {
          result.status = 'failed';
          result.reason = 'upload failed';
        }
        resolve(result);
      });
    });
  }

  // push 前 针对 docic title summary 复检
  async getDuplicateCheckAction() {
    const { docid, title, summary } = this.get();

    let { status, duplicate_push, title_duplicate_push, summary_duplicate_push } = await this.fetch(
      `${NEW_PUSH_API_HOST}/content/duplicate-check?filter_push_types=49,50&docid=${docid}&title=${encodeURIComponent(
        title,
      )}&summary=${encodeURIComponent(summary)}`,
    ).then(res => res.json());

    if (status === 'success') {
      // 拿到所有的 fromid 去重
      // 因为我最后 是 返回一个数组 所以要提前标注下 重复原因
      duplicate_push = duplicate_push.map(item => ({ ...item, reason: 'docid' }));
      title_duplicate_push = title_duplicate_push.map(item => ({ ...item, reason: 'title' }));
      summary_duplicate_push = summary_duplicate_push.map(item => ({ ...item, reason: 'summary' }));

      let temp = [...duplicate_push, ...title_duplicate_push, ...summary_duplicate_push];

      temp = temp.map(item => {
        const { include_channels, exclude_channels } = item;
        item.include_channels = include_channels ? include_channels.split('/') : [];
        item.exclude_channels = exclude_channels ? exclude_channels.split('/') : [];
        return item;
      });

      let fromids = temp.reduce(
        (prev, cur) => [...prev, ...cur.include_channels, ...cur.exclude_channels],
        [],
      );
      fromids = [...new Set(fromids)];

      // 拿到 fromid 的映射
      const channelInfoMap = await this.getChannelDetailByFromids(fromids);
      temp = temp.map(item => {
        const { include_channels, exclude_channels } = item;
        item.include_channels = include_channels.map(fromid => ({
          channelId: fromid,
          info: channelInfoMap[fromid],
        }));
        item.exclude_channels = exclude_channels.map(fromid => ({
          channelId: fromid,
          info: channelInfoMap[fromid],
        }));
        return item;
      });

      return this.json({
        status: 'success',
        data: temp,
      });
    } else {
      return this.json({
        status: 'failed',
        reason: `${NEW_PUSH_API_HOST}/content/duplicate-check?filter_push_types=49,50&docid=${docid}&title=${encodeURIComponent(
          title,
        )}&summary=${encodeURIComponent(summary)} failed`,
      });
    }
  }

  // 通过 fromid 获取 channel 信息
  async getChannelDetailByFromids(fromids) {
    const { status, result } = await this.fetch(
      `${API_A4_HOST}/Website/mysql/default-channel?ids=${fromids.join(
        ',',
      )}&fields=topicName&edit=*`,
    ).then(res => res.json());

    if (status === 'success') {
      return result;
    } else {
      return {};
    }
  }

  // 真正的推送
  async pushNewsAction() {
    const { isForce, isTest } = this.get();
    const data = this.post();

    console.log('=============== push news data start ==============');
    console.log(data);
    console.log('=============== push news data end ==============');

    const pushUrl = this.formatPushUrl(data, isForce, isTest);
    console.log('pushUrl=' + pushUrl);

    const res = await this.fetch(pushUrl, { method: 'GET', timeout: 20000 }).then(res =>
      res.json(),
    );
    this.json(res);
  }

  // 整理 pushUrl
  formatPushUrl(data, isForce, isTest) {
    let pushUrl = `${OLD_PUSH_API_HOST}/push/add_task.php?back_btn_bubble_num=12&show_tips=0&back_btn_show_bubble=1&exclude_channel=${encodeURIComponent(
      data.excludeTags,
    )}&largeEventLevel=&docid=${data.docid}&userids=${data.user}&type=editor&key=${
      data.key
    }&title=${encodeURIComponent(data.summary)}&head=${encodeURIComponent(data.title)}&sound=${
      data.sound
    }&bonus=${data.bonus}&exapps=${data.exappid}&template=summary&xiaomi_priority=${
      data.xiaomi_priority
    }`;

    if (isForce) {
      pushUrl += '&ignore_cache=1';
    }

    if (isTest) {
      pushUrl += '&is_test=1';
    }

    if (data.tags) {
      pushUrl += `&channel=${encodeURIComponent(data.tags)}`;
    }

    // 交集标签
    if (data.inter_channel) {
      pushUrl += `&inter_channel=${encodeURIComponent(data.inter_channel.join(','))}`;
    }

    if (data.img) {
      pushUrl += `&img_url=${encodeURIComponent(data.img)}`;
    }

    if (data.appid) {
      pushUrl += `&apps=${encodeURIComponent(data.appid)}`;
    }

    if (data.platform) {
      pushUrl += `&platform=${encodeURIComponent(data.platform)}`;
    }

    if (data.sync_platform) {
      pushUrl += `&sync_platform=${encodeURIComponent(data.sync_platform)}`;
    }

    if (data.cate) {
      pushUrl += `&cate=${data.cate}`;
    }

    if (data.user_layer_channel) {
      pushUrl += `&user_layer_channel=${data.user_layer_channel.join(',')}`;
    }

    if (data.rstype) {
      pushUrl += `&rstype=${data.rstype}`;
    }

    if (data.inVersion) {
      pushUrl += `&version=${data.inVersion}`;
    }

    if (data.exVersion) {
      pushUrl += `&exclude_version=${data.exVersion}`;
    }

    if (data.inClientVersion) {
      pushUrl += `&cv=${data.inClientVersion}`;
    }

    if (data.exClientVersion) {
      pushUrl += `&exclude_cv=${data.exClientVersion}`;
    }

    if (data.expireTime) {
      pushUrl += `&expire_time=${data.expireTime}`;
    }

    if (data.retrieve_strategy) {
      pushUrl += `&retrieve_strategy=${data.retrieve_strategy}`;
    }

    if (data.veins_docids) {
      pushUrl += `&veins_docids=${data.veins_docids}`;
    }

    return pushUrl;
  }
};
