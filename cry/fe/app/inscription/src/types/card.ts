// TODO key值需要和config中同步
import { SelectOption } from '@/types/comp';

// 卡片状态
export enum CardStaus {
  all = 0,
  able = 1,
  unable = 2,
}

// 顶部的卡片类型
export enum CardType {
  info = 1,
  feature = 2
}

export enum CardTemp {
  dt = 1,                       // 单图
  xt = 2,                       // 小图
  dtjj = 3,                     // 单图带简介
  lj = 1002,                    // 两级
  sj = 1003                     // 三级
}

// 卡片列表
export interface CardList {
  card_id: number;										  // id
  card_title: string;										// 标题
  card_remark: string;								  // 说明
  card_temp: number; 							      // 类型
  card_status: CardStaus;							  // 状态(1-启用， 2-未启用)
  create_timekey: string;							  // 创建时间
  card_creator: string;							        // 创建人
  update_timekey: string;							  // 更新时间
  card_updater: string;						          // 更新人
}

// 写入表单的筛选参数
export type FormScreen = {
  card_id?: number | null,
  card_title?: string | null,
  card_temp?: number | null,
  card_status?: number | null,
  create_start?: number | null,
  create_end?: number | null
  // card_id?: string;
  // appId?: string;
  // card_title?: string;
  // card_template?: string;
  // enable?: 0 | 1 | 2;                    // 和给定的存在差别，为0表示全部
  // createTime1?: string;
  // createTime2?: string;
}

// 未写入表单的筛选参数
export type ListScreen = {
  page: number;
  pageCount: number;
}

export type CardScreen = FormScreen & ListScreen;

export type DocInfo = {
  title?: string,
  image?: string,
}

// card store
export interface CardModelState {
  cardstore: CardForm;
  cardlist: CardList[];
  cardTotal: 0;
  docinfo: Record<string, DocInfo>;
  cardOption?: SelectOption[];
}

// 卡片内容
export type CardContent = Record<string, any>;

// 卡片样式
export type CardStyle = Record<string, any>;

// 卡片跳转
export type CardActions = Record<string, any>;

// 新建卡片：如何来兼容不同类型的卡片？这里误把type当成interface来使用，所以其实可能不太对？
export type CardForm = {
  card_id: number | null;
  card_temp: number | null;
  card_title?: string |  null;
  card_remark?: string | null;
  card_content: CardContent ;
  card_style: CardStyle;
  card_actions?: CardActions;

  card_items?: CardForm[];
}

// 预留: 用于表单生成器形式的action组件
export type ActionParamItem = {
  form: string;                   // 表单
  name: string;                   // 表单key
  label: string;                  // 表单label
  formParam?: Record<string, any>  // 表单使用的参数
}

export type ActionParamConfig = {
  [key: string]: ActionParamItem[]
}

// 卡片跳转：通用类型参数
export interface ActionItem {

}

export interface CardChild {
  index: number;
  id: string;
  name: string;
}
