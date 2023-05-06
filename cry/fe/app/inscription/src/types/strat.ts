import { SelectOption } from '@/types/comp';

export enum StratStatus {
  all = 0,
  enable = 1,
  unable = 2
}

// 策略列表
export interface StrategyList {
  strat_id: number;
  strat_appid: string;
  strat_title: string;
  strat_remark: string;
  strat_status: StratStatus;
  // time_create: string;
  create_timekey: string;
  creater: string;
  // time_update: string;
  update_timekey: string;
  updater: string;
}

export interface FeedbackForm {
  feedback_id?: number | null;
  feedback_name?: string | null;
  feedback_forbidden_days?: number | null;
  feedback_downright?: boolean | null;
  feedback_downright_count?: number | null;
  feedback_downright_days?: number | null;
}

export type FeedbackList = FeedbackForm & {
  feedback_creator: string,
  feedback_timekey: string
}

// 从筛选表单中获取的筛选参数
export type FormScreen = {};

// 从表格中获取的筛选参数：分页、排序
export type ListScreen = {
  page: number;
  pageCount: number;
};

// 策略筛选参数
export type StrategyScreen = FormScreen & ListScreen;

export type FeedbackScreen = {} & ListScreen;

// 新建策略
export interface StrategyForm {
  strat_id?: number | null;
  strat_title?: string | null;
  strat_remark?: string | null;

  strat_appid?: string | null;
  strat_device?: string | null;
  strat_max_api?: number | null;
  strat_min_api?: number | null;
  strat_distribution?: string | null;
  strat_source?: string | null;

  strat_channel?: string | null;
  strat_position?: number | null,
  card_weight?: number | null,
  strat_priority?: number | null,
  strat_display_strategy?: string | null;
  strat_display_max?: number | null;
  strat_display_interval?: string | null;  // 这里前端和数据库设计产生了gap，按理讲此处应该为number，但是数据库设计成了string且已上线，此处服从数据库
  strat_pull_mode?: string | null;
  strat_is_feedback?: 0 | 1 | null;
  strat_feedback_id?: string | null;

  strat_user_packid: string | null;
  strat_user_bucket: string | null;
  strat_user_whitelist: string | null;
}

export interface StratModelState {
  stratList: StrategyList[];
  feedbackList: FeedbackList[];
  stratTotal: number;
  feedbackTotal: number;
  strategy?: StrategyForm;
  feedback?: FeedbackForm;
  stratOption?: SelectOption[];
  fbOption: SelectOption[];
}
