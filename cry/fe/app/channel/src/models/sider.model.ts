import { Effect } from 'dva'
import { Reducer } from 'redux'
import { Dispatch } from '@/models/connect'
import { searchChannelEdit, searchChannelAll, getFavsByUserid, updateFavsByUserid } from '@/services/sider.service'
import { ChannelEditProps, ChannelAllProps, FavsProps } from '@/config/sider'

export interface SiderModelState {
  channelEdit: Array<ChannelEditProps>
  channelAll: Array<ChannelAllProps>
  favs: Array<FavsProps>
}

export interface SiderModeType {
  namespace: string
  state: SiderModelState
  reducers: {
    updateSearchResult: Reducer<SiderModelState>
    updateFavs: Reducer<SiderModelState>
  },
  effects: {
    searchChannelEdit: Effect
    searchChannelAll: Effect
    getFavsByUserid: Effect
    updateFavsByUserid: Effect
  }
}

const SiderModel: SiderModeType = {
  namespace: 'sider',
  state: {
    channelEdit: [],
    channelAll: [],
    favs: []
  },
  reducers: {
    updateSearchResult (state, action: any) {
      const { payload } = action
      return { ...state, ...payload }
    },

    updateFavs (state, action: any) {
      const { payload: { favs } } = action
      return { ...state, favs }
    }
  },
  effects: {
    *searchChannelEdit ({ payload = {} }, { call, put, select }) {
      const { success, fail, ...rest } = payload
      let { status, data, reason } = yield call(searchChannelEdit, rest)
      const auth = yield select((state: any) => state.auth.auth); //权限过滤

      if (!auth.includes(135)) {
        data = data.filter((item: Record<string, any>) => item._id !== 'homepage')
      }
      if (!auth.includes(136)) {
        data = data.filter((item: Record<string, any>) => item._id !== 'promotion')
      }
      if (!auth.includes(137)) {
        data = data.filter((item: Record<string, any>) => item._id !== 'hot')
      }
      if (!auth.includes(214)) {
        data = data.filter((item: Record<string, any>) => item._id !== '19thBig')
      }
      if (!auth.includes(272)) {
        data = data.filter((item: Record<string, any>) => item._id !== 'hotpolitic')
      }

      if (status === 'success') {
        yield put({
          type: 'updateSearchResult',
          payload: { channelEdit: data }
        })
        yield success && success()
      } else {
        yield fail && fail(reason)
      }
    },

    *searchChannelAll({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload
      const { status, data, reason } = yield call(searchChannelAll, rest)
      if (status === 'success') {
        yield put({
          type: 'updateSearchResult',
          payload: { channelAll: data }
        })
        yield success && success()
      } else {
        yield fail && fail(reason)
      }
    },

    *getFavsByUserid ({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload
      const { status, data, reason } = yield call(getFavsByUserid, rest)
      if (status === 'success') {
        yield put({
          type: 'updateFavs',
          payload: { favs: data }
        })
        yield success && success()
      } else {
        yield fail && fail(reason)
      }
    },

    *updateFavsByUserid ({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload
      // console.log(rest)
      const { status, data, reason } = yield call(updateFavsByUserid, rest)
      if (status === 'success') {
        yield put({
          type: 'updateFavs',
          payload: { favs: rest.favs }
        })
        yield success && success()
      } else {
        yield fail && fail(reason)
      }
    }
  }
} 

export default SiderModel