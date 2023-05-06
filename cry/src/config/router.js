module.exports = [
  ['/app/:name/*', 'app'],
  ['/app/:name', 'app'],

  // proxy config
  // /api/proxy/{targetUrl}，eg. /api/proxy/http://xxx.xx.xx/xxx
  [/\/api\/proxy\/([\w/,:.-]+)/, '/api/proxy?targetUrl=:1'],

  // resetful config: /foods/{id}
  [/\/api\/app\/simple-admin\/foods(?:\/(\w+))?/, '/api/app/simple-admin/foods?id=:1'],
  [/\/api\/app\/hotpool\/hot-news-source(?:\/(\w+))?/, '/api/app/hotpool/hot-news-source?id=:1'],
];
