import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import handleStatisticsRequest from 'scan-statistics';

import { message } from 'antd';

// @ts-ignore
import { version } from '../../package.json';
import { getEnv, getCookie } from '@/utils/dev_helper';
import { category } from '@/services/featureContent';
import { fetchDropDownList, fetchCount, fetchReviewTaskList, fetchNewDropDownList, fetchAdminMenu } from '@/services/commonServices';

export type Counts = {
  stts_count_audit?: number | undefined;
  stt_audited_curauditor_curday?: number;
  clsexp?:
    | Array<{
        id: number;
        count: number;
      }>
    | undefined;
};

export interface CommonLogicState {
  category?: object;
  ddlData?: object;
  businessFormItemCascaderddl?: Array<any>;
  ddlCounts?: Counts;
  globalAuditTask?: object;
  globalAdminMenu?: object;
}

export interface CommonLogicModelType {
  namespace: 'commonLogic';
  state: CommonLogicState;
  effects: {
    fetchCategory: Effect;
    fetchddl: Effect;
    fetchBusinessFormItemCascaderDropDownList: Effect;
    fetchddlCount: Effect;
    fetchGlobalAuditTask: Effect;
    fetchGlobalAdminMenu: Effect;
  };
  reducers: {
    saveCategory: Reducer<CommonLogicState>;
    saveDDl: Reducer<CommonLogicState>;
    saveBusinessFormItemCascaderDropDownList: Reducer<CommonLogicState>;
    saveddlCount: Reducer<CommonLogicState>;
    saveGlobalAuditTask: Reducer<CommonLogicState>;
    saveGlobalAdminMenu: Reducer<CommonLogicState>;
  };
  subscriptions?: {
    [key: string]: Subscription;
  };
}

const CommonLogicModel: CommonLogicModelType = {
  namespace: 'commonLogic',
  state: {
    category: {},
    ddlData: {},
    ddlCounts: {},
    globalAuditTask: {},
    businessFormItemCascaderddl: [],
    globalAdminMenu: [],
  },
  effects: {
    *fetchCategory(_, { call, put }) {
      const res = yield call(category);
      yield put({
        type: 'saveCategory',
        payload: res,
      });
      return res;
    },
    *fetchddl(_, { call, put }) {
      const { errorno, data } = yield call(fetchDropDownList);
      if (errorno === 0) {
        yield put({
          type: 'saveDDl',
          payload: data,
        });
      }
      return data;
    },
    *fetchBusinessFormItemCascaderDropDownList({ payload }, { call, put }) {
      const { errorno, data } = yield call(fetchNewDropDownList, payload);
      if (errorno === 0) {
        yield put({
          type: 'saveBusinessFormItemCascaderDropDownList',
          payload: data,
        });
      }
      return data;
    },
    *fetchddlCount({ payload }, { call, put }) {
      const { errorno, data } = yield call(fetchCount, payload);
      if (errorno === 0) {
        yield put({
          type: 'saveddlCount',
          payload: data,
        });
      }
      return data;
    },
    *fetchGlobalAuditTask({ payload }, { call, put }) {
      if (payload.isEmpty) {
        yield put({
          type: 'saveGlobalAuditTask',
          payload: {},
        });
        return {};
      } else {
        const response = yield call(fetchReviewTaskList, payload);
        yield put({
          type: 'saveGlobalAuditTask',
          payload: {
            [payload.data_ids[0]]: response.data,
          },
        });
        return response;
      }
    },
    *fetchGlobalAdminMenu({ payload }, { call, put }) {
      const response = yield call(fetchAdminMenu, payload) || { errorno: -1, desc: '错误！', data: [] };
      const { errorno, desc, data, messasge } = response;

      // // 审核菜单
      // 1.用户资料审核： contentReview
      // 2.图文安全审核：pictureArticleReview
      // 3.视频安全审核：videoReview
      // 4.短文本安全审核：shortContent
      // 5. 私信审核： privateMessage
      // 6. 认证审核：studentCard
      // 7.图文分类标注：imageClassification
      // 8.视频分类标注：videoClassification
      // 9.图文质量标注: imageQuality
      // 10.视频质量标注: videoQuality
      // // 系统管理员菜单
      // 1.特征内容： featureContent
      // 2.数据统计：dataStatistics
      // 3.业务配置:businessConfiguration
      // 4.系统管理: systemManagement

      if (errorno === 0) {
        yield put({
          type: 'saveGlobalAdminMenu',
          payload: data,
        });
      } else {
        message.error(desc || message);
        yield put({
          type: 'saveGlobalAdminMenu',
          payload: [],
        });
      }
    },
  },
  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        category: action.payload || {},
      };
    },
    saveDDl(state, action) {
      return {
        ...state,
        ddlData: action.payload || {},
      };
    },
    saveBusinessFormItemCascaderDropDownList(state, action) {
      return {
        ...state,
        businessFormItemCascaderddl: action.payload || {},
      };
    },
    saveddlCount(state, action) {
      return {
        ...state,
        ddlCounts: action.payload || {},
      };
    },
    saveGlobalAuditTask(state, action) {
      return {
        ...state,
        globalAuditTask: action.payload || {},
      };
    },
    saveGlobalAdminMenu(state, action) {
      return {
        ...state,
        globalAdminMenu: action.payload || [],
      };
    },
  },

  subscriptions: {
    // xxxKey({ history, dispatch }, done) {
    //   done('error');// 手动错误上报到 dva 会被 onError 监听到
    // },
    routerChangeListener({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({ pathname }) => {
        // if (pathname === '/') {
        //   dispatch({ type: 'load' });
        // }

        const env = getEnv();
        const logInfo = {
          email: decodeURIComponent(getCookie('username')),
          userName: `${decodeURIComponent(getCookie('nickname'))}(${+getCookie('userid')})(V${version})`,
          browserUrl: window.location.href,
          env,
          platform: 'zeus/audit-system',
        };
        // 本地开发 不需要上报信息
        if (env !== 'dev') {
          handleStatisticsRequest(logInfo, 'http://10.126.155.163:1151/scanStatic/addScanInfo');
        }
      });
    },
  },
};

export default CommonLogicModel;
