/**
 * 这里存储其他统计类型的信息，包括历史、首页统计信息
*/

import { getHistoryList } from '@/services/common';
import { OtherModelState, Model } from "@/types/connect";

const InitialOtherState: OtherModelState = {
  historyList: [],
  historyTotal: 0,
}

interface OtherModel extends Model<OtherModelState> {
  namespace: "other";
}

const OtherModel: OtherModel = {
  namespace: "other",
  state: InitialOtherState,
  effects: {
    fetchhistory: function* (action, { call, put }) {
      const { query, mode } = action.payload;

      try {
        const listRes = yield call(getHistoryList, query, mode);

        if (listRes.status === "success") {
          const { list, total } = listRes.data;
          yield put({
            type: "updatehistory",
            payload: { list, total }
          })
        } else {
          throw new Error(listRes.message)
        }
      } catch (err) {
        console.log(err.message, '====error when get history list======');
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.message }
        })
      }
    }
  },
  reducers: {
    updatehistory: function (state = InitialOtherState, action) {
      const { list, total } = action.payload;

      return { ...state, historyList: list, historyTotal: total };
    }
  }
}

export default OtherModel;

