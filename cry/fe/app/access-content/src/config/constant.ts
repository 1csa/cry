// 新建任务的平台配置信息
// export const  PLATFORM = ['微博', '头条', '抖音', '西瓜', '搜狐', 'vue'];
export const  PLATFORM = ['微博', '头条', '抖音', '西瓜'];

export const CONTENT_TYPE_CRAWL_MODE = {
  '微博': [{
    content_type: '短内容',
    children: [{
      crawl_type: '账号',
      default_field: '正文、图片、发文时间、转发数、评论数、点赞数'
    }, {
      crawl_type: 'doc粒度',
      default_field: '正文、图片、发文时间、转发数、评论数、点赞数'
    }]
  },{
    content_type: '视频',
    children: [{
      crawl_type: '账号',
      default_field: '正文、图片、发文时间、转发数、评论数、点赞数'
    }, {
      crawl_type: 'doc粒度',
      default_field: '正文、图片、发文时间、转发数、评论数、点赞数'
    }],
  }],
  '头条': [{
    content_type: '图文',
    children: [{
      crawl_type: '账号',
      default_field: '正文图文、封面图、发文时间、标题、点赞数、评论数、阅读数'
    }]
  },{
    content_type: '视频',
    children: [{
      crawl_type: '账号',
      default_field: '正文图文、封面图、发文时间、标题、点赞数、评论数、播放数'
    }]
  },{
    content_type: '短内容',
    children: [{
      crawl_type: '账号',
      default_field: '正文、图文、发文时间、点赞数、评论数、阅读数'
    }]
  }],
  '抖音': [{
    content_type: '视频',
    children: [{
      crawl_type: '账号',
      default_field: '视频、正文（入到标题）、点赞数、评论数、转发数'
    },{
      crawl_type: '关键词',
      default_field: '视频、正文（入到标题）'
    },{
      crawl_type: 'doc粒度',
      default_field: '视频、正文（入到标题）'
    },{
      crawl_type: '话题',
      default_field: '视频、正文（入到标题）'
    }],
  }],
  '西瓜': [{
    content_type: '视频',
    children: [{
      crawl_type: '账号',
      default_field: '视频、标题、点赞数、评论数、播放数'
    },{
      crawl_type: '关键词',
      default_field: '视频、标题、点赞数、评论数、播放数'
    }]
  }],
  '搜狐': [{
    content_type: '图文',
    children: [{
      crawl_type: '账号',
      default_field: '标题、发文时间、正文图文'
    }]
  }],
  'vue': [{
    content_type: '视频',
    children: [{
      crawl_type: '关键词',
      default_field: '视频、标题、点赞数、评论数、播放数'
    }, {
      crawl_type: '话题',
      default_field: '视频、标题、点赞数、评论数、播放数'
    }]

  }]
}

export const CRAWL_TYPE_TO_EN = {
  '账号': 'account',
  'doc粒度': 'doc',
  '关键词': 'keyword',
  '话题': 'talk',
  'account': '账号',
  'doc': 'doc粒度',
  'keyword': '关键词',
  'talk': '话题',
};


export const CATCH_TIME_CONFIG = {
  news: [3, 30, 90],
  video: [30, 90],
  duanneirong: [3, 30, 90]
};

export const CRAWL_MODE_MAP = {
  longtime: "持续抓取",
  once: "一次性抓取"
}

export const IMPORTANT_ACCOUNT_MAP = {
  "yidianhao": "一点号",
  "ugc": "UGC账号"
}

export const IS_CRAWL_COMMENT_MAP = {
  "true": '是',
  "false": '否'
}

export const CATCH_TIME_ITEM_NAME = {
  news: '图文',
  video: '视频',
  duanneirong: '短内容',
  '图文': "news",
  '视频': "video",
  '短内容': "duanneirong"
};

export const PQ_STATUS_CN = [
  {label: '全部', value: 0},
  {label: '启用', value: 1},
  {label: '未启用', value: 2}
];
export const STATUS_CN = ['全部','未开始', '进行中', '已结束', '暂停', '错误', '删除'];
export const USE_STATUS_CN = ['','启用', '不启用'];
export const USE_STATUS = [-1, 1, 2];
export const STATUS_CN_COLOR = ['', '', 'green', '#5fac80','','red', '#99CCFF'];
export const START_FLAG = [1, 4]; // 显示开始标志位
export const PAUSE_FLAG = [2];
export const DEL_FLAG = [1];
export const FINISH_FLAG = [2,4];
export const PAGE = 1;
export const PAGE_SIZE = 10;
export const TOOL_ID = '1269361673';
// 需要下载的模块文件
export const TEMPLATE_FILES = ['搜索词抓取.xlsx', '文章粒度抓取.xlsx', '话题抓取.xlsx','账号抓取.xlsx'];

// 内容抓取平台
export const taskTypeOptions = [
  {label: 'conventional', value: 0},
  {label: 'push', value: 1},
  {label: 'import', value: 2},
  {label: 'sync', value: 3}
];
export const disTypeOptions = [
  {label: 'crontab', value: 1},
  {label: '时间间隔(s)', value: 0},
  {label: '单次执行', value: 2}
];
export const dataTypeOptions = ['redis', 'mongo', 'common'];
export const taskStartFrom = [
  {label: 'topic', value: 0},
  {label: 'feed', value: 1},
  {label: 'statuses', value: 2},
  {label: 'Search', value: 3},
  {label: 'Detail', value: 4}
];

// export const BASE_LOCAL_API = 'http://localhost.yidian-inc.com:5006';
// export const BASE_LOCAL_API = 'http://venus.int.yidian-inc.com:5006';
export const BASE_LOCAL_API = 'http://zeus.v.yidian-inc.com';
// 宇翔提供
// const BASE_THIRD_API = 'http://operationtoolservice.test.yidian-inc.com'
const BASE_THIRD_API = 'http://operationtoolservice.int.yidian-inc.com'

// 开发--夕童电脑
export const XITONG_COMP_API = 'http://10.60.108.94:8080';
// export const ONLINE_PQ = 'http://172.25.81.144';
export const ONLINE_PQ = 'http://crawl-platform-config.int.yidian-inc.com';
export const CONTENT_API = 'http://cherrypick-platform.int.yidian-inc.com';


export const API = {
  uploadXlxs: `${BASE_LOCAL_API}/api/app/common/upload/uploadXlsxConvertToJson`,
  createTask: `${BASE_THIRD_API}/crawl/create-task`,
  fetchTask: `${BASE_THIRD_API}/crawl/tasks`,
  fetchChildTask: `${BASE_THIRD_API}/crawl/sub-tasks`,
  setTaskStatus: `${BASE_THIRD_API}/crawl/set-task-status`,
  fetchDocs: `${BASE_THIRD_API}/crawl/get-storage-docids`
};
export const pqAPI = {
  // 任务列表
  createTask: `${ONLINE_PQ}/api/v1/task`,
  searchTaskList: `${ONLINE_PQ}/api/v1/task`,
  getTaskInfoById: `${ONLINE_PQ}/api/v1/task`,
  resetTaskStatus: `${ONLINE_PQ}/api/v1/task/reset`,
  updateTask: `${ONLINE_PQ}/api/v1/task/update`,
  deleteTask: `${ONLINE_PQ}/api/v1/task/delete`,
  // 任务来源
  getChainListGroup: `${ONLINE_PQ}/api/v1/chain/group`,
  getChainList: `${ONLINE_PQ}/api/v1/chain`,
  getSourceList: `${ONLINE_PQ}/api/v1/source`,
  updateSource: `${ONLINE_PQ}/api/v1/source/update`,
  deleteSource: `${ONLINE_PQ}/api/v1/source/delete`,
  updateChain: `${ONLINE_PQ}/api/v1/chain/update`,
  deleteChain: `${ONLINE_PQ}/api/v1/chain/delete`,
  // 文件相关
  getFileTemplate: `${ONLINE_PQ}/api/v1/file/temp`,
  uploadFile: `${ONLINE_PQ}/api/v1/file/upload`
}
// 投放配置API
export const putAPI = {
  task: `${CONTENT_API}/api/v1/task`,
  startTask: `${CONTENT_API}/api/v1/task/start`,
  stopTask: `${CONTENT_API}/api/v1/task/stop`,
  siteList: `${CONTENT_API}/api/v1/source`,
  contentTypeList: `${CONTENT_API}/api/v1/type`,
  categoryList: `${CONTENT_API}/api/v1/category`,
  uploadRandomFile: `${BASE_LOCAL_API}/api/app/putContent/upload/index`,
  uploadOneToOneFile: `${BASE_LOCAL_API}/api/app/putContent/upload/uploadFile`,
  downloadFile: `${CONTENT_API}/api/v1/file`,
  exportApp: `${CONTENT_API}/api/v1/export/app`
}

export const putStatus = [
  {label: '全部', value: 0},
  {label: '创建完成-未开始', value: 1},
  {label: '进行中', value: 2},
  {label: '已结束', value: 4}
]

export const taskTypes = [{
  label: '内容维度',
  delivery_way: 1
}, {
  label: '账号维度',
  delivery_way: 2
}]

export const accountTypes = [{
  label: '一点号',
  value: 1
}, {
  label: 'UGC账号',
  value: 2,
  disabled: true
}]

export const importRelationship = [{
  label: '一一对应',
  value: 1,
  disabled: true
}, {
  label: '领域内随机打散',
  value: 2,
  disabled: false
}]

export const libraryTypes = [{
  label: '全网库',
  value: 1
},{
  label: '热门库',
  value: 2
}]

export const accountLibraryTypes = [{
  label: '全网作者库',
  value: 1
},{
  label: '热门作者库',
  value: 2,
  disabled: true
}]

export const accountWays = [{
  label: '指定',
  value: 1
},{
  label: '非指定',
  value: 2
}]

export const timeTypes = [{
  label: '最新',
  value: 1,
  disabled: true
},{
  label: '7天内',
  value: 2
},{
  label: '一个月内',
  value: 3
}]

export const taskTimeTypes = [{
  label: '最新',
  value: 1
},{
  label: '7天内',
  value: 2
},{
  label: '一个月内',
  value: 3
}]

export const runTypes = [{
  label: '持续性',
  value: 1,
  disabled: false
},{
  label: '一次性',
  value: 2,
  disabled: false
}]

export const hotTypes = [{
  label: '全部',
  value: 1
},{
  label: '新热',
  value: 2
},{
  label: '无时效热门',
  value: 3
}]