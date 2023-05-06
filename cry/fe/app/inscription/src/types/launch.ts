// TODO: 这里的参数没有和config中统一，修改需谨慎
import { SelectOption } from '@/types/comp';
export interface LaunchForm {
  launch_id: string | null;               // 投放id
  card_id: string | null;                 // 卡片id
  strat_id: string | null;                // 策略id
  launch_name: string | null;             // 投放名称
  launch_start: number;                   // 投放开始时间
  launch_end: number;                     // 投放结束时间
  launch_remark: string | null;           // 说明
}


// 投放列表
export interface LaunchList {
  launch_id: number;                      // 投放ID
  card_id: number;                        // 卡片ID
  strategy_id: string;                    // AppID
  launch_name: string;                    // 投放名称
  launch_remark: string;                  // 投放说明
  launch_status: number;                  // 状态
  // create_time: string;                    // 创建时间
  create_timekey: string;                 // 创建时间
  creator: string;                        // 创建人
  launch_start: number;                   // 投放开始时间
  launch_end: number;                     // 投放结束时间
}

export type ListScreen = {
  page: number;
  pageCount: number;
}

export type FormScreen = {
  launch_id?: string | null;
  appid?: string | null;
  launch_card?: string | null;
  launch_name?: string | null;
  launch_creater?: string | null;
  launch_status?: number | null;
  create_start?: string | null;
  create_end?: string | null;
  launch_start?: string | null;
  launch_end?: string | null;
}

export type LaunchScreen = ListScreen & FormScreen;

export type FormRouteParam = {
  id: string;
}

export type FormRouteQuery = {
  card?: string;
}

export interface LaunchModelState {
  launchList: LaunchList[];
  launchTotal: number;
  launch?: LaunchForm;
  launchOption?: SelectOption[];
}
