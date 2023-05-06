import { axiosget } from "@/utils";
import { HistoryScreen } from "@/types/other";
import { DebugMode } from '@/types/app';

// 获取历史列表
export const getHistoryList = async (query: HistoryScreen, mode: DebugMode) => {
  return await axiosget('/history/list', query, mode);
}

// 查询用户信息
export const queryAuth = async (mode: DebugMode) => {
  return await axiosget('/common/auth', { toolname: "inscription" }, mode)
}

