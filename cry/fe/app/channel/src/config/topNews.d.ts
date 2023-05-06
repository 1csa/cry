export type ChannelProps = {
  id: string;
  topicName: string;
  type: string;
  [key: string]: any;
};

export type TopNewsProps = {
  _id: string;
  top_news: Array<TopItemProps>;
  top_ts: number;
  lifespan?: number;
  del_news: Array<TopItemProps>;
};

export type ChannelDataObjProps = {
  app_all?: DataObjProps | {};
  all?: DataObjProps | {};
  app_channel?: DataObjProps | {};
  channel?: DataObjProps | {};
  doc_score?: number;
};

export type DataObjProps = {
  AddComment: number;
  AddCommentRate?: number;
  AvgCntdwell: number;
  AvgDwell: number;
  ClickDoc: number;
  ClickRate?: number;
  Cntdwell: number;
  DWell?: number;
  Dislike?: number;
  Duration?: number;
  Like: number;
  LikeRate?: number;
  RViewDoc: number;
  ShareDoc: number;
  ShareRate?: number;
  ThumbUp: number;
  VClickDoc?: number;
  ViewDoc: number;
};

export type videoProps = {
  category: string;
  country: string;
  year: string | number;
  douban_score: string | number;
};

export type TopItemProps = {
  date: string;
  count: number; // todo
  group: string;
  fromid: string;
  fromid_hw: string;
  feedback_forbidden: boolean;
  title: string;
  title_new?: string;
  docid: string;
  source: string;
  image: string;
  image_urls: Array<string>;
  is_news: number;
  tag: string;
  ctype: string;
  dtype?: number;
  block_appids?: Array<string>;
  data?: ChannelDataObjProps;
  editorEventLevel?: string;
  location?: string;
  cat?: string;
  subcat?: Array<string>;
  last_update_ts: number;
  audience_type?: 1;
  editorOnly?: {} | null;
  global: boolean;
  toptype?: string;
  security?: number;

  comment_count?: number;
  gifinfo?: {};
  keyword?: {};
  like?: number;
  props?: {};
  rank?: number;
  remove?: boolean;
  url?: string;
  video_album_meta?: videoProps;
  wemedia_id?: number;
  firstAddTopTime?: number; // 初次添加置顶时间
};

export type SearchResultProps = Partial<TopItemProps>;

export type TopMapProps = {
  [key: string]: any;
};

export type RecNewsProps = {
  _id: string;
  rec_list: Array<RecItemProps>;
  // top_ts: number
  // lifespan?: number
  // del_news: Array<RecItemProps>
};

export type RecItemObjProps = {
  _id: string;
  cat: Array<string>;
  tier: number;
  ntod: number;
  bait: boolean;
  dirty: boolean;
  sex: boolean;
  sick: boolean;
  spam: boolean;
  imgs_porny: boolean;
  imgs_sexy: boolean;
  imgs_female_sexy: boolean;
  imgs_male_sexy: boolean;
  imgs_intimacy: boolean;
  imgs_disgusting: boolean;
  imgs_unclarity: boolean;
  sc_spam: boolean;
  quality_score: boolean;
};

export type RecItemProps = {
  comment_count: number;
  ctype: string;
  count?: number;
  data?: ChannelDataObjProps;
  date: string;
  docid: string;
  dtype?: number;
  extra?: [];
  editorEventLevel?: string;
  fromid?: string;
  fromid_hw?: string;
  feedback_forbidden: boolean;
  gifinfo?: {};
  group?: string;
  global?: boolean;
  image: string;
  image_urls: Array<string>;
  keyword?: {};
  like: number;
  props: RecItemObjProps;
  rank: number;
  remove: boolean;
  source: string;
  title: string;
  title_new?: string;
  url: string;
  video_album_meta?: videoProps;
  wemedia_id: number;
  tag?: string;
  is_news?: number;
  toptype?: string;

  editorOnly?: {} | null;
  focus?: boolean;
  v_width?: number;
  v_height?: number;
  video_type?: string;
  meta?: string;
  impid?: string;
  pageid?: string;
  itemid?: string;
  tag_icon?: string;
  tag_name?: string;
  display_flag?: number;
  card_label?: {};
  tags?: [];
  category?: string;
  ddate?: string;
  security?: number;
  is_local_doc?: boolean;
  dislike_reasons?: [];
  dislike_fromids?: [];
  hard_sticky?: boolean;
  detail?: {};
  dsource?: string;
  summary?: string;
  image_attribut_update?: boolean;
  author_dtype?: string;
  mtype?: number;
  edit_cover?: boolean;
  dis_recommend?: boolean;
  b_political?: boolean;
  i_alliance_scope?: number;
  upload_images_v?: [];
  auth?: boolean;
  is_gov?: boolean;
  content_type?: string;
  enable_top?: boolean;
  is_like?: boolean;
  is_up?: boolean;
  is_down?: boolean;
  is_top?: boolean;
  title_sn?: 0;
  wemedia_info?: {};
  hard_sticky_first?: boolean;

  block_appids?: Array<string>;
  location?: string;
  cat?: string;
  subcat?: Array<string>;
  last_update_ts: number;
  audience_type?: 1;
};

export type RecProps = {
  fromid: string;
  appid?: string;
  order?: string;
  page?: number;
  size?: number;
  recItem?: RecItemProps;
  pageNum?: number;
};

export type searchProps = {
  keyword: string;
  fromid: string;
  days?: string;
  order?: string;
  src?: string;
};
