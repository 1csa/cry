import request from '@/utils/request';
import API from '@/utils/api';
import { CPP_AUTH_KEY, AUTH_KEY } from './common';
import { saveLog } from '@/utils/dev_helper';

export async function searchDocByKeywordService(keyword: string): Promise<any>{
  return request(API.search_doc_by_keyword, {
    params: {
      keyword,
    }
  });
}

export async function searchDocByDocidsService(docids: string): Promise<any>{
  return request(API.search_doc_by_docid, {
    params: {
      docids
    }
  });
}

export async function operateDocByCppApi (docid: string, type: string): Promise<any> {
  const params = {
    docid,
    from: 'xumingquan@short_video_ugc',
    key: CPP_AUTH_KEY
  }
  saveLog({params}, type);
  return request(API[type], {
    params
  });
}

export async function saveDocToTopicService({params, data}: any): Promise<any> {
  params['from'] = 'xumingquan@short_video_ugc';
  params['key'] = CPP_AUTH_KEY;
  saveLog({params, data}, 'saveDocToTopic');
  return request(API.add_doc, {
    params,
    data,
    method: 'post',
    headers: {
      'IS-FORM-DATA': 'form-data'
    }
  });
}

export async function getDocsService(params: any): Promise<any> {
  return request(`/api/proxy/${API.doc_list}`, {
    params,
    method: 'get'
  });
}

export async function docStickyService(params: any): Promise<any> {
  params.key = AUTH_KEY;
  return request(`/api/proxy/${API.doc_sticky}`, {
    params,
    method: 'get'
  });
}

export async function docUnStickyService(params: any): Promise<any> {
  params.key = AUTH_KEY;
  return request(`/api/proxy/${API.doc_unsticky}`, {
    params,
    method: 'get'
  });
}
