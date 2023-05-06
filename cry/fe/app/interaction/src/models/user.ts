import { Effect } from 'dva';
import { Reducer } from 'redux';
import getUserId from '../utils/get_userid';

import { queryCurrent } from '@/services/user';

export interface CurrentUser {
  isAuthing?: boolean;
  name?: string;
  email?: string;
  avatar?: string;
  userId: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {
      isAuthing: true,
      userId: ''
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...response.user,
          isAuthing: false,
          userId: getUserId()
        },
      });
      return response;
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
