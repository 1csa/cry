import { Effect } from 'dva';
import { Reducer } from 'redux';

import { CitiesDataType, TeamsDataType, PusherDataType } from '@/config/other';
import { queryAllTeams, queryAllCities, queryAllPusers } from '@/services/others';
import { mapOptions } from '@/utils/dev_helper';

export interface OtherModelState {
  allTeams?: TeamsDataType[];
  allCities?: CitiesDataType[];
  allPushers?: PusherDataType[];
}

export interface OtherModelType {
  namespace: 'others';
  state: OtherModelState;
  effects: {
    fetchAllTeams: Effect;
    fetchAllCities: Effect;
    fetchAllPushers: Effect;
  };
  reducers: {
    saveAllTeams: Reducer<OtherModelState>;
    updateTeams: Reducer<OtherModelState>;
    saveAllCities: Reducer<OtherModelState>;
    saveAllPushers: Reducer<OtherModelState>;
  };
}

const OtherModel: OtherModelType = {
  namespace: 'others',
  state: {
    allTeams: [],
    allCities: [],
    allPushers: [],
  },

  effects: {
    *fetchAllTeams(_, { call, put }) {
      try {
        const queryTeamRes = yield call(queryAllTeams);
        if ( queryTeamRes.status === 'success') {
          yield put({
            type: 'saveAllTeams',
            payload: mapOptions(queryTeamRes.data)
          });
        }
      } catch(err) {
        console.log(err, 'err happened in fetch teamData');
      }
    }, // 似乎这个effect可以封装
    *fetchAllCities(_, {call, put}) {
      try {
        const queryCityRes = yield call(queryAllCities);
        if ( queryCityRes.status === 'success' ) {
          yield put({
            type: 'saveAllCities',
            payload: mapOptions(queryCityRes.data)
          });
        }
      } catch (err) {
        console.log(err, 'err happened in fetch cityData');
      }
    },
    *fetchAllPushers(_, {call, put}){
      try {
        const queryPusherRes = yield call(queryAllPusers);
        if ( queryPusherRes.status === 'success' ) {
          yield put({
            type: 'saveAllPushers',
            payload: queryPusherRes.data
          });
        }
      } catch (err) {
        console.log(err, 'err happened in fetch pusherData');
      }
    }
  },

  reducers: {
    saveAllTeams(state, action) {
      return {
        ...state, allTeams: action.payload
      };
    },
    updateTeams(state, action) {
      let originAllTeam = state && state.allTeams;

      if (originAllTeam && originAllTeam.find(team=>team.value === action.payload.value) === undefined) {
        return {...state, allTeams: [...originAllTeam, action.payload]};
      }

      return {...state};
    },
    saveAllCities(state, action) {
      return {
        ...state, allCities: action.payload
      };
    },
    saveAllPushers(state, action) {
      return {
        ...state, allPushers: action.payload
      }
    }
  },
};

export default OtherModel;
