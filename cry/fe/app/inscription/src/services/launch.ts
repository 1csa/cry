/**
 * 这里因为id的来源来自于输入框，所以导致所有的id类型均为string类型
 * TODO 数据库中的类型为数值，这里考虑看是否需要做统一
*/

import { DebugMode } from "@/types/app";
import { LaunchScreen, LaunchForm } from '@/types/launch';
import { axiosget, axiospost } from '@/utils';

// 获取单条投放信息
export const getLaunch = async (launch_id: string, mode?: DebugMode) => {
  return await axiosget('/launch/get', { launch_id }, mode);
}

export const postLaunch = async (data: LaunchForm, isnew: boolean, mode?: DebugMode) => {
  return await axiospost('/launch/post', { launch: data }, { isnew }, mode);
}

// 获取投放列表
export const getList = async (query: LaunchScreen, mode?: DebugMode) => {
  return await axiosget('/launch/list', query, mode);
}

// 人工停止投放
export const stopLaunch = async (launch_id: string, mode?: DebugMode) => {
  return await axiosget('/launch/stop', { launch_id }, mode);
}

// 获取筛选表单的选项
export const fetchOption = async (inputid: string, mode?: DebugMode) => {
  return await axiosget('/launch/option', { id: inputid }, mode);
}
