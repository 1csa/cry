import {
  getList, getStrat, postStrat, stopStrat, reuseStrat, getFbList, postFeedback, deleteFeedback,
  deleteStrat, fetchStratOption, fetchFbOption, fetchFbItem
} from '@/services/strategy';
import { StratModelState, Model } from "@/types/connect";

const InitialStrategy: StratModelState = {
  stratList: [],
  feedbackList: [],
  stratTotal: 0,
  feedbackTotal: 0,
  stratOption: [],
  fbOption: []
}

interface StratModel extends Model<StratModelState> {
  namespace: "strategy";
}

// TODO effect中可以考虑将所有effect中的请求函数封装为同一个
const StratModel: StratModel = {
  namespace: "strategy",
  state: InitialStrategy,
  effects: {
    fetchstratlist: function* (action, { call, put }) {
      const { query, mode } = action.payload;
      try {
        const listRes = yield call(getList, query, mode);

        if (listRes.status === "success") {
          const { list, total } = listRes.data;

          yield put({
            type: "updatelist",
            payload: { list, total }
          });
          if (action.callback) {
            yield call(action.callback);
          };
        } else {
          throw new Error(listRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchstrat: function* (action, { call, put }) {
      const { id, mode } = action.payload;

      try {
        const fetchRes = yield call(getStrat, id, mode);

        if (fetchRes.status == "success") {
          yield put({
            type: "updatestrat",
            payload: { strat: fetchRes.data }
          });
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    poststrat: function* (action, { call, put }) {
      const { data, mode, isnew } = action.payload;

      try {
        const postRes = yield call(postStrat, data, { isnew }, mode);

        if (postRes.status === "success") {
          yield put({
            type: "updatestrat",
            payload: { strat: { ...data, strat_id: postRes.data } }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(postRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    copystrat: function* (action, { call, put }) {
      const { id, mode } = action.payload;

      try {
        const fetchRes = yield call(getStrat, id, mode);

        if (fetchRes.status === "success") {
          yield put({
            type: "updatestrat",
            payload: { strat: { ...fetchRes.data, strat_id: undefined } }
          });
          if (action.callback) {
            yield call(action.callback)
          }
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    deletestrat: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const deleteRes = yield call(deleteStrat, id, mode);
        if (deleteRes.status === "success") {
          yield put({
            type: "fetchstratlist",
            payload: { query: listQuery, mode }
          });
          yield put({
            type: "common/message",
            payload: { type: "success", message: `策略 ${id} 已删除` }
          });
        } else {
          throw new Error(deleteRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        })
      }
    },

    stopstrat: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const stopRes = yield call(stopStrat, id, mode);
        if (stopRes.status === "success") {
          yield [
            put({
              type: "fetchstratlist",
              payload: { query: listQuery, mode }
            }),
            put({
              type: "common/message",
              payload: { message: `策略 ${id} 已停用 `, type: "success" }
            })
          ];
        } else {
          throw new Error(stopRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    reusestrat: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const reuseRes = yield call(reuseStrat, id, mode);

        if (reuseRes.status === "success") {
          yield [
            put({
              type: "fetchstratlist",
              payload: { query: listQuery, mode }
            }),
            put({
              type: "common/message",
              payload: { message: `策略 ${id} 已启用`, type: "success" }
            })
          ];
        } else {
          throw new Error(reuseRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchstratoption: function* (action, { put, call }) {
      const { inputId, mode } = action.payload;

      try {
        const fetchRes = yield call(fetchStratOption, inputId, mode);

        if (fetchRes.status === "success") {
          yield put({
            type: "updateStratOption",
            payload: { option: fetchRes.data.map(({ value, label }) => ({ label, value: value + '' })) }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchfblist: function* (action, { call, put }) {
      const { query, mode } = action.payload;
      try {
        const listRes = yield call(getFbList, query, mode);
        if (listRes.status === "success") {
          yield put({
            type: "updatefblist",
            payload: listRes.data
          })
        } else {
          throw new Error(listRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchfbitem: function* (action, { call, put }) {
      const { fb_id, mode } = action.payload;

      try {
        const fetchRes = yield call(fetchFbItem, fb_id, mode);
        if (fetchRes.status === "success") {
          yield put({
            type: "updateFeedback",
            payload: { feedback: fetchRes.data }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    postfeedback: function* (action, { put, call }) {
      const { feedback, mode, isnew, listQuery } = action.payload;

      try {
        const post_res = yield call(postFeedback, feedback, isnew, mode);
        if (post_res.status === "success") {
          yield [
            put({
              type: "common/message",
              payload: { message: "创建负反馈策略成功", type: "success" }
            }),
            put({
              type: "fetchfblist",
              payload: { query: listQuery, mode }
            })
          ];
        } else {
          throw new Error(post_res.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    deletefeedback: function* (action, { put, call }) {
      const { feedback_id, mode, query } = action.payload;

      try {
        const delete_res = yield call(deleteFeedback, feedback_id, mode);
        if (delete_res.status === "success") {
          yield [
            put({ type: 'fetchfblist', payload: { query, mode } }),
            put({ type: "common/message", payload: { message: "删除成功", type: "success" } })
          ];
        } else {
          throw new Error(delete_res.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchfboption: function* (action, { put, call }) {
      const { fb_name, mode } = action.payload;

      try {
        const fetchRes = yield call(fetchFbOption, fb_name, mode);

        if (fetchRes.status === "success") {
          yield put({ type: "updateFbOption", payload: { option: fetchRes.data } });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

  },
  reducers: {
    updatelist: function (state = InitialStrategy, action) {
      const { list, total } = action.payload;
      return { ...state, stratList: list, stratTotal: total };
    },
    updatestrat: function (state = InitialStrategy, action) {
      return { ...state, strategy: action.payload.strat };
    },
    updatefblist: function (state = InitialStrategy, action) {
      const { list, total } = action.payload;
      return { ...state, feedbackList: list, feedbackTotal: total }
    },
    updateStratOption: function (state = InitialStrategy, action) {
      return { ...state, stratOption: action.payload.option };
    },
    updateFbOption: function (state = InitialStrategy, action) {
      return { ...state, fbOption: action.payload.option }
    },
    updateFeedback: function (state = InitialStrategy, action) {
      return { ...state, feedback: action.payload.feedback };
    }
  }
}

export default StratModel;


