import {Effect} from 'dva';
import {Reducer} from 'redux';
import { getTasksService, setTaskStatusService, getChildTasksService, fecthDocsService } from '@/services/task';

export interface TaskListState {
};

export interface TaskListModelType {
  namespace: string,
  state: TaskListState,
  effects: {
    searchTask: Effect,
    setTaskStatus: Effect,
    searchChildTask: Effect,
    fecthDocs: Effect
  },
  reduces: {}
}

const TaskListModel: TaskListModelType = {
  namespace: 'TaskList',
  state: {},
  effects: {
    // 获取主任务
    *searchTask({payload}, {call}) {
      const response = yield call(getTasksService, payload);
      return response;
    },
    *setTaskStatus({payload}, {call}) {
      const response = yield call(setTaskStatusService, payload);
      return response;
    },
    *searchChildTask({payload}, {call}){
      const response = yield call(getChildTasksService, payload);
      return response;
    },
    *fecthDocs({payload}, {call}){
      const response = yield call(fecthDocsService, payload);
      return response;
    }
  },
  reduces:{}
}

export default TaskListModel;
