import { Dispatch, Callback } from '@/models/connect';
import {
  TopNewsProps,
  TopItemProps,
  RecProps,
  RecItemProps,
  RecNewsProps,
  searchProps,
} from '@/config/topNews';

export default {
  getChannelProps: (dispatch: Dispatch) => (
    fromid: string,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/getChannelProps',
      payload: { fromid, success, fail },
    });
  },

  getTopNewsByFromid: (dispatch: Dispatch) => (
    fromid: string,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/getTopNewsByFromid',
      payload: { fromid, success, fail },
    });
  },

  getRecNewsByFromid: (dispatch: Dispatch) => (
    params: RecProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/getRecNewsByFromid',
      payload: { params, success, fail },
    });
  },

  getData: (dispatch: Dispatch) => (
    params: RecProps,
    success?: Callback,
    fail?: Callback,
    // recList?:any
  ) => {
    dispatch({
      type: 'topNews/getData',
      payload: { params, success, fail },
    });
  },

  delNewsbyDocid: (dispatch: Dispatch) => (
    params: RecProps,
    success?: Callback,
    fail?: Callback,
    // recList?:any
  ) => {
    dispatch({
      type: 'topNews/delNewsbyDocid',
      payload: { params, success, fail },
    });
  },

  searchByKeyword: (dispatch: Dispatch) => (
    params: searchProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/searchByKeyword',
      payload: { params, success, fail },
    });
  },
  // 推荐内容源支持搜索docId
  searchByKeywordAsDocId: (dispatch: Dispatch) => (
    params: searchProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/searchByKeywordAsDocId',
      payload: { params, success, fail },
    });
  },
  updateTopNews: (dispatch: Dispatch) => (
    topNews: TopNewsProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateTopNews',
      payload: { topNews, success, fail },
    });
  },
  updateTopList: (dispatch: Dispatch) => (
    topList: Array<TopItemProps>,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateTopList',
      payload: { topList, success, fail },
    });
  },
  updateRecNews: (dispatch: Dispatch) => (
    recNews: RecNewsProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateRecNews',
      payload: { recNews, success, fail },
    });
  },
  updateRecList: (dispatch: Dispatch) => (
    recList: Array<RecItemProps>,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateRecList',
      payload: { recList, success, fail },
    });
  },
  updateRecItem: (dispatch: Dispatch) => (
    index: number,
    recItem: RecItemProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateRecItem',
      payload: { index, recItem, success, fail },
    });
  },
  updateLoading: (dispatch: Dispatch) => loading => {
    dispatch({
      type: 'topNews/updateLoading',
      payload: { loading },
    });
  },
  updateTopItem: (dispatch: Dispatch) => (
    index: number,
    topItem: TopItemProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateTopItem',
      payload: { index, topItem, success, fail },
    });
  },
  updateCurrentTopItem: (dispatch: Dispatch) => (
    currentTopItem: TopItemProps | RecItemProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateCurrentTopItem',
      payload: { currentTopItem, success, fail },
    });
  },
  search: (dispatch: Dispatch) => (
    searchText: string,
    fromid: string,
    success?: Callback,
    fail?: Callback,
  ) => {
    const payload: { docid?: string; url?: string; fromid?: string } = {};
    // 判断 是否为 docid 其他都按 url 处理
    if (
      (searchText.length === 8 && searchText.search(/^\w+$/) === 0) ||
      searchText.replace(/,/g, '').length % 8 === 0 ||
      /V_\w+$/.test(searchText) ||
      /K_\w+$/.test(searchText) ||
      /T_\w+$/.test(searchText) ||
      /J_\w+$/.test(searchText) ||
      /A_\w+$/.test(searchText) ||
      /N_\w+$/.test(searchText) ||
      /C_\w+$/.test(searchText) ||
      /E_\w+$/.test(searchText)
    ) {
      payload.docid = searchText;
    } else {
      payload.url = searchText;
    }
    payload.fromid = fromid;

    dispatch({
      type: 'topNews/search',
      payload: { ...payload, success, fail },
    });
  },
  mulitSearch: (dispatch: Dispatch) => (
    searchText: string,
    fromid: string,
    success?: Callback,
    fail?: Callback,
  ) => {
    const payload: { docid?: string; url?: string; fromid?: string } = {};
    // 判断 是否为 docid 其他都按 url 处理
    if (searchText.replace(/,/g, '').length % 8 === 0) {
      payload.docid = searchText;
    }
    dispatch({
      type: 'topNews/mulitSearch',
      payload: { ...payload, success, fail },
    });
  },
  saveTopNews: (dispatch: Dispatch) => (
    topInfo: TopNewsProps,
    success?: Callback,
    fail?: Callback,
    operationLog?: Array<TopItemProps>,
  ) => {
    dispatch({
      type: 'topNews/saveTopNews',
      payload: { topInfo, success, fail, operationLog },
    });
  },
  getCategoryList: (dispatch: Dispatch) => (
    appid: string = 'yidian',
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/getCategory',
      payload: { appid, success, fail },
    });
  },
  // 派发 用于保存 上次点击保存后的数据
  updateLastTopNews: (dispatch: Dispatch) => (
    lastTopNews: TopNewsProps,
    success?: Callback,
    fail?: Callback,
  ) => {
    dispatch({
      type: 'topNews/updateLastTopNews',
      payload: { lastTopNews, success, fail },
    });
  },
};
