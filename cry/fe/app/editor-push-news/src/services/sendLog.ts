import request from '@/utils/request';
import { SendLogType } from '@/config/sendLog/sendLog';

export async function sendLog(params: SendLogType): Promise<any> {
  const { page = '', action_id = '', context = '' } = params;
  const create_time = Date.now();
  const env = window.location.host === 'zeus.v.yidian-inc.com' ? 'prod' : 'dev';
  const action = 'click';
  return request(`/api/push/sendlog?action=${action}&page=${page}&action_id=${action_id}&env=${env}&context=${context}&create_time=${create_time}`);
}