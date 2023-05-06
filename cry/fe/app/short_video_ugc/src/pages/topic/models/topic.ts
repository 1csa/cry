import {Effect} from 'dva';
import {Reducer} from 'redux';
import {
  saveTopicService,
  getTopicListService,
  changeTopicStatusService
} from '@/services/topic';

import {
  computeDirty
} from '@/utils/dev_helper';
export interface TopicState {
  isDirty: boolean // 更新数据列表
}

export interface TopicModelType {
  namespace: 'topic',
  state: TopicState,
  effects: {
    saveTopic: Effect,
    fetchTopic: Effect,
    changeTopicStatus: Effect
  },
  reducers: {
    setDirty: Reducer
  }
}

const TopicModel: TopicModelType = {
  namespace: 'topic',
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
    *fetchTopic(_, {call, put}){
      const response = yield call(getTopicListService);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: false
        }
      });
      // console.log(response);
      return response;
    },
    *changeTopicStatus({type, payload}, {call, put}){
      const response = yield call(changeTopicStatusService, payload);
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

export default TopicModel;
