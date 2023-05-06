// default config
// production  development
const env = think.env || 'production';
module.exports = {
  workers: 3,
  // stickyCluster: true,
  port: process.env.PORT || 5000,
  TOOL_CONFIG: {
    pandora: 'http://pandora.yidian-inc.com',
  },
  API_CONFIG: {
    // PANDORA: 'http://clay.yidian-inc.com:9006/api/v1/pandora',
    PANDORA: 'http://web-rest.int.yidian-inc.com/api/v1/pandora', // 都走线上
  },
  PUSH_CONFIG: {
    newPush: 'http://push-data.int.yidian-inc.com', // 邢宇
    // newPush: env === 'production' ? 'http://push-data.int.yidian-inc.com' : 'http://10.103.16.250:8080', // 邢宇
    push: 'http://push.yidian.com',
    old_push: 'http://push_task.ha.in.yidian.com:8703',
    task: 'http://infoflow-push-keep-intercept-api-prod.yidian-inc.com', // 推送推荐侧的接口
    lion: 'http://lion-assistant.int.yidian-inc.com/service', // 推荐 王发北
    pushtag: 'http://pushtag.int.yidian-inc.com/push',
    pushtag_api: 'http://pushtag-apiserver.int.yidian-inc.com/api',
    image: 'http://static_image_api.ha.in.yidian.com',
    xiaomi: 'https://api.xmpush.xiaomi.com',
    article: 'http://m.v.yidian-inc.com', // 大前端
    doc_feature: 'http://doc-feature-server.int.yidian-inc.com/service/feature', // doc_feature
    lc1: 'http://lc1.haproxy.yidian.com:8050', // 推荐，李亚州
    section_push: 'http://push-manage.int.yidian-inc.com/test/start', // 分段式分发推送接口线上的， 邢雨
    // section_push: 'http://10.103.34.184:8080/test/start', // 分段式分发推送接口，测试环境  邢雨
    // oppoPushIsOver:
    //   env === 'production' ? 'http://push-platform.int.yidian-inc.com' : 'http://10.136.10.8:9133', // 后端：刘彤彤 作用：看 oppo push 配额是否用完
    oppoPushIsOver:
      env === 'production'
        ? 'http://push-platform.int.yidian-inc.com'
        : 'http://push-platform.int.yidian-inc.com', // 测试环境 线上环境 都用线上的吧
  },
  API_URL: {
    a2: 'http://a2.v.yidian-inc.com/Website',
    a4: 'http://a4.go2yd.com.ha.in.yidian.com',
  },
  APOLLO: 'http://apollo-configcenter.ha.in.yidian.com:8108/configfiles/json',
  url: {
    pandora: 'http://pandora.yidian-inc.com/tools',
    api_a1_prod: 'http://a1.go2yd.com.ha.in.yidian.com/Website',
  },
  tools: {
    interaction: '2177401643',
    'local-groundpush': '4061343041', // 测试环境权限
    'access-content': '1269361673',
    'master-operation': '3253174172',
    articleSpam: '3493231678',
    ugcReview: '2568660512',
    userinfo: '3368643680',
    'user-stimulation': '2334399556',
    filtertools: '1023069301',
    'audit-system': '3727300643',
    'editor-push-news': '3541078614',
    inscription: '2677830272', // 临时借用卡片的tool_id
  },
  // 通用的错误码
  errors: {
    param_type: '参数类型错误', // 空值也当成类型错误
    param_value: '参数不符合要求',
    empty_record: '没有找到数据',
    method_unsupport: '不支持的请求方法',
  },
};
