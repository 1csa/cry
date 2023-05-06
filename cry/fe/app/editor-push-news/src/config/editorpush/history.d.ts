export type StatisticItem = {
  task_name: string;
  count: number;
}

export type PushHistoryItem = {
  id: number,
  biz_id: string;
  push_id: string;
  new_push_id: string;
  doc_id: string;
  create_time: string;
  news: string;
  head: string;
  type: string; // 推送类型
  platform: string[];
  channel: string[];
  exclude_channel: string[];
  operator: string;
  push_type_info: string;
  hot_level: string;
  xm_priority: 0 | 1;
  pause?: boolean;
  cate: string;
}

export type HistoryReturn = {
  status: string;
  result?: {
    statistics: Array<StatisticItem>,
    task_history: Array<PushHistoryItem>
  },
  code: number;
  message?: string;
}

export type HistoryListScreen = {
  page: number;
  pageCount: number;
}

export type HistoryFormScreen = {
  d?: string;
  push_id?: string;
  keywords?: string;
  operator?: string;
  userids?: string;
  channel?: string;
  platform?: string;
  hot_level?: string;
  xiaomi_priority?: 0 | 1;
  oppo_pay?: 0 | 1;
  doc_id?: string;
  page?: number;
  pageCount?: number;
  orderBy?:string;
}

export type HistoryScreen = HistoryListScreen & HistoryFormScreen;

export type PauseReturn = {
  status: string;
  message?: string;
}

