// production config, it will load in production enviroment
module.exports = {
  workers: 1,
  port: process.env.PORT || 9008,
  API_CONFIG: {
    PANDORA: 'http://web-rest.int.yidian-inc.com/api/v1/pandora',
  },
  PUSH_CONFIG: {
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
    section_push: 'http://push-manage.int.yidian-inc.com/test/start', // 分段式分发推送接口，线上的 邢雨
    // section_push: 'http://10.103.34.184:8080/test/start', // 分段式分发推送接口，测试环境  邢雨
  },
  API_URL: {
    a2: 'http://a2.v.yidian-inc.com/Website',
    a4: 'http://a4.go2yd.com.ha.in.yidian.com',
  },
  APOLLO: 'http://apollo-configcenter.ha.in.yidian.com:8108/configfiles/json',
};
