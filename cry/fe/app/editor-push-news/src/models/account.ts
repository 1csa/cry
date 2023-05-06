import { message } from 'antd';
import { Effect } from 'dva'
import { Reducer } from 'redux'

import { EditorAuthes, TempType, AccountInfo } from "@/config/account/account";
import { InitialUserAuth } from "@/config/account/account.config";
import { getAccountEnum, getPushAuth, getPushTemps, getCates, getTags, getToolAuth } from '@/services/accountService'

// 按理讲cates和tags的收藏以及templist都应该在前端数据，历史原因，分开处理
export interface AccountModelState {
  accountEnum: {
    [key: string]: any
  },
  accountEditorAuth: EditorAuthes,
  accountToolAuth: number[],
  templist: Array<TempType>,
  cates: string[],
  toolauthes: Record<string, string>;
  userinfo: AccountInfo;
}

export interface AccountModelType {
  namespace: string
  state: AccountModelState
  effects: Record<string, Effect>;
  reducers: Record<string, Reducer<AccountModelState>>
}

const InitialAccountState: AccountModelState = {
  accountEnum: {},
  accountEditorAuth: InitialUserAuth,
  accountToolAuth: [],
  templist: [],
  cates: [],
  toolauthes: {},
  userinfo: {}
}

const AccountModel: AccountModelType = {
  namespace: 'accountEnum',
  state: InitialAccountState,
  effects: {
    *getAccountEnum(_, { call, put }) {
      const res = yield call(getAccountEnum)
      yield put({
        type: 'setAccountEnum',
        payload: res.data
      })
    },

    getToolAuth: function* (action, { call, put }) {
      try {
        const toolRes = yield call(getToolAuth);
        if (toolRes.status === "success") {
          const { user, authes, auth_map } = toolRes.result;

          yield put({
            type: "updateAccountInfo",
            payload: { infos: user }
          });
          yield put({
            type: "updateToolAuth",
            payload: { auth: authes }
          });
          yield put({
            type: "updateToolInfos",
            payload: { infos: auth_map }
          });
        } else {
          throw new Error(toolRes.message);
        }
      } catch (err) {
        message.error(`获取工具权限出错: ${err.message}`)
      }
    },

    getAccountAuth: function* (action, { call, put }) {
      try {
        const authrRes = yield call(getPushAuth);

        if (authrRes.status !== 'success') {
          throw new Error(authrRes.message);
        }

        yield put({
          type: "updatePushAuth",
          payload: { result: authrRes.result }
        });
      } catch (err) {
        console.log(err.message, 'error happened when get account auth');
        message.error(err.message);
      }
    },

    getAccountInfo: function* (action, { call, put }) {
      try {
        const cateRes = yield call(getCates);
        const tagRes = yield call(getTags);

        if (cateRes.status === "success") {
          yield put({
            type: "updateStoredCates",
            payload: { cates: cateRes.result }
          });
        } else {
          throw new Error(cateRes.message);
        }

        if (tagRes.status === "success") {
          const { channels, exclude_channels, inter_channels } = tagRes.result;
          yield put({
            type: "editorpush/updateStoredTags",
            payload: {
              tags: channels,
              extags: exclude_channels,
              interTags: inter_channels,
            }
          });
        } else {
          throw new Error(tagRes.message);
        }
      } catch (err) {
        message.error(err.message);
      }
    },

    getAccountCates: function* (action, { call, put }) {
      try {
        const cateRes = yield call(getCates);
        if (cateRes.status === "success") {
          yield put({
            type: "updateStoredCates",
            payload: { cates: cateRes.result }
          });
        } else {
          throw new Error(cateRes.message);
        }
      } catch (err) {
        message.error(err.message);
      }
    },
    getAccountTemps: function* (action, { call, put }) {
      const { biz } = action.payload;
      try {
        const tempRes = yield call(getPushTemps, biz);

        if (tempRes.status === "success") {
          yield put({
            type: "updateTemplist",
            payload: { list: tempRes.result }
          })
        } else {
          throw new Error(tempRes.message);
        }
      } catch (err) {
        console.log(err.message, 'error happened when get account auth');
        message.error(err.message);
      }
    },
  },
  reducers: {
    setAccountEnum(state = InitialAccountState, action: any) {
      return { ...state, accountEnum: action.payload };
    },
    updateAccountInfo: function (state = InitialAccountState, action) {
      return { ...state, userinfo: action.payload.infos };
    },
    updateToolAuth: function (state = InitialAccountState, action) {
      return { ...state, accountToolAuth: action.payload.auth }
    },
    updatePushAuth: function (state = InitialAccountState, action) {
      return { ...state, accountEditorAuth: action.payload.result };
    },
    updateTemplist: function (state = InitialAccountState, action) {
      return { ...state, templist: action.payload.list };
    },
    updateStoredCates: function (state = InitialAccountState, action) {
      return { ...state, cates: action.payload.cates };
    },
    updateToolInfos: function (state = InitialAccountState, action) {
      return { ...state, toolauthes: action.payload.infos }
    }
  }
}

export default AccountModel
