import { DebugMode } from "@/types/app";
import { StrategyScreen, StrategyForm } from '@/types/strat';
import { axiosget, axiospost } from '@/utils';

// 获取单条策略
export const getStrat = async (id: number, mode?: DebugMode) => {
  return await axiosget('/strategy/get', { strat_id: id }, mode);
}

// 获取策略列表
export const getList = async (query: StrategyScreen, mode?: DebugMode) => {
  return await axiosget('/strategy/list', query, mode);
}

export const postStrat = async (data: StrategyForm, param?: Record<string, any>, mode?: DebugMode) => {
  return await axiospost('/strategy/post', { strat: data }, param, mode);
}

export const stopStrat = async (id: number, mode?: DebugMode) => {
  return await axiosget('/strategy/stop', { strat_id: id }, mode);
}

export const reuseStrat = async (id: number, mode?: DebugMode) => {
  return await axiosget('/strategy/reuse', { strat_id: id }, mode);
}

export const getFbList = async (query, mode?: DebugMode) => {
  return await axiosget('/feedback/list', query, mode);
}

export const postFeedback = async (feedback, isnew: boolean, mode?: DebugMode) => {
  return await axiospost('/feedback/post', { feedback }, { isnew }, mode);
}

export const deleteFeedback = async (feedback_id: string, mode?: DebugMode) => {
  return await axiosget('/feedback/delete', { feedback_id }, mode);
}

export const deleteStrat = async (strat_id: string, mode?: DebugMode) => {
  return await axiosget('/strategy/delete', { strat_id }, mode);
}

export const fetchStratOption = async (strat_id: string, mode?: DebugMode) => {
  return await axiosget('/strategy/option', { strat_id }, mode)
}

export const fetchFbOption = async (fb_name: string, mode?: DebugMode) => {
  return await axiosget('/feedback/option', { fb_name }, mode);
}

export const fetchFbItem = async (fb_id: string, mode?: DebugMode) => {
  return await axiosget('/feedback/get', { fb_id }, mode);
}
