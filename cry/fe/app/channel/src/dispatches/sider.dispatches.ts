import { Dispatch, Callback } from '@/models/connect'
import { FavsProps } from '@/config/sider'

export default {
  searchChannelEdit: (dispatch: Dispatch) => (keyword: string, success?: Callback, fail?: Callback) => {
    dispatch({
      type: 'sider/searchChannelEdit',
      payload: { keyword, success, fail }
    })
  },

  searchChannelAll: (dispatch: Dispatch) => (keyword: string, success?: Callback, fail?: Callback) => {
    dispatch({
      type: 'sider/searchChannelAll',
      payload: { keyword, success, fail }
    })
  },

  getFavsByUserid: (dispatch: Dispatch) => (data?: any, success?: Callback, fail?: Callback) => {
    dispatch({
      type: 'sider/getFavsByUserid',
      payload: { ...data, success, fail }
    })
  },

  updateFavsByUserid: (dispatch: Dispatch) => (favs: Array<FavsProps>, success?: Callback, fail?: Callback) => {
    dispatch({
      type: 'sider/updateFavsByUserid',
      payload: { favs, success, fail }
    })
  }
}