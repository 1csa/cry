import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getPageInit, setModalData } from '../services';

export interface ModalDataState {
  continuous_close_max_num: number;
  pop_max_num: number;
  enable_close: boolean;
  new: any;
  active: any;
}

export interface IModalDataState {
  namespace: 'modalSetting';
  state: ModalDataState;
  effects: {
    initData: Effect;
    setData: Effect;
  };
  reducers: {
    setPageData: Reducer;
  };
}

const modalSetting: IModalDataState = {
  namespace: 'modalSetting',
  state: {
    continuous_close_max_num: 0,
    pop_max_num: 1,
    enable_close: true,
    new: {},
    active: {},
  },
  effects: {
    *initData({ type, payload }, { call, put }) {
      const response = yield call(getPageInit, payload);
      yield put({
        type: 'setPageData',
        payload: response.result,
      });
      return response;
    },
    *setData({ type, payload }, { call, put }) {
      const response = yield call(setModalData, payload);
      yield put({
        type: 'setPageData',
        payload: response.result,
      });
      return response;
    },
  },
  reducers: {
    setPageData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default modalSetting;
