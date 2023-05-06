import { Effect } from 'dva'
import { Reducer } from 'redux'
import { getPushtypeEnum } from '@/services/pushtypeService'

export interface PushtypeModelState {
  pushtypeEnum: {
    [key: string]: any
  }
}

export interface PushtypeModelType {
  namespace: string
  state: PushtypeModelState
  effects: {
    getPushtypeEnum: Effect
  }
  reducers: {
    setPushtypeEnum: Reducer<PushtypeModelState>
  }
}

const PushtypeModel: PushtypeModelType = {
  namespace: 'pushtypeEnum',
  state: {
    pushtypeEnum: {}
  },
  effects: {
    *getPushtypeEnum (_, { call, put }) {
      const res = yield call(getPushtypeEnum)
      yield put({
        type: 'setPushtypeEnum',
        payload: res.data.data
      })
    }
  },
  reducers: {
    setPushtypeEnum (state, action: any) {
      const { payload } = action
      return {...state, pushtypeEnum: payload}
    }
  }
}

export default PushtypeModel
