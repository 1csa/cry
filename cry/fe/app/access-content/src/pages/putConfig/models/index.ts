import { Effect } from 'dva';
import { Reducer } from 'redux';
import { connect } from 'dva';

import {
  getTasks,
  startTask,
  stopTask,
  getSiteList,
  getContentTypes,
  createTask,
  getTaskDetail,
  getCategoryList,
  editTask,
  getExportApp
} from '@/services/putConfig';

export interface putTaskList {
  [x: string]: any;
  sourceList: string[]
};

export interface putTaskListModelType {
  namespace: string,
  state: putTaskList,
  effects: {
    getTaskList: Effect,
    startTask: Effect,
    stopTask: Effect,
    getSiteList: Effect,
    getContentTypeList: Effect,
    createTask: Effect,
    getTaskDetail: Effect,
    getCategoryList: Effect,
    editTask: Effect,
    getExportAppList: Effect
  },
  reducers: {}
}

const putTaskListModel: putTaskListModelType = {
  namespace: 'putTaskList',
  state: {
    sourceList: []
  },
  effects: {
    *getTaskList ({payload}, {call}) {
      let response = yield call(getTasks, payload);
      return response;
    },
    *startTask ({payload}, {call}) {
      let response = yield call(startTask, payload);
      return response;
    },
    *stopTask ({payload}, {call}) {
      let response = yield call(stopTask, payload);
      return response;
    },
    *getSiteList ({payload}, {call}) {
      let response = yield call(getSiteList, payload);
      return response;
    },
    *getContentTypeList ({payload}, {call}) {
      let response = yield call(getContentTypes, payload);
      return response;
    },
    *createTask ({payload}, {call}) {
      let response = yield call(createTask, payload);
      return response;
    },
    *getTaskDetail ({payload}, {call}) {
      let response = yield call(getTaskDetail, payload);
      return response;
    },
    *getCategoryList ({payload}, {call}) {
      let response = yield call(getCategoryList, payload);
      return response;
    },
    *editTask ({payload}, {call}) {
      let response = yield call(editTask, payload);
      return response;
    },
    *getExportAppList ({payload}, {call}) {
      let response = yield call(getExportApp, payload);
      return response;
    },
  },
  reducers: {}
}
export default putTaskListModel;