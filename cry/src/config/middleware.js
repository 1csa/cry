const path = require('path');
const isDev = think.env === 'development';
const cors = require('kcors');
// const auth = require('../middleware/auth');

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  {
    handle: 'resource',
    // enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|dist|favicon\.ico)/,
      gzip: true,
      maxage: 10 * 24 * 60 * 60,
    },
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
    },
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb',
    },
  },
  {
    handle: 'router',
    options: {},
  },
  {
    handle: 'auth',
    options: {},
    // match: /^\/app/
    match: /(^\/app)|(^\/api\/app)/, // 仅针对app的选项
  },
  {
    handle: cors,
    options: {},
  },
  'logic',
  'controller',
];
