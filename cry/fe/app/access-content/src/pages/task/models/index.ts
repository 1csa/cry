import {Effect} from 'dva';
import {Reducer} from 'redux';
import {saveTaskService} from '@/services/task';

export interface TaskState {
};

export interface TaskModelType {
  namespace: string,
  state: TaskState,
  effects: {
    saveTask: Effect
    uploadXlxs: Effect
  },
  reduces: {}
}

const TaskModel: TaskModelType = {
  namespace: 'Task',
  state: {},
  effects: {
    *saveTask({payload}, {call}){
      const response = yield call(saveTaskService, payload);
      return response;
    },
    *uploadXlxs(){}
  },
  reduces:{}
}

export default TaskModel;
