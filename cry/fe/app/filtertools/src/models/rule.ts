import { Effect } from 'dva';
import { Reducer } from 'redux';

const RuleModel = {
  namespace: 'rule',
  state: {
    ruleId: null
  },

  // effects: {
  //   *getRule({payload}: any, {put}: any) {
  //     yield put({
  //       type: 'saveRule',
  //       payload: {
  //         ruleId: payload.ruleId
  //       }
  //     })
  //   }
  // },

  reducers: {
    saveRule(state:any, action:any) {
      return {
        ...state,
        ...action.payload
      }
    },
  },
};

export default RuleModel;
