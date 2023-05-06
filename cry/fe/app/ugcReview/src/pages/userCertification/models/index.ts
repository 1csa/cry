import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getUserCert, setUserCert, getCityList, getCategories } from '../services';

export interface UserCertificationState {
  result: any[];
  total: number;
  offset: number;
  count: number;
  cityList: any[];
  categoriesList: string[];
}

export interface IUserCertification {
  namespace: 'certification';
  state: UserCertificationState;
  effects: {
    getUserCert: Effect;
    setUserCert: Effect;
    getCityList: Effect;
    getCategories: Effect;
  };
  reducers: {
    setData: Reducer;
  };
}

const userCertification: IUserCertification = {
  namespace: 'certification',
  state: {
    result: [],
    total: 0,
    offset: 0,
    count: 50,
    cityList: [],
    categoriesList: [],
  },
  effects: {
    *getUserCert({ type, payload }, { call, put }) {
      const response = yield call(getUserCert, payload);
      // 返回的数据交给reducers处理
      yield put({
        type: 'setData',
        payload: {
          result: response.result,
          total: response.total,
          offset: 0,
          count: 50,
        },
      });
      return response;
    },
    *setUserCert({ type, payload }, { call, put }) {
      const response = yield call(setUserCert, payload);
      yield put({
        type: 'setData',
        payload: {},
      });
      return response;
    },
    *getCityList({ type, payload }, { call, put }) {
      const response = yield call(getCityList, payload);
      yield put({
        type: 'setData',
        payload: {
          cityList: response.result,
        },
      });
      return response;
    },
    *getCategories({ type, payload }, { call, put }) {
      const response = yield call(getCategories, payload);
      yield put({
        type: 'setData',
        payload: {
          categoriesList: response.result,
        },
      });
      return response;
    },
  },
  reducers: {
    setData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default userCertification;
