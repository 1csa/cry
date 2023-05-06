import { Effect } from 'dva'
import { Reducer } from 'redux'
import { getChannelAuth } from '@/services/auth.service'

export interface AuthModelState {
  auth: Array<number>
}

export interface AuthModeType {
  namespace: string
  state: AuthModelState
  reducers: {
    updateAuth: Reducer<AuthModelState>
  },
  effects: {
    getChannelAuthByUserid: Effect
  }
}

const AuthModel: AuthModeType = {
  namespace: 'auth',
  state: {
    auth: []
  },
  reducers: {
    updateAuth (state, action: any) {
      const { payload: { auth } } = action
      return { ...state, auth }
    }
  },
  effects: {
    *getChannelAuthByUserid ({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload
      const { status, data, reason } = yield call(getChannelAuth, rest)
      if (status === 'success') {
        yield put({
          type: 'updateAuth',
          payload: { auth: data }
        })
        yield success && success()
      } else {
        yield fail && fail(reason)
      }
    }
  }
} 

export default AuthModel