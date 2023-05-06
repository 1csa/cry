import { CommonLogicState } from '@/models/connect';
import { isJSON } from '@/utils/dev_helper';

// 质检存在两个审核结果
// 仅仅解析数据 不涉及到是否是历史 为了避免别的历史没有isHis的和dva中的数据
export const parseUserResultData = (result: any) => {
  if (!result) {
    return {};
  }
  // length > 0 什么场景???
  const resultJson = isJSON(result) ? JSON.parse(result) : result;
  const userResult = resultJson ? (Array.isArray(resultJson.labels) ? resultJson?.labels[0] : {}) : {};
  return userResult;
};

// 仅仅解析数据 不涉及到是否是历史 为了避免别的历史没有isHis的和dva中的数据
export const onlyParseData = (userStringResult: any) => {
  // console.info('userResult ---', userStringResult);
  const al = userStringResult?.audit_level;
  const result_String_Object = al > -1 ? userStringResult[`result_l${al}`] : '';
  if (!result_String_Object) {
    return {};
  }
  // length > 0 什么场景???
  const resultJson = isJSON(result_String_Object) ? result_String_Object.length > 0 && JSON.parse(result_String_Object) : result_String_Object;
  const userResult = resultJson ? (Array.isArray(resultJson.labels) ? resultJson?.labels[0] : {}) : {};
  // console.info('userResult >>>', userResult);
  return userResult;
};

export function parseUserReviewResult<T>(commonLogic: T extends CommonLogicState ? T : any) {
  const isHis = sessionStorage.isHis === 'true';
  const data_id = sessionStorage?.data_id || '';
  let userStringResult = null;
  if (!isHis) {
    userStringResult = commonLogic;
  } else {
    userStringResult = data_id && commonLogic?.globalAuditTask && commonLogic.globalAuditTask[data_id] && commonLogic.globalAuditTask[data_id][0];
  }
  return onlyParseData(userStringResult);
}
