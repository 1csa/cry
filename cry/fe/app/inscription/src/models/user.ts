import { queryAuth } from '@/services/common';
import { getCookie } from '@/utils';
import { Model, UserModelState } from '@/types/connect';

const initialState: UserModelState = {
  uid: '',
  email: '',
  username: '',
  authes: [],
  status: 'UN_CHECK',
};

interface UserModel extends Model<UserModelState> {
  namespace: 'user';
}

const UserModel: UserModel = {
  namespace: 'user',
  state: initialState,

  effects: {
    *authority(action, { put, call }) {
      if (!getCookie('YD_PANDORA_JWT_TOKEN')) {
        yield put({
          type: 'login_error',
        });
        return;
      }

      try {
        const mode = action.payload.mode;
        const authRes = yield call(queryAuth, mode);

        if (authRes && authRes.status === 'success') {
          const { user, authes } = authRes.data;

          yield put({
            type: 'auth_success',
            payload: { user, authes },
          });
        } else {
          yield put({ type: 'auth_error' });
          throw new Error(JSON.stringify(authRes));
        }
      } catch (err) {
        console.log(`action: user/authority; ${err.toString()}`);
      }
    },
  },

  // 大概是石乐至的代码
  reducers: {
    toggle_mode(state = initialState, action) {
      const { check } = action.payload;
      return { ...state, debugMode: check ? "dev" : "prod" };
    },
    login_error(state = initialState) {
      return { ...state, status: 'UN_LOGIN' };
    },
    auth_success(state = initialState, action) {
      const { user, authes = [] } = action.payload;
      const { email, id: uid, name: username } = user;

      return { ...state, email, username, uid, authes, status: 'AUTH' };
    },
    auth_error(state = initialState) {
      return { ...state, status: 'UN_AUTH' };
    },
  },
};

export default UserModel;
