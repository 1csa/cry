export const FormItemLayout: Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
export const TailFormItemLayout: Object = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};
export const FilterEscape = [
  {
    value : 'vivo同步高爆文章',
    key : 'vivohot'
  },
  {
    value:'高曝光审核文章',
    key:'topview_quality'
  }
]
export const CheckFormOptionList : Object = {
  CheckConfig: [
    { key: "user2news", value: "user2news" },
    { key: "news2news", value: "news2news" },
    { key: "video2video", value: "video2video" },
    { key: "channel2news", value: "channel2news" },
    { key: "smartsearch", value: "smartsearch" },
    { key: "knn", value: "knn" },
    { key: "allinone", value: "allinone" },
    { key: "cb", value: "cb" },
    { key: "blender", value: "blender" },
    { key: "push-cb", value: "push-cb" },
    { key: "身边", value: "local-side" }
  ],
}
export const UserCoverFormOptionList: Object = {
  envList: [
    'all',
    'app',
    'mibrowser',
    'oppobrowser',
    '3rd-small',
  ],
  osList: [
    'all',
    'android',
    'ios',
  ],
  includeList: [
    {
      key: '包含',
      value: true,
    }, {
      key: '不包含',
      value: false,
    }
  ],
  distributionList: [
    'all',
    'oppo',
    'oneplus',
    'realme',
  ],
  userTypeList: [
    'all',
    '1day',
    '7day',
    'old',
  ],
  genderList: [
    'all',
    'male',
    'female',
    'other',
  ],
  refreshModeList: [
    { key: "oppo前n刷", value: "oppo_strict" },
    { key: "oppo n刷后", value: "oppo_loose" },
    { key: "vivo前n刷", value: "vivo_strict" },
    { key: "vivo n刷后", value: "vivo_loose" },
    { key: "小米前n刷", value: "mi_strict" },
    { key: "小米n刷后", value: "mi_loose" },
    { key: "vivo首页刷新的第一刷", value: "vivo_-3_strict" },
    { key: "vivo首页刷新的非第一刷", value: "vivo_-3_loose" },
    { key: "vivo手动下拉刷新的第一刷", value: "vivo_active_strict" },
    { key: "vivo手动下拉刷新的非第一刷", value: "vivo_active_loose" },
    { key: "vivo自动下拉刷新的第一刷", value: "vivo_auto_strict" },
    { key: "vivo自动下拉刷新的非第一刷", value: "vivo_auto_loose" },
    { key: "vivo上拉刷新的第一刷", value: "vivo_pull_up_strict" },
    { key: "vivo上拉刷新的非第一刷", value: "vivo_pull_up_loose" },
    { key: "主端下拉刷新", value: 'app_pull_down'}
  ],
  userLabelList:[
    {key:'低端用户',value:"tob_label_low"},
    {key:'中活用户',value:'tob_label_mid'},
    {key:'高活用户',value:'tob_label_high'},
    {key:'新用户',value:'tob_label_new'},
    {key:'流失用户',value:'tob_label_leave'},
    {key:'all',value:'all'}
  ],
  ageGroupList: ["无", "OPPO儿童"]
};
export const ruleformOptionList: Object = {
  channelList: [
    'white_list',
    'black_list',
  ],
  vlevel: ["无", "1级", "1级、2级", "1级、2级、3级", "1级、2级、3级、4级", "1级、2级、3级、4级、5级"],
  sourcelevel: ["无", "1级", "1级、2级", "1级、2级、3级", "1级、2级、3级、4级", "1级、2级、3级、4级、5级", "1级、2级、3级、4级、5级、6级"],
  new_sourcelevel: ["1级", "2级", "3级", "4级", "5级", "6级"],
  topview_quality_tags:[
  {
    value:'内容劲爆',
    label:'内容劲爆'
  },
   {
    value:'标题低俗',
    label:'标题低俗'
  },
   {
    value:'硬广推广',
    label:'硬广推广'
  },
   {
    value:'标题吸睛',
    label:'标题吸睛'
  },
   {
    value:'标题低质',
    label:'标题低质'
  },
   {
    value:'画面模糊',
    label:'画面模糊'
  },
   {
    value:'口味偏重',
    label:'口味偏重'
  },
  {
    value:'封面低俗',
    label:'封面低俗'
  },
  {
    value:'画面变形',
    label:'画面变形'
  },
   {
    value:'内容鸡肋',
    label:'内容鸡肋'
  },
  {
    value:'封面低质',
    label:'封面低质'
  },
  {
    value:'恶意滤镜',
    label:'恶意滤镜'
  },
  {
    value:'软文推广',
    label:'软文推广'
  },
 {
    value:'封面模糊',
    label:'封面模糊'
  },
  {
    value:'恶意边框 ',
    label:'恶意边框 '
  },
  {
    value:'竞品引流',
    label:'竞品引流'
  },
   {
    value:'内容低俗',
    label:'内容低俗'
  },
  {
    value:'水印夸张',
    label:'水印夸张'
  },
  {
    value:'标题夸张',
    label:'标题夸张'
  },
   {
    value:'内容低质',
    label:'内容低质'
  },
  {
    value:'音画异常',
    label:'音画异常'
  },
   {
    value:'题文不符',
    label:'题文不符'
  },
  {
    value:'排版混乱',
    label:'排版混乱'
  },
   {
    value:'商业要求',
    label:'商业要求'
  },
   {
    value:'重口味',
    label:'重口味'
  },

   {
    value:'过时内容',
    label:'过时内容'
  },
    {
    value:'指令要求',
    label:'指令要求'
  },
   {
    value:'简介错误',
    label:'简介错误'
  },
   ],
  wemediaType: [{
    value: 1,
    key: '个人媒体',
  }, {
    value: 2,
    key: '机构媒体',
  }, {
    value: 3,
    key: '政府政务',
  }, {
    value: 4,
    key: '企业',
  }, {
    value: 5,
    key: '其他组织',
  }],
  videoType: [{
    value: 0,
    key: '非低质标题',
  }, {
    value: 1,
    key: '标题字数过短',
  }, {
    value: 2,
    key: '标题字数过长',
  }, {
    value: 3,
    key: '非中文标题低质',
  }, {
    value: 4,
    key: '特殊字符低质',
  }, {
    value: 5,
    key: '标题超链接（过滤）',
  }, {
    value: 6,
    key: '#开头标题低质',
  }, {
    value: 7,
    key: '无标题',
  }, {
    value: 8,
    key: '标题错别字',
  }, {
    value: 9,
    key: '未合并的双标点',
  }],
  smilVideoType: [{
    value: 0,
    key: '非低质标题',
  }, {
    value: 1,
    key: '标题字数过短',
  }, {
    value: 2,
    key: '标题字数过长',
  }, {
    value: 3,
    key: '非中文标题低质',
  }, {
    value: 4,
    key: '特殊字符低质',
  }, {
    value: 5,
    key: '标题超链接（过滤）',
  }, {
    value: 6,
    key: '#开头标题低质',
  }, {
    value: 7,
    key: '无标题',
  }, {
    value: 8,
    key: '标题错别字',
  }, {
    value: 9,
    key: '未合并的双标点',
  }],
}
export const ThresholdSelectCon: Array<any> = [
  {
    value: '大于',
    key: '大于等于',
  }, {
    value: '小于',
    key: '小于',
  }, {
    value: '介于',
    key: '介于',
  },
];
export const NewsThresholdlistName: Array<any> = [
  {
    name: '低俗',
    key: 'dirty',
    num: 1
  }, {
    name: '标题党',
    key: 'bait',
    num: 2
  }, {
    name: '软文',
    key: 'spam',
    num: 3
  }, {
    name: '重口味',
    key: 'sick',
    num: 4
  },
];
export const VideoThresholdlistName: Array<any> = [
  {
    name: '低俗',
    key: 'sc_dirty',
    num: 1
  }, {
    name: '标题党',
    key: 'bait',
    num: 2
  }, {
    name: '重口味',
    key: 'sick',
    num: 3
  },
];
export const LogInfo: Object = {
  log_domain: 'unitool',
  log_secret: 'd41d8cd98f00b204e9800998ecf8427e',
  news_rule_key: 'graphicpurification',
  video_rule_key: 'videopurification',
  usercover_key: 'usercoverconditions',
  news_threshold_key: 'graphicthreshold',
  video_threshold_key: 'videothreshold',
  debug: process.env.NODE_ENV === 'development' ? 1 : 0,
}

export const defaultNewRuleFormValue = {
  ruleId: "-1",
  name: '',
  desc: '',
  logic: 'or',
  security: [],
  channelList: {
    type: 'white_list',
    content: 'best',
  },
  filter_escape: [],
  yd_watery:{type:["1","2","3",'4','5','6'] , score:[0 , 0, 0, 0, 0 , 0]},
  dirtyTag: false,
  noImage: false,
  dirty: 0,
  bait: 0,
  spam: 0,
  sick: 0,
  category: [],
  ncat_class: '',
  nsubcat_class: '',
  titleKeywords: '',
  authority: -1,
  batch: -1,
  c_imgs_dirty: 0,
  c_imgs_sexy: 0,
  c_imgs_disgusting: 0,
  blur: 0,
  unclarity: 0,
  timeRange: [],
  editorProtect: true,
  wemediaType: [],
  src: '',
  wm_ids: '',
  protect_source: '',
  distributionTime: '', // 可分发时长
  new_sourcelevel: [],
  yd_porny: 0,
  yd_sexy: 0,
  title_quality: [],
  yd_porny_animal : 0
}

export const newscolumns = [{
  title: '规则编号',
  key: 'ruleId',
}, {
  title: '过滤规则名称',
  key: 'name',
}, {
  title: '说明',
  key: 'desc',
}, {
  title: '逻辑',
  key: 'logic',
}, {
  title: '涉领导人',
  key: 'security',
}, {
  title: '频道(黑/白)名单',
  key: 'channelList',
}, {
  title: '低俗/重口味标签',
  key: 'dirtyTag',
},{
  title: '无图过滤',
  key: 'noImage',
}, {
  title: '低俗',
  key: 'dirty',
}, {
  title: '标题党',
  key: 'bait',
}, {
  title: '软文',
  key: 'spam',
}, {
  title: '重口味',
  key: 'sick',
}, {
  title: '自媒体等级',
  key: 'new_sourcelevel',
}, {
  title: '是否豁免文章',
  key: 'filter_escape',
}, {
  title: '类别',
  key: 'category',
}, {
  title: '新一级分类',
  key: 'ncat_class',
}, {
  title: '水文',
  key: 'yd_watery',
}, {
  title: '新二级分类',
  key: 'nsubcat_class',
}, {
  title: '标题关键词',
  key: 'titleKeywords',
}, {
  title: '源评级',
  key: 'authority',
}, {
  title: '控制刷数',
  key: 'batch',
}, {
  title: '低俗图',
  key: 'c_imgs_dirty',
}, {
  title: '涉性图',
  key: 'c_imgs_sexy',
}, {
  title: '恶心图',
  key: 'c_imgs_disgusting',
}, {
  title: '一点模糊图',
  key: 'blur',
}, {
  title: '百度模糊图',
  key: 'unclarity',
},
{
  title: '女性性感图',
  key: 'female_sexy',
}, {
  title: "自研动物交配模型",
  key: "yd_porny_animal"
}, {
  title: '男性性感图',
  key: 'male_sexy',
},
{
  title: '亲密行为图',
  key: 'intimacy',
},
{
  title: '自研一般性感图',
  key: 'yd_general_sexy',
},
{
  title: '自研重口味图',
  key: 'yd_disgusting',
},
{
  title: '自研亲密行为图',
  key: 'yd_intimacy',
},
{
  title: '是否保护编辑操作内容',
  key: 'editorProtect',
},
{
  title: '人审内容保护',
  key: 'review_protect',
}, 
{
  title: '历史内容映射',
  key: 'enable_derives',
},{
  title: '过滤的自媒体类型',
  key: 'wemediaType',
}, {
  title: '白名单账号',
  key: 'protect_source',
}, {
  title: '源名称',
  key: 'src',
}]

export const defaultVideoRuleFormValue = {
  ruleId: '-1',
  source: '',
  name: '',
  desc: '',
  logic: 'or',
  security: [],
  channelList: {
    type: 'white_list',
    content: 'best'
  },
  filter_escape: [],
  duration:0,
  micro_duration:0,
  vct: '',
  vsct: '',
  ncat_class: '',
  nsubcat_class: '',
  ttkey: '',
  dirtyTag: false,
  mild_dirty: false,
  vlevel: '无',
  new_sourcelevel: [],
  sourcelevel: '无',
  sc_dirty: 0,
  bait: 0,
  batch: -1,
  c_imgs_dirty: 0,
  c_imgs_sexy: 0,
  c_imgs_disgusting: 0,
  blur: 0,
  unclarity: 0,
  over_image_baidu_unclarity: 0,
  over_image_blur: 0,
  cover_image_yd_sexy: 0,
  micro_sc_dirty: 0,
  micro_bait: 0,
  micro_sick: 0,
  micro_c_imgs_dirty: 0,
  micro_c_imgs_sexy: 0,
  micro_c_imgs_disgusting: 0,
  micro_female_sexy: 0,
  micro_male_sexy: 0,
  micro_intimacy: 0,
  micro_yd_general_sexy: 0,
  micro_yd_disgusting: 0,
  micro_yd_intimacy: 0,
  micro_over_image_baidu_unclarity: 0,
  micro_over_image_blur: 0,
  micro_cover_image_yd_sexy: 0,
  wemediaType: [],
  title_quality: [],
  micro_title_quality: [],
  editorProtect: true,
  src: '',
  wm_ids: '',
  protect_source: '',
  distributionTime: '', // 可分发时长
  video_tags: '',
  yd_porny: 0,
  yd_sexy: 0,
  micro_yd_porny: 0,
  micro_yd_sexy: 0,
  cover_stretch: 0,
  cover_frame: 0,
  cover_mosaic_piece : 0,
  cover_mosaic_proportion : 0,
  micro_cover_stretch : 0,
  micro_cover_frame : 0,
  micro_cover_mosaic_piece : 0,
  micro_cover_mosaic_proportion : 0,
  yd_porny_animal : 0,
  micro_yd_porny_animal : 0
}
export const videocolumns = [{
  title: '规则编号',
  key: 'ruleId',
}, {
  title: '过滤规则名称',
  key: 'name',
}, {
  title: '说明',
  key: 'desc',
}, {
  title: '来源',
  key: 'source',
}, {
  title: '逻辑',
  key: 'logic',
}, {
  title: '涉领导人',
  key: 'security',
}, {
  title: '频道(黑/白)名单',
  key: 'channelList',
}, {
  title: '低俗/血腥/重口味标签',
  key: 'dirtyTag',
}, {
  title: '轻度低俗',
  key: 'mild_dirty',
}, {
  title: '视频等级',
  key: 'vlevel',
}, {
  title: '自媒体等级',
  key: 'new_sourcelevel',
}, {
  title: '标题低俗',
  key: 'sc_dirty',
},{
  title: '视频时长过滤',
  key: 'duration',
}, {
  title: '标题党',
  key: 'bait',
}, {
  title: '标题重口',
  key: 'sick',
}, {
  title: '小视频标题低俗',
  key: 'micro_sc_dirty',
},{
  title: '小视频时长过滤',
  key: 'micro_duration',
}, {
  title: '小视频标题党',
  key: 'micro_bait',
}, {
  title: '小视频标题重口',
  key: 'micro_sick',
}, {
  title: '一级分类',
  key: 'vct',
}, {
  title: '二级分类',
  key: 'vsct',
}, {
  title: '新一级分类',
  key: 'ncat_class',
}, {
  title: '新二级分类',
  key: 'nsubcat_class',
}, {
  title: '标题关键词',
  key: 'ttkey',
}, {
  title: '源评级',
  key: 'authority',
}, {
  title: '低俗图',
  key: 'c_imgs_dirty',
}, {
  title: '涉性图',
  key: 'c_imgs_sexy',
}, {
  title: '恶心图',
  key: 'c_imgs_disgusting',
}, {
  title: '一点模糊图',
  key: 'blur',
}, {
  title: '百度模糊图',
  key: 'unclarity',
}, {
  title: '女性性感图',
  key: 'female_sexy',
}, {
  title: '男性性感图',
  key: 'male_sexy',
}, {
  title: '亲密行为图',
  key: 'intimacy',
}, {
  title: '自研一般性感图',
  key: 'yd_general_sexy',
}, {
  title: "自研重口味图",
  key: "yd_disgusting"
}, {
  title: "自研亲密行为图",
  key: "yd_intimacy"
}, {
  title: "封面模糊图",
  key: "over_image_baidu_unclarity"
}, {
  title: "自研封面模糊图",
  key: "over_image_blur"
}, {
  title: "自研封面性感图",
  key: "cover_image_yd_sexy"
}, {
  title: "自研动物交配模型",
  key: "yd_porny_animal"
}, {
  title: "小视频自研动物交配模型",
  key: "micro_yd_porny_animal"
}, {
  title: '小视频低俗图',
  key: 'micro_c_imgs_dirty',
}, {
  title: '小视频涉性图',
  key: 'micro_c_imgs_sexy',
}, {
  title: '小视频恶心图',
  key: 'micro_c_imgs_disgusting',
}, {
  title: '小视频女性性感图',
  key: 'micro_female_sexy',
}, {
  title: '小视频男性性感图',
  key: 'micro_male_sexy',
}, {
  title: '小视频亲密行为图',
  key: 'micro_intimacy',
}, {
  title: '小视频自研一般性感图',
  key: 'micro_yd_general_sexy',
}, {
  title: "小视频自研重口味图",
  key: "micro_yd_disgusting"
}, {
  title: "小视频自研亲密行为图",
  key: "micro_yd_intimacy"
}, {
  title: "小视频封面模糊图",
  key: "micro_over_image_baidu_unclarity"
}, {
  title: "小视频自研封面模糊图",
  key: "micro_over_image_blur"
}, {
  title: "小视频自研封面性感图",
  key: "micro_cover_image_yd_sexy"
},{
  title: "封面拉伸",
  key: "cover_stretch"
},{
  title: "小视频封面拉伸",
  key: "micro_cover_stretch"
}, {
  title: "封面边框",
  key: "cover_frame"
}, {
  title: "小视频封面边框",
  key: "micro_cover_frame"
}, {
  title: "封面马赛克块数",
  key: "cover_mosaic_piece"
}, {
  title: "小视频封面马赛克块数",
  key: "micro_cover_mosaic_piece"
},{
  title: "小视频封面马赛克面积",
  key: "micro_cover_mosaic_proportion"
},{
  title: "封面马赛克面积",
  key: "cover_mosaic_proportion"
}, {
  title: '是否保护编辑操作内容',
  key: 'editorProtect',
},{
  title: '人审内容保护',
  key: 'review_protect',
},
{
  title: '历史内容映射',
  key: 'enable_derives',
}
, {
  title: '过滤的自媒体类型',
  key: 'wemediaType',
}, {
  title: '是否豁免文章',
  key: 'filter_escape',
}, {
  title: '白名单账号',
  key: 'protect_source',
}, {
  title: '源名称',
  key: 'src',
}]

export const VideoFormLayout: Object = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
}

export const newsFieldReferenceList = {
  dirty: [
    {
      level: '2级',
      value: 0.8
    },
    {
      level: '3级',
      value: 0.81
    },
    {
      level: '1级',
      value: 0.4
    },
    {
      level: '4级',
      value: 0.99
    }
  ],
  sex: [
    {
      level: '1级',
      value: 0.4
    },
    {
      level: '2级',
      value: 0.4
    },
    {
      level: '3级',
      value: 0.6
    }
  ],
  bait: [
    {
      level: '1级',
      value: 0.5
    },
    {
      level: '2级',
      value: 0.85
    },
    {
      level: '3级',
      value: 0.86
    },
    {
      level: '4级',
      value: 0.9
    }
  ],
  spam: [
    {
      level: '1级',
      value: 0.9
    },
    {
      level: '2级',
      value: 1.5
    }
  ],
  sick: [
    {
      level: '1级',
      value: 0.6
    },
    {
      level: '2级',
      value: 0.8
    },
    {
      level: '3级',
      value: 1.0
    }
  ]
}

export const videoFieldReferenceList = {
	sc_dirty : [
		{
			level : "3级",
			value : 0.95
		},
		{
			level : "1级",
			value : 0.9
		},
		{
			level : "4级",
			value : 0.999
		},
		{
			level : "2级",
			value : 0.9
		}
	],
	bait : [
		{
			level : "1级",
			value : 0.5
		},
		{
			level : "2级",
			value : 0.5
		},
		{
			level : "3级",
			value : 0.85
		},
		{
			level : "4级",
			value : 0.9
		}
	],
	sick : [
		{
			level : "2级",
			value : 0.8
		},
		{
			level : "3级",
			value : 0.9
		}
	]
}
