import { Dispatch, Callback } from '@/models/connect'

export default {
  getChannelAuthByUserid: (dispatch: Dispatch) => (data?: any, success?: Callback, fail?: Callback) => {
    dispatch({
      type: 'auth/getChannelAuthByUserid',
      payload: { data, success, fail }
    })
  }
}