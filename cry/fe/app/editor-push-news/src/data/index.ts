export const zeus_path = "/api/editor_push";

export const tv_type_list = [
  { label: 'url', value: 'url' },
  { label: 'docid', value: 'docid' },
  { label: 'channel', value: 'channel' },
  { label: 'tvchannel', value: 'tvchannel' },
  { label: 'category', value: 'category' },
  { label: 'movie', value: 'movie' },
]

export const bottom_tab_list = [
  { label: '首页', value: 'shouye' },
  { label: '视频', value: 'shipin' },
  { label: '我的', value: 'wode' },
  { label: '小视频', value: 'xiaoshipin' },
  // { label: '电台', value: 'diantai' },
  { label: '小说', value: 'novel' },
  { label: '音频', value: 'diantai' },
  { label: '看电视', value: 'tv' }
]

export const rank_list_type_list = [
  { label: '电台', value: 'ximaFM' },
  { label: '漫画', value: 'comic' },
]

export const xima_rank_type_list = [
  { label: 'fm_rank_free', value: 'fm_rank_free' },
  { label: 'fm_rank_paid', value: 'fm_rank_paid' },
  { label: 'fm_category_home', value: 'fm_category_home' },
  { label: 'fm_rank_soar', value: 'fm_rank_soar' },
]

export const comic_rank_type_list = [
  { label: 'comic_rank_popularity', value: 'comic_rank_popularity' },
  { label: 'comic_rank_potentiality', value: 'comic_rank_potentiality' },
]

export const tv_station_type_list = [
  { label: '电视直播', value: 'live' },
  { label: '长视频', value: 'video' },
]

export const action_type_list = [
  { label: 'h5', value: 'h5' },
  { label: 'native', value: 'native' },
]

export const open_type_list = [
  { label: '底栏tab打开', value: 0 },
  { label: '订阅频道打开', value: 1 },
  { label: '频道预览页打开', value: 2 },
]

export const retrieve_strategy_list = [
  { label: '非个性化', value: 'only_veins' },
  { label: '个性化', value: 'origin_veins' },
]

export const expire_time_list = [
  { label: '0.5小时', value: '1800' },
  { label: '1小时', value: '3600' },
  { label: '1.5小时', value: '5400' },
  { label: '2小时', value: '7200' },
  { label: '2.5小时', value: '9000' },
  { label: '3小时', value: '10800' },
  { label: '3.5小时', value: '12600' },
  { label: '4小时', value: '14400' },
  { label: '4.5小时', value: '16200' },
  { label: '5小时', value: '18000' },
  { label: '5.5小时', value: '19800' },
  { label: '6小时', value: '21600' },
]

export const deliver_scope_list = [
  { label: '重要----大类', value: 'important_category' },
  { label: '重要----大兴趣点', value: 'important_mass' },
  { label: '重要----小兴趣点', value: 'important_minority' },
  { label: '常规内容', value: 'normal' },
]

export const platform_list = [
  { label: 'Android', value: 'android' },
  { label: 'IOS', value: 'iPhone' },
  { label: '浏览器', value: 'Browser' },
]

export const userprofileMap = {
  ens_ct: '图文大类',
  ens_sct: '图文小类',
  ens_vd_ct: '视频大类',
  ens_vd_sct: '视频小类',
  ens_fromid: '频道',
  ens_keyword: '关键词',
  ens_taste: '对文章属性的倾向',
  ens_src: '内容源偏好',
  ck_s_ct: '图文大类',
  ck_s_sct: '图文小类',
  ck_s_vd_ct: '视频大类',
  ck_s_vd_sct: '视频小类',
  ck_s_fromid: '频道',
  ck_s_kw: '关键词',
  ck_s_taste: '对文章属性的倾向',
  ck_s_src: '内容源偏好',
  cs_s_ct: '图文大类',
  cs_s_sct: '图文小类',
  cs_s_vd_ct: '视频大类',
  cs_s_vd_sct: '视频小类',
  cs_s_fromid: '频道',
  cs_s_kw: '关键词',
  cs_s_taste: '对文章属性的倾向',
  cs_s_src: '内容源偏好',
}

export const hot_spot_list = [
  { label: '全局热点', value: 'global' },
  { label: '头部热点', value: 'head' },
  { label: '中长尾热点', value: 'longtail' },
  { label: '争议热点', value: 'controversy' },
]

export const app_name_list = [
  { label: '腾讯新闻', value: '腾讯新闻' },
  { label: '看点快报', value: '看点快报' },
  { label: '新浪新闻', value: '新浪新闻' },
  { label: '网易新闻', value: '网易新闻' },
  { label: '今日头条', value: '今日头条' },
  { label: '一点资讯', value: '一点资讯' },
]

export const user_layer_list = [
  { label: '全部', value: '全部' },
  { label: '当日新用户', value: 'zeroDayUser' },
  { label: '活跃新用户', value: 'e2427926' },
  { label: '活跃老用户', value: 'e2427953' },
  { label: '次活跃老用户', value: 'e2552438' },
  { label: '轻度沉默用户', value: 'e2427927' },
  { label: '中度沉默用户', value: 'e2427928' },
  { label: '重度沉默用户', value: 'e2427929' },
  { label: '沉默90天以上用户', value: 'e2356031' },
]

export const push_type_map = {
  // all: "全量个性化",
  all_break: "全量突发",
  auto: "局部个性化",
  auto_break: "局部突发",
  userids: "指定用户",
  // appids: "指定客户端全量",
}

export const hot_level_map = {
  1: "一级-重大领域突发",
  2: "二级-个性化突发",
  3: "三级-强时效个性化",
  4: "四级-弱时效个性化"
}

export const break_hot_level_map = {
  1: "一级-重大领域突发",
  2: "二级-个性化突发"
};

export const auto_hot_level_map = {
  3: "三级-强时效个性化",
  4: "四级-弱时效个性化"
};

export const business_map = {
  "YDZX": "一点资讯新闻客户端",
  "LOCALSIDE": "身边版",
  // "METRO": "地铁版"
  // "LIFE": "生活圈B端"
};

export const yes_no_map = {
  0: "否",
  11: "小米",
  22: "oppo",
  33: "小米 & oppo",
};

export const platform_map = {
  android: '安卓',
  iPhone: "IOS",
  Browser: "浏览器"
}

export const rs_type_map = {
  "normal": "文章",
  "url": "URL链接",
  "talk": "话题",
  "channel_card": "频道",
  "bottom_tab": "底栏Tab",
}

export const bottom_tab_map = {
  shouye: '首页',
  shipin: '视频',
  wode: '我的',
  xiaoshipin: '小视频',
  novel: '小说',
  diantai: '音频',
  tv: '看电视'
}

export const speed_level_map = {
  immediately: "即时(3分钟内)",
  urgent: "紧急(10分钟内)",
  fast: "快速(15分钟内)",
  normal: "一般(20分钟内)"
}

export const expire_time_map = {
  1800: "0.5小时",
  3600: "1小时",
  5400: "1.5小时",
  7200: "2小时",
  9000: "2.5小时",
  10800: "3小时",
  12600: "3.5小时",
  14400: "4小时",
  16200: "4.5小时",
  18000: "5小时",
  19800: "5.5小时",
  21600: "6小时"
}

export const tag_type_map = {
  pushtag: "搜索",  // 使用标签进行搜索
  userset: "条件圈选",  // 使用tuffy圈定人群进行搜索
  fromid: "输入"  // 手动输入fromid进行搜索
}

export const comp_hotpot_map = {
  global: '全局热点',
  head: '头部热点',
  longtail: '中长尾热点',
  controversy: '争议热点',
}

export const comp_app_map = {
  看点快报: "看点快报",
  网易新闻: "网易新闻",
  百度: "百度",
  今日头条: "今日头条",
  微博: "微博",
  新浪新闻: "新浪新闻",
  腾讯新闻: "腾讯新闻",
  一点资讯: "一点资讯",
  趣头条: "趣头条",
  UC浏览器: "UC浏览器",
  凤凰新闻: "凤凰新闻",
  QQ浏览器: "QQ浏览器",
  搜狐新闻: "搜狐新闻",
  人民日报: "人民日报",
  新华社: "新华社",
  澎湃新闻: "澎湃新闻"
}

export const comp_sortway_map = {
  asc: "时间升序",
  desc: "时间降序"
}

export const comp_status_map = {
  0: "入库中",
  1: "已入库",
  2: "入库失败",
  '-1': "全部",
}


// http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=75282361
export const user_tags_map = {
  // 研发测试
  // u8249: 'test12',

  // 产品测试
  // e2769450: 'e2769453',

  // 全部标签
  e2434868: 'e2767263',
  e2460740: 'e2767269',
  e2435255: 'e2767272',
  e2442602: 'e2767277',
  e2435256: 'e2767280',
  e2455638: 'e2767284',
  e2434872: 'e2767290',
  e2434866: 'e2767294',
  e2435240: 'e2767296',
  e2437050: 'e2767300',
  e2438450: 'e2767303',
  e2434865: 'e2767309',
  e2467466: 'e2767312',
  e2491928: 'e2767314',
  e2434874: 'e2767317',
};


// 用于反查，find key from value
export const user_tags_map_reverse = {
  // 研发测试
  // test12: 'u8249',

  // 产品测试
  // e2769453: 'e2769450',

  // 全部标签反向映射
  e2767263: 'e2434868',
  e2767269: 'e2460740',
  e2767272: 'e2435255',
  e2767277: 'e2442602',
  e2767280: 'e2435256',
  e2767284: 'e2455638',
  e2767290: 'e2434872',
  e2767294: 'e2434866',
  e2767296: 'e2435240',
  e2767300: 'e2437050',
  e2767303: 'e2438450',
  e2767309: 'e2434865',
  e2767312: 'e2467466',
  e2767314: 'e2491928',
  e2767317: 'e2434874',
}

export const quota_code_list = [
  { label: '编辑', value: '10000' },
  { label: '激励', value: '10001' },
  { label: '飞剪推广', value: '10002' },
  { label: '拍客', value: '10003' },
]
