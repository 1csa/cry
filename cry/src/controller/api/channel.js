const Base = require('../base')
const fs = require('fs')
const path = require('path')
const request = require('request');
const axios = require('axios');
const appxUsers = require('./channel_data');
// todo 先注释掉 redis 相关代码
// const redis = require('redis')

// const client = redis.createClient({
//   host: '10.103.16.10',
//   port: '6379'
// })

// client.select(2)
// client.on('error', err => {
//   console.log('redis error: ', err)
// })
// const mSetRedis = think.promisify(client.mset, client)
// const mGetRedis = think.promisify(client.mget, client)
// const expireRedis = think.promisify(client.expire, client)
const LION_API = `http://lion-assistant.int.yidian-inc.com/service/assistant2` // 推荐 王发北
const PUSH_TASK_API = `http://push_task.ha.in.yidian.com:8703/push/get_channel_user_count.php` // 运营中台 光明
const A2_API = `http://a2.v.yidian-inc.com/Website` // 主端 api 姜庆川 推荐内容源接口
const REC_PROPS_API = 'http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get';
const SEARCH_URL_API = `http://docidgen.ha.in.yidian.com:6001/id/find` // 内容中台 武文韬
const DOC_DATA_API = `http://dw.api.channel.yidian-inc.com/data/get_cfb_data` // 数据组 刘江宁
const AUTH_API = `http://pandora.yidian-inc.com/tools/auth/index` // 主端 超伍
const LOG_API = `http://10.136.46.20:9200/webuilog-pandora-*/_search`
// const DOC_FEATURE_API = `http://lc1.haproxy.yidian.com:7001` // 推荐 玉波
const DOC_FEATURE_API = `http://contech.dynamic-feature.int.yidian-inc.com` // 推荐 玉波
const CHANNEL_API = `http://index-info.int.yidian-inc.com/Website/mysql/default-channel` // 推荐 玉波
const OPMG_API = `http://operationtoolservice.int.yidian-inc.com/OperationtoolService` // 运营中台 光明
const UPLOAD_URL = 'http://static_image_api.ha.in.yidian.com/image?action=insert&type=editor'; //图片上传
const API_URI_A1 = 'http://a1.v.yidian-inc.com/Website';
const API_URI_A4 = "http://a4.v.yidian-inc.com/Website"; //新快讯接口

module.exports = class extends Base {
  constructor (props) {
    super(props)

    const db = think.env === 'production' ? 'mongo_editor' : 'mongo'
    const db2 = 'mongo_editor'

    this.channelEdit = this.model('app/channel/channelEdit', db)
    this.channelFavs = this.model('app/channel/channelFavs', db2) // 这里注意收藏频道连的是线上库！！！！！！！
    this.topNews = this.model('app/channel/topNews', db)
    this.syncTopNews = this.model('app/channel/syncTopNews', db)
  }

  // indexAction () {
  //   console.log(think.env, 111)
  // }

  /**
   * 侧边栏相关
   */
  // 根据关键词搜索特殊频道
  async searchChannelEditAction () {
    const { keyword = '' } = this.get()
    if (!keyword) {
      return this.json({
        status: 'failed',
        reason: 'keyword 不能为空'
      })
    }
    const condition = { name: { '$regex': `${keyword}` }, type: 'cates' }
    try {
      const res = await this.channelEdit.searchChannelEdit(condition)
      if (res) {
        return this.json({
          status: 'success',
          data: res
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 根据关键词搜索普通频道
  async searchChannelAllAction () {
    const { keyword = '' } = this.get()
    if (!keyword) {
      return this.json({
        status: 'failed',
        reason: 'keyword 不能为空'
      })
    }
    try {
      // const { status, channels } = await this.fetch(`${LION_API}?word=${encodeURIComponent(keyword)}&count=30&edit=*`).then(res => res.json())
      const { status, channels } = await this.fetch(`${LION_API}?word=${encodeURIComponent(keyword)}&edit=*`).then(res => res.json())
      let fromids = []
      if (status === 'success') {
        fromids = channels.map(item => item.id)
      }
      // console.log(status, channels, fromids)
      const userCount = await this.getChannelUserCountByFromid(fromids)
      channels.forEach(item => {
        item.userCount = userCount[item.id] || userCount[item.id + '_p'] || 0
      })
      return this.json({
        status: 'success',
        data: channels
      })
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 根据 userid 获取收藏频道
  async getFavsByUseridAction () {
    const uid = this.cookie('YD_PANDORA_UID')
    if (!uid) {
      return this.json({
        status: 'failed',
        reason: 'YD_PANDORA_UID 不能为空'
      })
    }
    const condition = { _id: uid + '' }
    try {
      const { _id, channel = [] } = await this.channelFavs.getFavsByUserid(condition)
      if (channel) {
        return this.json({
          status: 'success',
          data: channel
        })
      } else {
        return this.json({
          status: 'failed',
          reason: `db error, ${err}`
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 更新收藏频道 todo test
  async updateFavsByUseridAction () {
    const uid = this.cookie('YD_PANDORA_UID') || ''
    const data = this.post() || {}
    // console.log(data)
    if (!uid) {
      return this.json({
        status: 'failed',
        reason: 'YD_PANDORA_UID 不能为空'
      })
    }
    const condition = { _id: uid + '' }
    try {
      console.time('search favs')
      const { channel } = await this.channelFavs.getFavsByUserid(condition);
      console.timeEnd('search favs')
      let res = undefined
      console.time('upsert favs')
      if (channel) {
        res = await this.channelFavs.updateFavs(condition, { channel: data.favs })
      } else {
        res = await this.channelFavs.addFavs({ _id: uid + '', channel: data.favs })
      }
      console.timeEnd('upsert favs')
      if (res) {
        return this.json({
          status: 'success',
          data: res
        })
      } else {
        return this.json({
          status: 'failed',
          reason: 'db error'
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  /**
   * 置顶相关
   */
  // 获取 频道 类型
  async getChannelPropsAction () {
    const { fromid } = this.get()
    try {
      const { status, result } = await this.fetch(`${CHANNEL_API}?id=${ fromid }&opt=read&fields=*&edit=*`).then(res => res.json())
      if (status === 'success') {
        return this.json({
          status,
          data: result
        })
      } else {
        return this.json({
          status: 'failed',
          reason: `${CHANNEL_API}?id=${ fromid }&opt=read&fields=*&edit=* failed`
        })
      }
    } catch (err) {
      return res.json({
        status: 'failed',
        reason: err.message
      })
    }

  }

  /**
   * @return 通过keyword搜索 推荐内容源的内容
   */
  async searchByKeywordAction () {
    const keyword = this.get('keyword') || ''; //input输入参数
    const order = this.get('order') || ''; //排序
    const days = this.get('days') || 360; //日期参数
    const src = this.get('src') || ''; //源名称参数

    if (!keyword) {
      return this.json({
        status: 'failed',
        reason: '关键字keyword 是必须的'
      });
    }

    let srcParam = src ? '&fq=src:' + encodeURIComponent(src) : ''; // 源名称
    let url = `${A2_API}/channel/news-list-for-keyword?days=${days}${srcParam}&rewrite=false&word_type=token&display=${encodeURIComponent(keyword)}&search=true&cstart=0&cend=800&fields=title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date&infinite=false&request_source=oak&version=999999&ranker=${ order ? order : 'search'}`;
    let recListData = await this.fetch(url, {
      method: 'GET',
      headers: {
        cookie: 'JSESSIONID=constant-session-1'
      }
    }).then(res => res.json());
    if (recListData && recListData.status === 'success') {
      this.json({
        data: recListData,
        status: "success",
      });
    } else {
      this.json({
        status: 'failed',
        reason: `数据接口为空!【api】${url}`,
        data: {}
      })
    }
  }

  // 根据 docid 搜索文章
  async searchByDocidAction () {
    const { docid = '' } = this.get()
    if (!docid) {
      return this.json({
        status: 'failed',
        reason: 'docid 不能为空'
      })
    }
    const url = `${A2_API}/contents/content-meta?docid=${docid}&fields=title&fields=source&fields=date&fields=url&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=security&version=999999`
    try {
      const { status, documents } = await this.fetch(url, { headers: { cookie: 'JSESSIONID=constant-session-1' } }).then(res => res.json())
      if (status === 'success') {
        return this.json({
          status: 'success',
          data: documents[0]
        })
      } else {
        return this.json({
          status: 'failed',
          reason: `${A2_API}/contents/content-meta?docid=${docid}&fields=title&fields=source&fields=date&fields=url&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=security&version=999999 failed`
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 根据 url 搜索文章
  async searchByUrlAction () {
    const { url = '' } = this.get()
    if (!url) {
      return this.json({
        status: 'failed',
        reason: 'url 不能为空'
      })
    }
    const uid = this.cookie('YD_PANDORA_UID') || ''
    try {
      const { status, result } = await this.fetch(`${SEARCH_URL_API}?url=${url}&uid=${uid}`).then(res => res.json())
      if (status === 'success') {
        if (result.id || result._id) {
          const docid = result.id || result._id
          this.redirect(`searchByDocid?docid=${docid}`)
        } else {
          return this.json({
            status: 'failed',
            reason: `数据接口为空或文章没有入库，请通过 <a href="http://pandora.yidian-inc.com/tools/newspublish" target="_blank">newspublish</a> 工具手动发文! ${url}`
          })
        }
      } else {
        return this.json({
          status: 'failed',
          reason: `${SEARCH_URL_API}?url=${url}&uid=${uid} failed`
        })
      }
    } catch (err) {
      this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 获取置顶新闻列表
  async getTopNewsByFromidAction () {
    const { fromid } = this.get()
    if (!fromid) {
      return this.json({
        status: 'failed',
        reason: 'fromid 不能为空'
      })
    }
    try {
      const topNews = await this.topNews.getTopNews({ _id: fromid })
      topNews.top_news = topNews.top_news || []
      topNews.del_news = topNews.del_news || []
      if (topNews) {
        return this.json({
          status: 'success',
          data: topNews
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 查询某个docid 是否已经置顶了
  async getDocIsTopAction () {
    // const { fromid } = this.get()
    try {
      const topNews = await this.topNews.onlyGetTopNews()
      const obj = {}
      let count = 0
      let currentTime = +new Date()
      topNews.forEach(item => {
        let subArr = item.top_news
        subArr.forEach(subItem => {
          let subDate = +new Date(subItem['date'])
          let dateTemp = 7 * 24 * 60 * 60 * 1000
          if (currentTime - subDate < dateTemp) { // 7天内的数据，7天之前的置顶就不算置顶了，垃圾数据
            if (!obj[subItem['docid']]) {
              obj[subItem['docid']] = 1
            } else {
              obj[subItem['docid']]++
            }
            count++
          }
        })
      })
      if (topNews) {
        return this.json({
          status: 'success',
          count,
          data: obj,
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 保存置顶新闻列表
  async saveTopNewsAction () {
    const { topInfo, topInfo: { _id: fromid, lifespan, top_news = [], manual, is_top, topcount = 0, priority = 0 } } = this.post()

    if (!topInfo || !fromid) {
      return this.json({
        status: 'failed',
        reason: 'topInfo or fromid not null'
      })
    }

    top_news.forEach(v => {
      delete v.data
      this.updateScStky(v.docid)
      this.clearScope(v.docid)
    })

    // todo 全局热点相关 邮件

    const top_ts = +new Date()
    let setOp = {
      $set: {
        top_news: top_news,
        top_ts: top_ts,
        // rec_news: rec_news,
        // rec_ts: rec_ts,
        manual: manual || false,
        is_top: is_top || false
      }
    }

    if (topcount) {
      setOp.$set.topcount = topcount || 0
    }
    if (priority) {
      setOp.$set.priority = priority || 0
    }

    if (!isNaN(lifespan)) {
      setOp.$set.lifespan = lifespan
    } else {
      setOp.$unset = { lifespan: '' }
    }

    console.log(topInfo)
    // return this.json({
    //   status: 'success'
    // })
    const condition = { _id: fromid }
    try {
      // 存在新增和编辑
      const count = await this.topNews.getTopNewsCount(condition)
      let saveTopRes
      if (count === 0) {
        const data = {
          _id: fromid,
          top_news,
          top_ts,
          // rec_news,
          // rec_ts,
          manual: manual || false,
          is_top: is_top || false
        }
        saveTopRes = await this.topNews.addTopNews(data)
      } else {
        saveTopRes = await this.topNews.updateTopNews(condition, setOp)
      }

      if (saveTopRes) {
        this.json({
          status: 'success',
          data: setOp
        })
      } else {
        this.json({
          status: 'failed',
          reason: saveTopRes
        })
      }
      let data_log =  {
        ts: Date.now(),
        id: fromid,
        list: top_news
      }
      await this.topNews.saveTopNewsLog(data_log)
    } catch (err) {
      this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 获取所有地区
  async getSubLocalChannelsAction () {
    const { currentChannel = '' } = this.get()
    const filePath = path.join(think.ROOT_PATH, '/src/controller/api/local_channel_hierarchy.json')
    const localChannelsHierarchy = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const currentChannelData = localChannelsHierarchy.filter(channel => channel.channel_name === currentChannel)
    let subChannels = []
    if (currentChannelData && currentChannelData.length && currentChannelData[0].subordinate) {
      subChannels = currentChannelData[0].subordinate
    }
    this.json({
      status: 'success',
      data: subChannels
    })
  }

  // 获取当前同步到的地区
  async getSyncedLocalChannelsAction () {
    const { fromid, syncNewsDocid } = this.get()
    const condition = { id: fromid, sync_news_docid: syncNewsDocid }
    try {
      let syncTopNewsArr = this.syncTopNews.getSyncTopNews(condition)
      if (!syncTopNewsArr.length) {
        return this.json({
          status: 'success',
          data: []
        })
      } else {
        // 降序 取第 1 个
        syncTopNewsArr.sort((a, b) => b.ts - a.ts)
        return this.json({
          status: 'success',
          data: syncTopNewsArr[0].list
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 保存选中的同步地区
  async saveSyncTopNewsAction () {
    const uid = this.cookie('YD_PANDORA_UID') || this.cookie('userid') || ''
    const { fromid, syncNewsDocid, list } = this.post()
    try {
      const data = {
        uid,
        ts: +new Date(),
        id: fromid,
        list,
        sync_news_docid: syncNewsDocid
      }
      const res = await this.syncTopNews.addSyncTopNews(data)
      if (res) {
        this.json({
          status: 'success'
        })
      } else {
        this.json({
          status: 'failed',
          reason: 'add sync top news failed'
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // todo 同步 topnews 到选中的下属地区?
  async syncSubChannelTopNewsAction () {
    const { syncChannelIds, cancelSyncChannelIds, syncNews } = this.post()
    syncNews = formatSyncNews(syncNews)
    // todo try for await of
    // sync channel
    for (let i = 0; i < syncChannelIds.length; i++) {
      console.log(`try to sync channel ${syncChannelIds[i]}`)
      await syncTopNewsToChannelByChannelId(this, syncChannelIds[i], syncNews, addNewsToTop)
    }
    // todo try for await of
    // cancel sync channel
    for (let i = 0; i < cancelSyncChannelIds.length; i++) {
      console.log(`try to cancel sync channel ${cancelSyncChannelIds[i]}, remove news from its top news list`)
      await syncTopNewsToChannelByChannelId(this, cancelSyncChannelIds[i], syncNews, removeNewsFromTopNewsList)
    }

    return this.json({
      status: 'success'
    })
  }

  // 格式化 syncNews 字段
  formatSyncNews (syncNews) {
    const news = {
      date: syncNews.date || '',
      count: syncNews.count || 0,
      title: syncNews.title || '',
      fromid: syncNews.fromid || '',
      docid: syncNews.docid || '',
      source: syncNews.source || '',
      image: syncNews.image || '',
      tag: syncNews.tag || '',
      is_news: syncNews.is_news || 0,
      dtype: syncNews.dtype || 0,
      group: syncNews.group || '',
      ctype: syncNews.ctype || '',
    }
    if (syncNews.title_new) {
      news.title_new = syncNews.title_new
    }
    if (syncNews.type) {
      news.type = syncNews.type
    }
    if (syncNews.dtype && parseInt(syncNews.dtype, 10)) {
      news.dtype = syncNews.dtype
    } else {
      news.dtype = 0
    }
    if (syncNews.cate) {
      news.cate = syncNews.cate
    }
    return news
  }

  // 挨个去 同步的频道 更新置顶列表
  async syncTopNewsToChannelByChannelId (self, fromid, news, syncNewsHandler) {
    const condition = { _id: fromid }
    try {
      const res = self.topNews.getTopNewsCount(condition)
      if (res === 0) {
        res = {
          _id: fromid,
          top_news: [],
          top_ts: +new Date(),
          // rec_news: []
        }
      } else {
        res.top_ts = +new Date()
      }
      res.top_news = syncNewsHandler(res.top_news, news)
      console.log('after sync, try to save below top_news list to do')
      console.log(res.top_news)

      let rows
      if (res === 0) {
        rows = await self.topNews.addTopNews(res)
      } else {
        row = await self.topNews.updateTopNews(condition, res)
      }

      if (row !== 0) {
        console.log(`sync channel: ${fromid} success`)
      } else {
        console.log(`sync channel: ${fromid} failed`)
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  // 把 news 插到置顶列表第一条
  addNewsToTop (topNewsList, news) {
    return [news, ...topNewsList]
  }

  // 从置顶列表中移除 news
  removeNewsFromTopNewsList (topNewsList, news) {
    return topNewsList.filter(item => item.docid !== news.docid)
  }

  // 获取所有大类
  async getCategoryAction () {
    const { appid = 'yidian' } = this.get()
    try {
      const { status, result } = await this.fetch(`${OPMG_API}/GetCategories?appid=${appid}`).then(res => res.json())
      if (status === 'success') {
        this.json({
          status,
          data: result
        })
      } else {
        this.json({
          status: 'failed',
          reason: `${OPMG_API}/GetCategories?appid=${appid} failed`
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }

  }

  // 根据大类查小类
  async getSubCategoryByCategoryAction () {
    const { appid = 'yidian', cate } = this.get()
    try {
      const { status, result } = await this.fetch(`${OPMG_API}/GetSubCategories?appid=${appid}&cate=${encodeURIComponent(cate)}`).then(res => res.json())
      if (status === 'success') {
        this.json({
          status,
          data: result
        })
      } else {
        this.json({
          status: 'failed',
          reason: `${OPMG_API}/GetSubCategories?appid=${appid}&cate=${encodeURIComponent(cate)} failed`
        })
      }
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  /**
   * 数据相关
   * todo 如果 装上 redis 逻辑又一定调整
   */
  // 根据 docid 获取文章数据
  async getDocDataAction () {
    const { fromid, display = 'default' } = this.get()
    const { docids } = this.post()
    const token = this.cookie('token') || ''
    if (!docids.length) {
      return this.json({
        status: 'failed',
        reason: 'docids 是必须的'
      })
    }
    const redisKeys = [...docids].map(item => `zeus:channel:docData:${fromid}:${item}`)
    let redisDocData = {}, paramDocids = docids
    // let redisDocData = {}, paramDocids = []

    // 从 redis 取 docData
    console.time('get doc data from redis')
    // let temp = await mGetRedis(redisKeys)
    // docids.forEach((item, i) => {
    //   if (!temp[i]) {
    //     paramDocids.push(item)
    //   } else {
    //     redisDocData[item] = JSON.parse(temp[i])
    //   }
    // })
    console.log(`有 ${Object.keys(redisDocData).length} 个 docid 通过 redis 拿到 docData`)
    console.timeEnd('get doc data from redis')

    // 发请求取 docData
    let docData = null
    if (paramDocids.length) {
      console.log(`有 ${paramDocids.length} 个 docid 没有通过 redis 拿到 docData 需要发送请求`)
      const url = `${DOC_DATA_API}?fromid=${fromid}&display=${display}`
      docData = await this.fetch(url, {
        method: 'POST',
        body: `docids=${paramDocids.join(',')}`,
        timeout: 10000,
        headers: {
          cookie: `JSESSIONID=${token}`,
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(res => res.json())
    } else {
      return this.json({
        status: 'success',
        data: redisDocData
      })
    }

    if (docData && docData.status === 'success') {
      let mSetValue = []
      for (let [k, v] of Object.entries(docData.result)) {
        const key = `zeus:channel:docData:${fromid}:${k}`
        mSetValue.push(key, JSON.stringify(v))
      }
      // if (mSetValue.length) {
      //   await mSetRedis(mSetValue)
      // }
      this.json({
        status: 'success',
        data: { ...docData.result, ...redisDocData }
      })

      // for (let i = 0; i < mSetValue.length; i+= 2) {
      //   await expireRedis(mSetValue[i], 600)
      // }
    } else {
      return this.json({
        status: 'failed',
        reason: `${DOC_DATA_API}?fromid=${fromid}&display=${display} failed`
      })
    }
  }

  /**
   * 日志相关
   */
  // 查询日志
  async getLogAction () {
    const { fromid = '*', docid = '*', username = '*', timeStart = null, timeEnd = null } = this.get()
    // const query = `log_source.tag: channel AND target_data.channelid: ${fromid} AND user.username: ${username} AND action_method: savetopnews_All AND target_data.detail: *${docid}*`
    const query = "log_source.tag: channel AND target_data.channelid: * AND user.username: * AND action_method: savetopnews_All AND target_data.detail: *"
    const body = {
      "query": {
        "bool": {
          "must": [{
            "query_string": {
              "query": query,
              "analyze_wildcard": true,
              "default_field": "*"
            }
          }, {
            "range": {
              "@timestamp": {
                "gte": timeStart,
                "lte": timeEnd,
                "format": "epoch_millis"
              }
            }
          }]
        }
      },
      "sort": [{
        "@timestamp": {
          "order": "desc",
          "unmapped_type": "boolean"
        }
      }]
    }
    try {
      const { hits: { hits }} = await this.fetch(`${LOG_API}?from=0&size=10`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      this.json({
        status: 'success',
        data: hits
      })
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  /**
   * 权限相关
   */
  // 根据 userid 获取权限
  async getChannelAuthAction () {
    const toolId = 13
    const token = this.cookie('YD_PANDORA_JWT_TOKEN') || ''
    if (!token) {
      return this.json({
        status: 'failed',
        reason: 'YD_PANDORA_JWT_TOKEN 不能为空'
      })
    }
    try {
      const { status, result } = await this.fetch(`${AUTH_API}?tool=${toolId}`, {
        headers: {
          cookie: this.ctx.header.cookie
        }
      }).then(res => res.json())
      this.json({
        status,
        data: result
      })
    } catch (err) {
      return this.json({
        status: 'failed',
        reason: err.message
      })
    }
  }

  /**
   * 其他工具函数
   */
  // 根据 fromid 查询人数
  async getChannelUserCountByFromid (fromids) {
    const { status, result } = await this.fetch(`${PUSH_TASK_API}?channel_id=${fromids.join(',')}`).then(res => res.json())
    return status === 'success' && result
  }

  // update doc feature sc_stky
  async updateScStky (docid) {
    this.fetch(`${DOC_FEATURE_API}/feature/single/update?docid=${docid}&ops={"$set":{"sc_stky": 1.0}}`)
  }

  // 清除 scope 玉波
  async clearScope (docid) {
    this.fetch(`${DOC_FEATURE_API}/scope/clear?token=ec1ec936&id=${docid}&scopes=removed,hide,notserve,notrecommend,notfront,notpush`)
  }

  //上传图片
  upload(url, data, name) {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url,
          formData: data,
          header: null,
        },
        function(err, res, body) {
          const parseJson = (str)=> {
            var data = {};
            if (typeof str === 'string') {
              try {
                data = JSON.parse(str);
              } catch (e) {
                data = {};
              }
            } else {
              data = str;
            }
            return data;
          }
          body = parseJson(body);
          const result = {
            status: 'success',
          };
          if (err || !body || body.status !== 'success' || !body.url) {
            result.status = 'failed';
            result.message = '上传失败';
          } else {
            result.url = body.url;
            result.name = name;
          }
          resolve(result);
        },
      );
    });
  }

  // 上传图片
  async uploadPicAction() {
    const ctx = this.ctx;
    const method = ctx.method;
    if (!!ctx.body && ctx.body.status === 'failed') {
      return;
    }
    if (method === 'OPTIONS') {
      ctx.status = 204;
    }
    const file = this.file('image');
    if (!file || !file.path) {
      return this.json({
        status: 'failed',
        message: '图片缺省',
      });
    }
    const image = {
      pic: {
        value: fs.readFileSync(file.path),
        options: {
          filename: file.name,
          type: file.type,
        },
      },
    };
    const response = await this.upload(UPLOAD_URL, image, file.name);
    this.body = response;
  }

  /**
   * 
   * @returns 新的 炎久 提供的接口 获取 doclist 的接口
   */
  async getDocListNewAction() {
    const { id = '', appid = '', page = 0, size = 800, order = 'search' } = this.get();

    if (!id) {
      return this.json({
        Status: 'failed',
        reason: `缺少 id`,
      });
    }

    // audio 单独处理成 t19189
    if (id === 'audio') {
      id = 't19198';
    }

    // 目前 接口 针对大部分频道 一些特殊频道 还没有处理 比如 要闻 咪咕看电影等
    let url = `http://operationtoolservice.test.yidian-inc.com/OperationtoolService/GetChannelDocList?channel_id=${id}&ranker=${order}`;
    if (appid) {
      url += `&appid=${appid}`;
    }

    let { result, Status, status, code } = await this.fetch(url, {
      method: 'GET',
    }).then(res => res.json());
    result = result.filter(item => item.docid);
    this.json({
      result,
      Status,
      status,
      code,
    });
  }

  // 旧的删除接口
   async  delNewsbyDocidAction() {
    const { fromid = '', docid = '' } = this.get();
    const condition = {_id: fromid }
      let delNews = await this.topNews.delNewsbyDocid({ _id: fromid })
      let del_News = delNews && delNews.del_news || [];
        del_News = delNews && delNews.del_news || [];
        if (!del_News.includes(docid)) {
          del_News.push(docid);
        }
    let result = await this.topNews.updateTopNews(condition,{del_news: del_News});
     let url = `http://poolmanger.ha.in.yidian.com:8045/poolmanager/deletenews?docid=${docid}&reason=1`;
     let res = await this.fetch(url,{
                  method: 'GET',
                  timeout: 10000
                }).then(res => res.json());
    return result
   }
  
  /**
   * 
   * @returns 旧的获取 reclist推荐内容源 的接口
   */
  async getRecListAction() {
    const { id = '', appid = '', page = 0, size = 800, order = '' } = this.get();
    if (!id) {
      return this.json({
        Status: 'failed',
        reason: `缺少 id`,
      });
    }

    // audio 单独处理成 t19189
    if (id === 'audio') {
      id = 't19198';
    }
    const cstart = parseInt(page)*parseInt(size);
    const cend = (parseInt(page)+1)* parseInt(size);
 
    //let url = `${A2_API}/channel/news-list-for-channel?cstart=${page * size}&cend=${(page + 1) * size}&fields=url&fields=title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date&fields=focus&infinite=false&channel_id=${id}&request_source=oak&version=999999&appid=yidian`;
    let url = `${A2_API}/channel/news-list-for-channel?cstart=${cstart}&cend=${cend}&fields=url&fields=title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date&fields=focus&infinite=false&channel_id=${id}&request_source=oak&version=999999&appid=yidian`;
    if (true) {
  
      if (id === 'hot' || id === 'homepage') {
        url = `${A2_API}/channel/news-list-for-hot-channel?cstart=0&cend=800&fields=title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date&infinite=false&request_source=oak&version=999999`;
      };
  
      // 咪咕 相关
      if (['miguTv', 'miguMovie', 'miguVariety', 'miguDocumentary', 'miguComic'].includes(id)) {
        await this.getMiguDocList(id)
        return
      };

      // 快讯
      if (id === 't2433472') {
        await this.getQuickNewsDocList(id)
        return;
      };

      // 新快讯 3个
      if (['t2623180', 't2623181', 't2623182'].includes(id)) {
        await this.getQuickNewsDocListNew(id)
        return;
      };

      if (id === 'wujianxiuxian' || id === 'yedushijian' || id === 'redianzaodu') {
        url = "http://10.101.0.140:8017/NewsRecommender/DimensionNewsRecommenderHandler?dimension=${id}";
      };

      if (id === 'coke') {
        url = "http://10.111.0.54:8017/NewsRecommender/FreshUserNewsRecommenderHandler?num=800"
      };

      if (id && id === appid) {
        url = `${A2_API}/channel/news-list-for-best-channel?cstart=0&cend=800&fields=url&fields=title&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=source&fields=date&infinite=false&request_source=oak&version=999999`
      };

      if (appid) {
        url += `&appid=${appid}`;
      };

      if (order) {
        url += `&ranker=${order}`;
      } else {
        url += `&ranker=search`;
      }
    }

    let sessionid = "constant-session-1";
    if (appid && appxUsers[appid]) {
      let url = `http://a4.go2yd.com/Website/session/userid-to-session?userid=${appxUsers[appid]}`;
      let sessionidInfo =  await this.fetch(url, {
        method: 'GET',
        timeout: 10000
      }).then(res => res.json());
      if (sessionidInfo && sessionidInfo.sessionid) {
        sessionid = sessionidInfo.sessionid
      }
    }
    let doclistData = null;
    doclistData =  await this.fetch(url, {
      method: 'GET',
      headers: {
        cookie: `JSESSIONID=${sessionid}`
      }
    }).then(res => res.json());

    if (doclistData && doclistData.status === 'success') {
      if (order === 'date' && doclistData.result) {
        console.log('order by date')
        doclistData.result.sort((s1, s2) => {
          return new Date(s1.date) > new Date(s2.date) ? -1 : 1;
        })
      };

      // 在 doclist 中 每一项 都增加一个 temp_wemedia_id 字段 这个字段 把 wemedia_id 中的 m 去掉 后面 操作的 实际上都是 temp_wemedia_id
      doclistData.result.map(item => 
        item.temp_wemedia_id = typeof(item.wemedia_id) === 'string' ? item.wemedia_id.slice(1) : item.wemedia_id);
      // doclistData.result = await filterDocs(doclistData.result, id, this);

      // 获取 wemedia 的 rank
      let wemediaArr = doclistData.result.map(item => item.temp_wemedia_id);
      let wemediaSet = new Set(wemediaArr);
      let wemedia_ids = Array.from(wemediaSet).filter(item => item !== undefined).join(',');

      let rankRes = await this.getRankByMediaId(wemedia_ids);
      doclistData.result.map(item => item.rank = rankRes[item.temp_wemedia_id]);
      doclistData.result = doclistData.result.filter(item => item.docid);

      this.json(doclistData);
    } else {
      this.json({
        status: 'failed',
        reason: `数据接口为空!【api】${url}`,
      })
    }
  }

  // miguTv miguMovie 获取列表 比较特殊 需要先从 channel serving 获取 docid 再去查 api
  async getMiguDocList (id) {
    let param = ''

    switch (id) {
      case 'miguTv':
        param = 'serial'
        break
      case 'miguMovie':
        param = 'movie'
        break
      case 'miguVariety':
        param = 'show'
        break
      case 'miguDocumentary':
        param = 'documentary'
        break
      case 'miguComic':
        param = 'anime'
        break
      default:
        break
    }

    let url = `http://10.126.38.7:9601/service/migu?video_album_category=${param}&service=channel&count=400`
    let miguDocIdRes = await this.fetch(url, {
      method: 'GET'
    }).then(res => res.json());

    let docid = []
    let is_paid_obj = {} // 存 每个 docid 的 is_paid 字段
    console.time('get migu docid')
    if (miguDocIdRes && miguDocIdRes.status === 'success') {
      docid = miguDocIdRes.result.map(item => item.docid)
      miguDocIdRes.result.forEach(item => {
        is_paid_obj[item.docid] = item.is_paid
      })
    } else {
      return this.json({
        status: 'failed',
        reason: `http://10.126.38.7:9601/service/migu?video_album_category=${param}&service=channel&count=400 请求失败`
      })
    }
    console.timeEnd('get migu docid')

    let apiUrl = API_URI_A1 + '/contents/content-meta'
    // 分批请求 丹峰接口
    let promiseArr = [], docListRes = []
    for (let i = 0; ; i++) {
      let docidSubArr = docid.slice(i * 100, (i + 1) * 100)
      if (docidSubArr && docidSubArr.length > 0) {
        let docListPromise = await this.fetch(apiUrl, {
          method: 'POST',
          timeout: 10000,
          body: `fields=image_urls&docid=${docidSubArr.join(',')}`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).then(res => res.json());
        promiseArr.push(docListPromise)
      } else {
        break
      }
    }

    Promise.all(promiseArr).then(res => {
      res.forEach((res) => {
        if (res.status === 'success') {
          res.documents.forEach(item => item.is_paid = is_paid_obj[item.docid])
          docListRes = docListRes.concat(res.documents)
        }
      })
      // setRedis(`pandora:channel:docList:default:${id}`, JSON.stringify(docListRes), 'ex', 60)
      this.json({
        code: 0,
        status: 'success',
        result: docListRes
      })
    }).catch(err => {
      this.json({
        status: 'failed',
        reason: API_URI_A1 + '/contents/content-meta 接口失败 ' + err
      })
    })
  }

  async getQuickNewsDocList (id) {
    // let url = `http://10.126.30.16:17303/editer/search.do?newsType=quickNews&matchAll=true&pageSize=400`
    let url = `http://editer-search.int.yidian-inc.com/editer/search.do?newsType=quickNews&matchAll=true&pageSize=800`
    let quicknewsDocIdRes = await this.fetch(url, {
      method: 'GET'
    }).then(res => res.json());
  
    let docid = []
    console.time('get quicknews docid')
    if (quicknewsDocIdRes && quicknewsDocIdRes.status === 'success') {
      docid = quicknewsDocIdRes.rtList.map(item => item.id)
    } else {
      return this.json({
        status: 'failed',
        reason: `http://10.126.30.16:17303/editer/search.do?newsType=quickNews&matchAll=true&pageSize=400 请求失败`
      })
    }
    console.timeEnd('get quicknews docid')
  
    let apiUrl = API_URI_A1 + '/contents/content-meta'
    let promiseArr = [], docListRes = []
    for (let i = 0; ; i++) {
      let docidSubArr = docid.slice(i * 100, (i + 1) * 100)
      if (docidSubArr && docidSubArr.length > 0) {
        let docListPromise = await this.fetch(apiUrl, {
          method: 'POST',
          timeout: 10000,
          body: `fields=image_urls&docid=${docidSubArr.join(',')}`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).then(res => res.json());
        promiseArr.push(docListPromise)
      } else {
        break
      }
    }
  
    Promise.all(promiseArr).then(res => {
      res.forEach((res) => {
        if (res.status === 'success') {
          docListRes = docListRes.concat(res.documents)
        }
      })
  
      // setRedis(`pandora:channel:docList:default:${id}`, JSON.stringify(docListRes), 'ex', 60)
      this.json({
        code: 0,
        status: 'success',
        result: docListRes
      })
    }).catch(err => {
      this.json({
        status: 'failed',
        reason: API_URI_A1 + '/contents/content-meta 接口失败 ' + err
      })
    })
  }

  async getQuickNewsDocListNew (id) {
    let kvid = 'quicknews_' + id
    let url = `http://index-reader.int.yidian-inc.com/reader/query?id=${kvid}&type=dig_pool&filter=&count=800&userId=&service=pandora_channel`
    let quicknewsDocIdRes = await this.fetch(url, {
      method: 'GET'
    }).then(res => res.json());
  
    let docid = []
    console.time('get quicknews docid')
    if (quicknewsDocIdRes && quicknewsDocIdRes.success) {
      docid = quicknewsDocIdRes.data.map(item => item.id)
    } else {
      return this.json({
        status: 'failed',
        reason: `${quicknewsDocIdRes.reason} http://index-reader.int.yidian-inc.com/reader/query?id=${kvid}&type=dig_pool&filter=&count=800&userId=&service=pandora_channel 请求失败`
      })
    }
    console.timeEnd('get quicknews docid')
  
    let apiUrl = API_URI_A4 + '/contents/content-meta'
    let promiseArr = [], docListRes = []
    for (let i = 0; ; i++) {
      let docidSubArr = docid.slice(i * 100, (i + 1) * 100)
      if (docidSubArr && docidSubArr.length > 0) {
        let docListPromise = await this.fetch(apiUrl, {
          method: 'POST',
          timeout: 10000,
          body: `fields=image_urls&docid=${docidSubArr.join(',')}`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).then(res => res.json());
        promiseArr.push(docListPromise)
      } else {
        break
      }
    }
    Promise.all(promiseArr).then(res => {
      res.forEach((res) => {
        if (res.status === 'success') {
          docListRes = docListRes.concat(res.documents)
        }
      })
  
      // setRedis(`pandora:channel:docList:default:${id}`, JSON.stringify(docListRes), 'ex', 60)
      this.json({
        code: 0,
        status: 'success',
        result: docListRes
      })
    }).catch(err => {
      this.json({
        status: 'failed',
        reason: API_URI_A1 + '/contents/content-meta 接口失败 ' + err
      })
    })
  }

  // 通过自媒体 id
  async getRankByMediaId (wemedia_ids) {
    let url = `http://wemedia-api-high.ha.in.yidian.com/users/get-by-id-list?ids=${wemedia_ids}`
    let res = await this.fetch(url, {
      method: 'GET',
    }).then(res => res.json())

    let rankObj = {}

    if (res && res.status === 'success') {
      res.result.forEach(item => {
        rankObj[item.id] = item.rank
      })
    }

    return rankObj
  }

  /**
   *
   * @returns 推荐内容源的文章数据
   */
  async getRecDataAction () {
    const { fromid, display = 'default' } = this.get()
    const { docids } = this.post() || {};
    const token = this.cookie('token') || '';
    let paramDocids = [...docids];
    if (!docids) {
      return this.json({
        status: 'failed',
        reason: 'docids 是必须的',
      });
    };
    let data = null;
    const url = `http://dw.api.channel.yidian-inc.com/data/get_cfb_data?fromid=${fromid}&display=${display}`
    data = await this.fetch(
      url,
      {
        method: 'POST',
        body: `docids=${paramDocids.join(',')}`,
        headers: {
          cookie: `JSESSIONID=${token}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
      }
    ).then(res => res.json());
    // let postData = `docids=${paramDocids.join(',')}`;
    // let a = await axios.post(
    //   url,
    //   postData,
    //   {
    //     headers: {
    //     cookie: `JSESSIONID=${token}`,
    //     'content-type': 'application/x-www-form-urlencoded'
    //     }
    //   }
    // )
    // let b = a['data'];
    this.json({
      data
    })
  }

  // 在推荐内容源里props的数据
  async getRecDocPropsAction () {
    let { docids } = this.post();
    if (!docids || !Array.isArray(docids)) {
      return this.json({
        status: 'failed',
        reason: 'docids 是必须的'
      })
    }
    let url = REC_PROPS_API;
    let docData = await this.fetch(url, {
      method: 'POST',
      body: `docid=${docids.join(',')}`,
      timeout: 10000,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res.json());
    if (docData.status === 'success') {
      this.json({
        status: 'success',
        result: docData.doc || [],
      })
    } else {
      this.json({
        status: 'failed',
        reason: docData.reason || 'no reason'
      })
    }
  }

  /**
   * @return 图片docid
   */
  async getArticlePicAction () {
    const { docid } = this.get();
    const url = `http://a4.v.yidian-inc.com/Website/debug/doc-meta?docid=${docid}`;
    if (!docid) {
      this.json ({
        status: 'failed',
        result: 'docid 是必须的'
      });
    }

    let data = await this.fetch(url, {
      method: 'GET',
    }).then(res => res.json())

    if (data && data.status === 'success') {
      let info = data.data[0] || {};
      this.json({
        docid: info._id,
        images: info.image_urls || [],
        uploadImages: info.upload_images || [],
        uploadImagesV: info.upload_images_v || []
      });
    } else {
      this.json ({
        status: 'failed',
        result: '无数据'
      });
    }
  }
}
