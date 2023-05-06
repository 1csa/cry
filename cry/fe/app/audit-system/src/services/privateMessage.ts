
import request from '@/utils/request';
import appConfig from '@/config/app.config';

export async function fetchMessageReview(): Promise<any> {
  return request('/api/messageReview');
}

export async function fetchHistoryContentList(): Promise<any> {
  return request('/api/historyContentList');
}