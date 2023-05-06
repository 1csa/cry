import {Effect} from 'dva';
import {Reducer} from 'redux';

import {
  searchDocByKeywordService,
  searchDocByDocidsService,
  saveDocToTopicService,
  getDocsService,
  docStickyService, // 置顶
  docUnStickyService, // 取消置顶
} from '@/services/doc';

import {computeDirty} from '@/utils/dev_helper';

export interface DocState {
  isDirty: boolean
}

export interface DocModelType {
  namespace: string,
  state: DocState,
  effects: {
    searchDocByKeyword: Effect,
    searchDocByDocids: Effect,
    saveDocToTopic: Effect,
    getDocs: Effect,
    docSticky: Effect,
    docUnSticky: Effect,
  },
  reducers: {
    setDirty: Reducer
  }
}

const DocModel: DocModelType = {
  namespace: 'doc',
  state: {
    isDirty: false,
  },
  effects: {
    *searchDocByKeyword({payload}, {put, call}){
      const response = yield call(searchDocByKeywordService, payload.keyword);
      return response;
    },
    *searchDocByDocids({payload}, {put, call}){
      const response = yield call(searchDocByDocidsService, payload.docids);
      return response;
    },
    *saveDocToTopic({payload}, { put, call }){
      const response = yield call(saveDocToTopicService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: computeDirty(response)
        }
      });
      return response;
    },
    *getDocs({payload}, {put, call}){
      const response = yield call(getDocsService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: false
        }
      });
      return response;
    },
    *docSticky({payload}, {put, call}){
      const response = yield call(docStickyService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: computeDirty(response)
        }
      });
      return response;
    },
    *docUnSticky({payload}, {put, call}){
      const response = yield call(docUnStickyService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: computeDirty(response)
        }
      });
      return response;
    }
  },
  reducers: {
    setDirty(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  }
};
export default DocModel;
