import {Effect} from 'dva';
import {Reducer} from 'redux';
import {
  getTopicListService, // 获取话题, status = 1为线上话题
  saveTopTopicService,
  getTopTopicsService,
  saveTopicService
} from '@/services/topic';

import {
  computeDirty
} from '@/utils/dev_helper';
export interface SquareTopicState {
  isDirty: boolean // 更新数据列表
}

export interface TopicModelType {
  namespace: 'squareTopic',
  state: SquareTopicState,
  effects: {
    saveHotTopic: Effect,
    fetchEffectiveTopic: Effect,
    fetchTopTopics: Effect,
    saveTopic: Effect
  },
  reducers: {
    setDirty: Reducer
  }
}

const SquareTopicModel: TopicModelType = {
  namespace: 'squareTopic',
  state: {
    isDirty: false,
  },
  effects: {
    *saveTopic({type, payload}, {call, put}){
      const response = yield call(saveTopicService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: computeDirty(response)
        }
      });
      return response;
    },
    *saveHotTopic({type, payload}, {call, put}){
      const response = yield call(saveTopTopicService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: computeDirty(response)
        }
      });
      return response;
    },
    *fetchEffectiveTopic(_, {call, put}){
      const response = yield call(getTopicListService, 1); // 获取线上的topic
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: false
        }
      });
      // console.log(response);
      return response;
    },
    *fetchTopTopics(_, {call, put}) {
      const response = yield call(getTopTopicsService);
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

export default SquareTopicModel;
