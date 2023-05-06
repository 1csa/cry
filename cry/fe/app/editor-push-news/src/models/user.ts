import { Effect } from 'dva';
import { Reducer } from 'redux';

import { EditorAuthes } from "@/config/account/account";
import { queryCurrent } from '@/services/user';

export interface CurrentUser {
  isAuthing?: boolean;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  authes?: EditorAuthes;
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
