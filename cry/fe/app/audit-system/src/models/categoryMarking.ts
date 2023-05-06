import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getAllCategoryList, getSubcategoryList, queryLabels, fetchNianHuaCategoryList } from '@/services/classificationLabels';
import { OnlyStringSelectOptionsType } from '@/types';
import { ITagsTypes } from '@/utils/pySegSort';

export interface IlabelGroupDimensionVos {
  name: string;
  labels: ITagsTypes[];
  selected?: OnlyStringSelectOptionsType[];
}

export interface ILabelGroup {
  labelGroupDimensionVos: IlabelGroupDimensionVos[];
  semantics: string;
  index?: number;
  sort?: number;
}

export interface MainLabel {
  level: number;
  label: string;
  value: string;
}

export interface ICategoryMarkingState {
  allCategoryList?: MainLabel[];
  nianHuaCategoryList?: Omit<MainLabel, 'level'>[];
  subcategoryMap?: {
    [K: string]: MainLabel[];
  };
  labelsMap?: {
    [K: string]: ILabelGroup[];
  };
}

export interface categoryMarkingModelType {
  namespace: 'categoryMarking';
  state: ICategoryMarkingState;
  effects: {
    fetchAllCategoryList: Effect;
    fetchSubcategoryList: Effect;
    fetchLabels: Effect;
    fetchNianHuaCategoryList: Effect;
  };
  reducers: {
    saveAllCategory: Reducer<ICategoryMarkingState>;
    saveSubcategory: Reducer<ICategoryMarkingState>;
    saveLabels: Reducer<ICategoryMarkingState>;
    saveNianHuaCategory: Reducer<ICategoryMarkingState>;
  };
}

const categoryMarking: categoryMarkingModelType = {
  namespace: 'categoryMarking',
  state: {
    allCategoryList: [],
    subcategoryMap: {},
    labelsMap: {},
  },
  effects: {
    *fetchAllCategoryList(_, { call, put }) {
      const { errorno, data } = yield call(getAllCategoryList);
      if (errorno === 0) {
        const result = Array.isArray(data)
          ? data.map((item: any) => ({
              label: item.label,
              value: item.label,
              level: item.level,
            }))
          : [];
        // console.log('----', data, result);
        yield put({
          type: 'saveAllCategory',
          payload: result,
        });
        return result;
      } else {
        yield put({
          type: 'saveAllCategory',
          payload: [],
        });
        return [];
      }
    },
    *fetchSubcategoryList({ payload }, { call, put }) {
      const { errorno, data } = yield call(getSubcategoryList, payload);
      if (errorno === 0) {
        yield put({
          type: 'saveSubcategory',
          payload: {
            [payload.code]: data,
          },
        });
        return {
          [payload.code]: data,
        };
      } else {
        yield put({
          type: 'saveSubcategory',
          payload: {},
        });
        return {};
      }
    },
    *fetchLabels({ payload }, { call, put }) {
      // const { errorno, result, data, code } = yield call(fetchMarking, payload);
      const { errorno, data } = yield call(queryLabels, payload);
      // console.log('payload', payload, result);

      if (errorno === 0) {
        yield put({
          type: 'saveLabels',
          payload: {
            [payload.code]: data,
          },
        });
        return {
          [payload.code]: data,
        };
      } else {
        yield put({
          type: 'saveLabels',
          payload: {},
        });
        return {};
      }
    },
    *fetchNianHuaCategoryList(_, { call, put }) {
      const { errorno, data } = yield call(fetchNianHuaCategoryList);
      if (errorno === 0) {
        const result = Array.isArray(data)
          ? data.map((item: any) => ({
              label: item,
              value: item,
            }))
          : [];
        yield put({
          type: 'saveNianHuaCategory',
          payload: result,
        });
        return result;
      } else {
        yield put({
          type: 'saveNianHuaCategory',
          payload: [],
        });
        return [];
      }
    },
  },
  reducers: {
    saveAllCategory(state, action) {
      return {
        ...state,
        allCategoryList: action.payload || {},
      };
    },
    saveSubcategory(state, action) {
      const newSubMap = Object.assign({}, state?.subcategoryMap, action.payload);

      return {
        ...state,
        subcategoryMap:
          {
            ...newSubMap,
          } || {},
      };
    },
    saveLabels(state, action) {
      const newLabelsMap = Object.assign({}, state?.labelsMap, action.payload);

      return {
        ...state,
        labelsMap:
          {
            ...newLabelsMap,
          } || {},
      };
    },
    saveNianHuaCategory(state, action) {
      return {
        ...state,
        nianHuaCategoryList: action.payload || [],
      };
    },
  },
};

export default categoryMarking;
