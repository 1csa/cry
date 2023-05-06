/**
 * 同步的一些全局状态塞进来
 */

import { Reducer } from 'redux';

export type SynchronizeState = {
  currentBreadcrumb: string;
  formModelParams: object;
  searchConditionCache?: {
    [K: string]: number;
  };
  webExcelData: Array<any>;
};

export interface SynchronizeStateType {
  namespace: 'synchronizeState';
  state: SynchronizeState;
  effects?: {};
  reducers: {
    currentBreadcrumbName: Reducer<Pick<SynchronizeState, 'currentBreadcrumb'>>;
    setFormModelParams: Reducer<Pick<SynchronizeState, 'formModelParams'>>;
    saveSearchConditionCache: Reducer<Pick<SynchronizeState, 'searchConditionCache'>>;
    saveWebExcelData: Reducer<Pick<SynchronizeState, 'webExcelData'>>;
  };
}

const SynchronizeStateModel: SynchronizeStateType = {
  namespace: 'synchronizeState',
  state: {
    currentBreadcrumb: '',
    formModelParams: {},
    searchConditionCache: {},
    webExcelData: [],
  },
  reducers: {
    currentBreadcrumbName(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setFormModelParams(state, action) {
      return {
        ...state,
        formModelParams: action.payload,
      };
    },
    saveSearchConditionCache(state, action) {
      return {
        ...state,
        searchConditionCache: action.payload || {},
      };
    },
    saveWebExcelData(state, action) {
      return {
        ...state,
        ...(action.payload || []),
      };
    },
  },
};

export default SynchronizeStateModel;
