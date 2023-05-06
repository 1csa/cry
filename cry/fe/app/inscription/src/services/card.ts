import { DebugMode } from '@/types/app';
import { CardForm, CardScreen } from '@/types/card';
import { axiosget, axiospost } from '@/utils';

// 获取单条卡片
export const getCard = async (card_id: string, mode?: DebugMode,) => {
  return await axiosget('/cards/get', { card_id }, mode);
}

// 提交卡片
export const postCard = (data: CardForm, param: Record<string, any>, mode?: DebugMode,) => {
  return axiospost('/cards/post', { card: data }, param, mode)
}

// 获取文章
export const getArticle = (docid: string, mode?: DebugMode,) => {
  return axiosget('/common/doc', { docid }, mode);
}

// 获取卡片列表
export const getList = (query: CardScreen, mode?: DebugMode) => {
  return axiosget('/cards/list', query, mode);
}

// 停用卡片
export const stopCard = (card_id: number, mode?: DebugMode) => {
  return axiosget('/cards/stop', { card_id }, mode);
}

// 启用卡片
export const reuseCard = (card_id: number, mode?: DebugMode) => {
  return axiosget('/cards/reuse', { card_id }, mode);
}

export const deleteCard = (card_id: number, mode?: DebugMode) => {
  return axiosget('/cards/delete', { card_id }, mode);
}

// 获取卡片选项
export const fetchOption = (inputId: string, mode?: DebugMode) => {
  return axiosget('/cards/option', { id: inputId }, mode);
}

