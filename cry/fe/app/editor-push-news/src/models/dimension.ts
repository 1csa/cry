import { Effect } from 'dva'
import { Reducer } from 'redux'
import { getDimensionListAll } from '@/services/usersetService'

export interface DimensionModelState {
  dimensionMapList: {
    [key: string]: any
  };
}

export interface DimensionModelType {
  namespace: string,
  state: DimensionModelState,
  effects: {
    getDimensionListAll: Effect
  },
  reducers: {
    setDimensionList: Reducer<DimensionModelState>
  }
}

const DimensionModel: DimensionModelType = {
  namespace: 'dimension',
  state: {
    dimensionMapList: {},
  },
  effects: {
    *getDimensionListAll (_, { call, put }) {
      const result = yield call(getDimensionListAll)
      let dimension = {}
      if (result.header.code === 0) {
        dimension = result.data || {}
      }
      yield put({
        type: 'setDimensionList',
        payload: dimension
      })
    }
  },
  reducers: {
    setDimensionList (state, action: any) {
      const { payload: { dimensions }} = action
      let obj = {}
      dimensions.forEach((item: any) => {
        const { name, value } = item
        obj[name] = value
      })
      return {...state, dimensionMapList: obj}
    }
  }
}

export default DimensionModel
