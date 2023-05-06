
// import { Model, UserModelState } from '@/types/connect';
import { getDeviceType, getStrategyType, getSceneType,
  getErrorCode, getFeatures, getSymbol, getActiveName } from '@/services/global'

const initialState = {
  deviceType: [], // 试用端: 一点、身边、生活圈等
  strategyType: [], // 策略类型: 设备异常、行为异常、频度异常、时序异常等
  sceneType: [], // 场景类型: 基础功能、活动交易、反爬虫等
  errorCode: [], // 返回值 
  featuresList: [], // 表达式的用户特征
  symbolList: [], // 表达式的符号选择
  activeNameList: [], // 活动列表
};

// interface UserModel extends Model<UserModelState> {
//   namespace: 'user';
// }

const GlobalData = {
  namespace: 'global',
  state: initialState,

  effects: {
    *handleDeviceType(action, { put, call }) {
      try{
        const res = yield call(getDeviceType);
        if (res.status === 200) {
          yield put({
            type: 'setDeviceType',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleStrategyType(action, { put, call }) {
      try{
        const res = yield call(getStrategyType);
        if (res.status === 200) {
          yield put({
            type: 'setStrategyType',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleSceneType(action, { put, call }) {
      try{
        const res = yield call(getSceneType);
        if (res.status === 200) {
          yield put({
            type: 'setSceneType',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleErrorCodeType(action, { put, call }) {
      try{
        const res = yield call(getErrorCode);
        if (res.status === 200) {
          yield put({
            type: 'setErrorCode',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleGetFeatures(action, { put, call }) {
      try{
        const res = yield call(getFeatures);
        if (res.status === 200) {
          yield put({
            type: 'setFeaturesList',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleGetSymbol(action, { put, call }) {
      try{
        const res = yield call(getSymbol);
        if (res.status === 200) {
          yield put({
            type: 'setSymbolList',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
    *handleGetActiveName(action, { put, call }) {
      try{
        const res = yield call(getActiveName);
        if (res.status === 200) {
          yield put({
            type: 'setActiveName',
            payload: {data: res.data.data},
          });
        }
      } catch (err) {
        console.log(err)
      }
    },
  },

  reducers: {
    setDeviceType(state, action) {
      const { data } = action.payload;
      return { ...state, deviceType: data};
    },
    setStrategyType(state, action) {
      const { data } = action.payload;
      return { ...state, strategyType: data};
    },
    setSceneType(state, action) {
      const { data } = action.payload;
      return { ...state, sceneType: data};
    },
    setErrorCode(state, action) {
      const { data } = action.payload;
      return { ...state, errorCode: data};
    },
    setFeaturesList(state, action) {
      const { data } = action.payload;
      return { ...state, featuresList: data};
    },
    setSymbolList(state, action) {
      const { data } = action.payload;
      return { ...state, symbolList: data};
    },
    setActiveName(state, action) {
      const { data } = action.payload;
      return { ...state, activeNameList: data};
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'handleDeviceType', payload: {} })
      dispatch({ type: 'handleStrategyType', payload: {} })
      dispatch({ type: 'handleSceneType', payload: {} })
      dispatch({ type: 'handleErrorCodeType', payload: {} })
      dispatch({ type: 'handleGetFeatures', payload: {} })
      dispatch({ type: 'handleGetSymbol', payload: {} })
      dispatch({ type: 'handleGetActiveName', payload: {} })
    }
  }
};

export default GlobalData;
