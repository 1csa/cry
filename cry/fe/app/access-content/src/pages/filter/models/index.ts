import {Effect} from 'dva';
import {Reducer} from 'redux';

export interface FilterState {
};

export interface FilterModelType {
  namespace: string,
  state: FilterState,
  effects: {},
  reduces: {}
}

const FilterModel: FilterModelType = {
  namespace: 'Filter',
  state: {},
  effects: {},
  reduces:{}
}

export default FilterModel;
