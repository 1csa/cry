import request from '@/utils/request';
import API from '@/utils/api';
import {
  AUTH_KEY,
  FROM_ID
} from './common';
import { saveLog } from '@/utils/dev_helper';


export async function saveTopicService(data: TOPIC): Promise<any> {
  data.key = AUTH_KEY;
  data['fromid[0]'] = FROM_ID;
  let url = `/api/proxy/${API['talk-create']}`;
  let action_method = 'add_topic';
  if(!!data.id){
    url = `/api/proxy/${API['talk-edit']}`;
    action_method = 'update_topic';
  }
  saveLog(data, action_method);
  return request.post(url, {
    data,
    headers: {
      'IS-FORM-DATA': 'form-data'
    }
  });
}

export async function saveTopTopicService(topic: any[]): Promise<any>{
  const data: any = {
    key: AUTH_KEY,
    fromid: FROM_ID,
    top_talk: topic,
  };
  saveLog(data, 'saveTopTopic');
  return request.post(`/api/proxy/${API['save-topping-talk']}`, {
    data,
    headers: {
      'IS-FORM-DATA': 'form-data'
    }
  });
}

export async function getTopTopicsService(){
  return request(`/api/proxy/${API['topping-talk-list']}`, {
    params: {
      fromid: FROM_ID
    }
  });
}

export async function getTopicListService(status: number = 0): Promise<any>{
  return request.get(`/api/proxy/${API['talk-list']}?status=${status}&fromid=${FROM_ID}`);
}
export async function changeTopicStatusService(params: any): Promise<any>{
  params.key = AUTH_KEY;
  saveLog(params, 'updateTopicStatus');
  return request(`/api/proxy/${API['change-status']}`, {
    params,
  });
}

