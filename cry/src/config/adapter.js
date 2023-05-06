const fileCache = require('think-cache-file');
const pug = require('think-view-pug');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const mongo = require('think-mongo');
const { Console, File, DateFile } = require('think-logger3');
const path = require('path');
// const ws = require('think-websocket-ws');

const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000, // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000, // gc interval
  },
};

// /**
//  * model adapter config for mysql
//  * @type {Object}
//  */
// exports.model = {
//   type: 'mysql',
//   common: {
//     logConnect: isDev,
//     logSql: isDev,
//     logger: msg => think.logger.info(msg),
//   },
// };

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mongo',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg),
  },
  mongo: {
    handle: mongo,
    host: '10.103.16.11',
    port: 27017,
    user: '',
    tablePrefix: '',
    password: '',
    database: '', // 数据库名称
    options: {},
  },
  mongo_10: {
    handle: mongo,
    host: '10.103.16.10',
    port: 27017,
    user: '',
    tablePrefix: '',
    password: '',
    database: '', // 数据库名称
    options: {},
  },
  mongo_editor: {
    handle: mongo,
    host: [
      '10.103.17.144',
      '10.103.17.145',
      'web-mongo-wj-1.int.yidian-inc.com',
      'web-mongo-wj-2.int.yidian-inc.com',
      'web-mongo-wj-3.int.yidian-inc.com',
    ],
    port: ['33017', '33017', '33017', '33017', '33017'],
    options: {
      replicaSet: 'editor',
      readPreference: 'secondaryPreferred',
      connectTimeoutMS: '500',
      socketTimeoutMS: '8000',
      wTimeoutMS: '3000',
    },
  },
  mongo_meta_data: {
    handle: mongo,
    host: ['rs-web-1.yidian.com', 'rs-web-2.yidian.com', 'rs-web-3.yidian.com'],
    port: ['27017', '27017', '27017'],
    options: {
      replicaSet: 'web-internal',
      readPreference: 'secondaryPreferred',
      connectTimeoutMS: '500',
      socketTimeoutMS: '8000',
      wTimeoutMS: '3000',
    },
  },
  mysql_inscription_local: {
    type: 'mysql',
    handle: mysql, // Adapter handle
    user: 'root', // 用户名
    password: 'nu9694971', // 密码
    database: 'yidian_card', // 数据库
    host: '127.0.0.1', // host
    port: 3306, // 端口
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    prefix: '', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
    acquireWaitTimeout: 0, // 等待连接的超时时间，避免获取不到连接一直卡在那里，开发环境下有用
    reuseDB: false, // 是否复用数据库连接，事务的时候可能会用到
    encoding: 'utf8',
  },
  mysql_inscription_prod: {
    handle: mysql,
    database: 'card',
    host: 'w.card.int.yidian-inc.com',
    port: 3306,
    connectionLimit: 1,
    user: 'yd_card_rw',
    password: 'wNC@zFJzPf1yM$Cv8yB8#AO3i&Ecgx',
  },
  mysql_inscription_dev: {
    handle: mysql,
    database: 'yidian_card',
    port: 3306,
    host: '10.120.18.30',
    user: 'root',
    password: '123456',
    // host: 'localhost', // host
    // user: 'root', // 用户名
    // password: 'nu9694971', // 密码
    connectionLimit: 1,
    acquireWaitTimeout: 3000,
    reuseDB: true,
    encoding: 'utf8',
  },
  mysql_pushsendlog_dev: {
    // push监控埋点测试数据库
    handle: mysql,
    database: 'push_sendlog',
    host: '10.120.18.30',
    port: 3306,
    connectionLimit: 1,
    user: 'root',
    password: '123456',
    acquireWaitTimeout: 3000,
    reuseDB: true,
    encoding: 'utf8',
  },
  mysql_pushsendlog_prod: {
    // push监控埋点线上数据库
    handle: mysql,
    database: 'push_statistics',
    host: 'w.push_stat.mysql.int.yidian-inc.com',
    port: 3306,
    connectionLimit: 1,
    user: 'push_stat_rw',
    password: 'wNC@zFJzPf1yM$Cv8yB8#AO3i&ECgx',
  },
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      // keys: ['werwer', 'werwer'],
      // signed: true
    },
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session'),
  },
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'pug',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.pug',
  },
  pug: {
    handle: pug,
  },
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  // type: isDev ? 'console' : 'dateFile',
  type: 'console',
  console: {
    handle: Console,
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 500 * 1024, // 500M
    filename: path.join(think.ROOT_PATH, 'logs/app.log'),
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log'),
  },
};

//
// exports.websocket = {
//   type: 'ws',
//   common: {
//     // common config
//   },
//   ws: {
//     handle: ws,
//     path: '/api/push/monitor',
//     messages: [{
//       close: '/api/push/monitor/close',
//       open: '/api/push/monitor/open',
//       addUser: '/api/push/monitor/addUser'
//     }]
//   }
// };
