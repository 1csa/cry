import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, fetchAuthService } from '@/services/user';

export interface CurrentUser {
  isAuthing?: boolean;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  permission: any
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    fetchAuth: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<any>;
    saveAuth: Reducer<any>
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {
      isAuthing: true,
    },
    permission: []
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...response.user,
          isAuthing: false,
        },
      });
      return response;
    },
    *fetchAuth(_, {call, put}){ // 获取add 权限
      const {status, result} = yield call(fetchAuthService);
      if(status === 'success'){
        yield put({
          type: 'saveAuth',
          payload: result
        });
      }
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveAuth(state, action){
      return {
        ...state,
        permission: action.payload || [],
      };
    }
  },
};

export default UserModel;
