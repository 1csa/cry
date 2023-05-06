import { getList, getLaunch, postLaunch, stopLaunch, fetchOption } from '@/services/launch';
import { LaunchModelState, Model } from "@/types/connect";

const InitialLaunch: LaunchModelState = {
  launchList: [],
  launchTotal: 0,
}

interface LaunchModel extends Model<LaunchModelState> {
  namespace: "launch";
}

const LaunchModel: LaunchModel = {
  namespace: "launch",
  state: InitialLaunch,
  effects: {
    fetchlist: function* (action, { call, put }) {
      const { query, mode } = action.payload;

      try {
        const listRes = yield call(getList, query, mode);

        if (listRes.status === "success") {
          const { list, total } = listRes.data;

          yield put({
            type: 'updatelist',
            payload: { list, total }
          })

          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(listRes.message)
        }
      } catch (err) {
        console.log(err.toString(), '=====error when fetch launch list========')
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchlaunch: function* (action, { call, put }) {
      const { id, mode } = action.payload;

      try {
        const fetchRes = yield call(getLaunch, id, mode);
        if (fetchRes.status === "success") {
          yield put({
            type: "updatelaunch",
            payload: { launch: fetchRes.data }
          })
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

    postlaunch: function* (action, { call, put }) {
      const { data, isnew, mode } = action.payload;

      console.log(data, isnew, mode);

      try {
        const postRes = yield call(postLaunch, data, isnew, mode);

        if (postRes.status === "success") {
          yield put({
            type: "updatelaunch",
            payload: { launch: { ...data, launch_id: postRes.data } }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(postRes.message);
        }
      } catch (err) {
        console.log(err.message);
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    stoplaunch: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const stopRes = yield call(stopLaunch, id, mode);
        if (stopRes.status === "success") {
          yield put({
            type: "fetchlist",
            payload: { query: listQuery, mode }
          });
          yield put({
            type: "common/message",
            payload: { message: "停止投放成功", type: "success" }
          })
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

    copylaunch: function* (action, { call, put }) {
      const { id, mode } = action.payload;

      try {
        const getRes = yield call(getLaunch, id, mode);

        if (getRes.status === "success") {
          yield put({
            type: "updatelaunch",
            payload: { launch: { ...getRes.data, launch_id: null } }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(getRes.message);
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        });
      }
    },

    fetchlaunchoption: function* (action, { call, put }) {
      const { inputId, mode } = action.payload;

      try {
        const fetchRes = yield call(fetchOption, inputId, mode);
        if (fetchRes.status === "success") {
          yield put({
            type: "updateOption",
            payload: { option: fetchRes.data }
          });
        }
      } catch (err) {
        yield put({
          type: "common/message",
          payload: { type: "error", message: err.toString() }
        })
      }
    }
  },
  reducers: {
    updatelist: function (state = InitialLaunch, action) {
      const { list, total } = action.payload;
      return { ...state, launchList: list, launchTotal: total };
    },
    updatelaunch: function (state = InitialLaunch, action) {
      return { ...state, launch: action.payload.launch };
    },
    updateOption: function (state = InitialLaunch, action) {
      return { ...state, launchOption: action.payload.option };
    }
  }
}

export default LaunchModel;


