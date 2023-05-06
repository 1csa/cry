import {Effect} from 'dva';
import {Reducer} from 'redux';
import {
  saveSpreadService,
  fetchSpreadService
} from '@/services/spread';

export interface SpreadState {
  isDirty: boolean // 更新数据列表
}

export interface TopicModelType {
  namespace: 'spread',
  state: SpreadState,
  effects: {
    saveSpread: Effect,
    fetchSpread: Effect
  },
  reducers: {
    setDirty: Reducer
  }
}

const SpreadModel: TopicModelType = {
  namespace: 'spread',
  state: {
    isDirty: true,
  },
  effects: {
    *saveSpread({type, payload}, {call, put}){
      const response = yield call(saveSpreadService, payload);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: true
        }
      });
      return response;
    },
    *fetchSpread(_, {call, put}){
      const response = yield call(fetchSpreadService);
      yield put({
        type: 'setDirty',
        payload: {
          isDirty: false
        }
      });
      // console.log(response);
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

export default SpreadModel;
