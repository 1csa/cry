/**
 * 首页统计信息
 */
export type OverviewDataCate = "card" | "strategy" | "launch";

export type HomeNewerItem = {
  date: string;
  data: number;
}

export type HomeRelateItem = {
  name: string;
  data: number;
}

export type StatisticItem = {
  name: string;
  count: number;
  minus?: number;
}

export type HomeCurrentItem = {
  name: OverviewDataCate;
  title: string;
  count: number;
  minus: number;
}


/**
 * 历史记录:
*/
// 操作类型，针对不同的操作对象
export enum OperationType {
  card = "card",
  strat = "strategy",
  launch = "launch"
}

// 操作方式
export enum OperatonName {
  add = "add",
  edit = "edit",
  stop = "stop",
  delete = "delete",
  reuse = "reuse"
}

// 列表
export interface HistoryList {
  oper_id: string;                                  // 操作自身的id
  oper_target: OperationType;                       // 操作类型
  oper_type: OperatonName;                          // 操作
  oper_name: string;                                // 名称
  oper_target_id: string;                           // 操作对象ID
  appid: string;                                    // AppID
  operator: string;                                 // 操作人
  timekey: string;                                  // 操作时间
}

export type ListScreen = {
  page: number;
  pageCount: number;
}

export type FormScreen = {}

export type HistoryScreen = ListScreen & FormScreen;

export interface OtherModelState {
  historyList: HistoryList[];
  historyTotal: number;
}
