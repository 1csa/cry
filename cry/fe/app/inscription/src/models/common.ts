/**
 * 主要是为了将所有的error信息提到外层组件来处理
*/

import { Model, CommonModelState } from '@/types/connect';

interface ErrorModel extends Model<CommonModelState> {
  namespace: 'common';
}

const ErrorModel: ErrorModel = {
  namespace: "common",
  state: {},
  effects: {},
  reducers: {
    message: function (state, action) {
      const { type, message } = action.payload;
      return { ...state, message: { type, message } };
    },
    resetmes: function (state, action) {
      return { ...state, message: undefined };
    }
  }
}

export default ErrorModel;
