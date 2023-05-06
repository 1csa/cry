import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryAuth } from '@/services/user';

export interface CurrentAuth {
  childAuths: string [];
}

export interface AuthModelState {
  currentAuth?: CurrentAuth;
}

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    fetchAuth: Effect;
  };
  reducers: {
    saveCurrentAuth: Reducer<AuthModelState>;
  };
}

const AuthModel: AuthModelType = {
  namespace: 'auth',
  state: {
    currentAuth: {
      childAuths: []
    },
  },

  effects: {
    *fetchAuth(_, { call, put }) {
      const response = yield call(queryAuth);
      yield put({
        type: 'saveCurrentAuth',
        payload: {
          childAuths: response.result,
        },
      });
      return response;
    },
  },

  reducers: {
    saveCurrentAuth(state, action) {
      return {
        ...state,
        currentAuth: action.payload || {},
      };
    },
  },
};

export default AuthModel;
