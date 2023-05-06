import { request, parsequery } from '@/utils'
import { HistoryReturn, PauseReturn } from '@/config/editorpush/history';

// 获取push历史
export async function getPushHistory(query: Record<string, any>): Promise<HistoryReturn> {
  const newReqObj = JSON.parse(JSON.stringify(query))
  newReqObj['limit'] = query['pageCount']
  delete newReqObj.pageCount
  delete newReqObj.orderBy
  return await request.get<HistoryReturn>(`/api/push/history?${parsequery(newReqObj)}`);
}

// 暂停/恢复推送
export async function updatePush(id: string, type: "pause" | "continue") {
  return await request.get<PauseReturn>(`/api/push/history/updatepush?${parsequery({ push_id: id, type })}`)
}

// 更新内容
export async function updateContent(id: string, newTitle: string, newSummary: string) {
  return await request.get(`api/push/history/updatecontent?pushId=${id}&newTitle=${encodeURIComponent(newTitle)}&newSummary=${encodeURIComponent(newSummary)}`);
}
