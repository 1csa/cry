import { Effect } from 'dva';
import { Reducer } from 'redux';
import { Dispatch } from '@/models/connect';
import {
  getChannelProps,
  getTopNewsByFromid,
  getRecNewsByFromid,
  delNewsbyDocid,
  getDocData,
  getRecData,
  saveTopNews,
  search,
  mulitSearch,
  getCategory,
  getRecDocProps,
  searchByKeyword,
} from '@/services/topNews.service';
import {
  ChannelProps,
  TopNewsProps,
  TopItemProps,
  SearchResultProps,
  RecItemProps,
  RecNewsProps,
} from '@/config/topNews';
import { message } from 'antd';

export interface TopNewsModelState {
  channel: ChannelProps | {};
  topNews: TopNewsProps | {};
  recNews: RecNewsProps | {};
  recListOrigin: Array<RecItemProps> | []; // 用于存个初始reclist过滤用
  lastTopNews: TopNewsProps | {}; //上次保存后的数据
  operationLog?: Array<TopItemProps>; // 更新后单个数据 未保存
  preTopNews: TopNewsProps | {}; // 开始获取的总数据 保持数据不变
  currentTopItem: TopItemProps | {};
  searchResult: SearchResultProps | {};
  mulitSearchResult: Array<SearchResultProps> | [];
  categoryList: Array<string>;
  loading: boolean; //是否展示loading
  loadingrec: boolean; //是否展示数据loading
  loadingDoc: boolean;
}

export interface TopNewsModelType {
  namespace: string;
  state: TopNewsModelState;
  reducers: {
    updateChannel: Reducer<TopNewsModelState>;
    updateTopNews: Reducer<TopNewsModelState>;
    updateRecNews: Reducer<TopNewsModelState>;
    getPreTopNews: Reducer<TopNewsModelState>;
    updateLastTopNews: Reducer<TopNewsModelState>;
    updateOperationLog: Reducer<TopNewsModelState>;
    updateTopList: Reducer<TopNewsModelState>;
    updateRecList: Reducer<TopNewsModelState>;
    updateRecListOrigin: Reducer<TopNewsModelState>;
    updateTopItem: Reducer<TopNewsModelState>;
    updateRecItem: Reducer<TopNewsModelState>;
    updateCurrentTopItem: Reducer<TopNewsModelState>;
    updateSearchResult: Reducer<TopNewsModelState>;
    updateMulitSearchResult: Reducer<TopNewsModelState>;
    updateCategoryList: Reducer<TopNewsModelState>;
    updateLoading: Reducer<TopNewsModelState>;
    updateLoadingrec: Reducer<TopNewsModelState>;
    updateLoadingDoc: Reducer<TopNewsModelState>;
  };
  effects: {
    getChannelProps: Effect;
    getTopNewsByFromid: Effect;
    getRecNewsByFromid: Effect;
    delNewsbyDocid: Effect;
    getData: Effect;
    getDocData: Effect;
    getRecData: Effect;
    search: Effect;
    mulitSearch: Effect;
    saveTopNews: Effect;
    getCategory: Effect;
    searchByKeyword: Effect;
    searchByKeywordAsDocId: Effect;
  };
}

const InitialState: TopNewsModelState = {
  channel: {},
  topNews: {},
  recNews: {},
  recListOrigin: [],
  lastTopNews: {},
  operationLog: [],
  preTopNews: {},
  currentTopItem: {},
  searchResult: {},
  mulitSearchResult: [],
  categoryList: [],
  loading: false,
  loadingrec: false,
  loadingDoc: false,
};

const TopNewsModel: TopNewsModelType = {
  namespace: 'topNews',
  state: {
    channel: {},
    topNews: {},
    recNews: {},
    recListOrigin: [],
    lastTopNews: {},
    operationLog: [],
    preTopNews: {},
    currentTopItem: {},
    searchResult: {},
    mulitSearchResult: [],
    categoryList: [],
    loading: false,
    loadingrec: false,
    loadingDoc: false,
  },
  reducers: {
    updateChannel(state = InitialState, action: any) {
      const {
        payload: { channel },
      } = action;
      return { ...state, channel };
    },

    updateTopNews(state = InitialState, action: any) {
      const {
        payload: { topNews },
      } = action;
      return { ...state, topNews };
    },

    updateRecNews(state = InitialState, action: any) {
      const {
        payload: { recNews },
      } = action;
      return { ...state, recNews };
    },

    getPreTopNews(state = InitialState, action: any) {
      const {
        payload: { preTopNews },
      } = action;
      return { ...state, preTopNews };
    },

    updateLastTopNews(state = InitialState, action: any) {
      const {
        payload: { lastTopNews },
      } = action;
      return { ...state, lastTopNews };
    },

    updateOperationLog(state = InitialState, action: any) {
      const {
        payload: { operationLog },
      } = action;
      return { ...state, operationLog };
    },

    updateTopList(state = InitialState, action: any) {
      const {
        payload: { topList, success },
      } = action;
      const tempTopNews = JSON.parse(JSON.stringify(state?.topNews));
      tempTopNews.top_news = topList;
      success && success();
      return { ...state, topNews: tempTopNews };
    },

    updateRecList(state = InitialState, action: any) {
      const {
        payload: { recList, success },
      } = action;
      const tempRecNews = JSON.parse(JSON.stringify(state?.recNews));
      tempRecNews.rec_list = recList;
      success && success();
      return { ...state, recNews: tempRecNews };
    },

    updateRecListOrigin(state = InitialState, action: any) {
      const {
        payload: { recListOrigin },
      } = action;
      return { ...state, recListOrigin };
    },

    updateTopItem(state = InitialState, action: any) {
      const {
        payload: { index, topItem },
      } = action;

      const tempTopNews = JSON.parse(JSON.stringify(state?.topNews));
      const tempArr = JSON.parse(JSON.stringify(state?.operationLog));
      tempArr[index] = topItem;
      tempTopNews.top_news[index] = topItem;
      return { ...state, topNews: tempTopNews, operationLog: tempArr };
    },

    updateRecItem(state = InitialState, action: any) {
      const {
        payload: { index, recItem },
      } = action;
      if (recItem.toptype === 'top') {
        const tempTopNews = JSON.parse(JSON.stringify(state?.topNews));
        tempTopNews.top_news[index] = recItem;
        return { ...state, topNews: tempTopNews };
      } else {
        const tempTopNews = JSON.parse(JSON.stringify(state?.recNews));
        tempTopNews.rec_list[index] = recItem;
        return { ...state, recNews: tempTopNews };
      }
    },
    updateLoading(state = InitialState, action: any) {
      const {
        payload: { loading },
      } = action;
      return { ...state, loading: loading };
    },
    updateCurrentTopItem(state = InitialState, action: any) {
      const {
        payload: { currentTopItem },
      } = action;
      return { ...state, currentTopItem };
    },

    updateSearchResult(state = InitialState, action: any) {
      const {
        payload: { searchResult },
      } = action;
      return { ...state, searchResult };
    },
    updateMulitSearchResult(state = InitialState, action: any) {
      const {
        payload: { mulitSearchResult },
      } = action;
      return { ...state, mulitSearchResult };
    },
    updateCategoryList(state = InitialState, action: any) {
      const {
        payload: { categoryList },
      } = action;
      return { ...state, categoryList };
    },

    updateLoading(state = InitialState, action: any) {
      const {
        payload: { loading },
      } = action;
      return { ...state, loading };
    },

    updateLoadingrec(state = InitialState, action: any) {
      const {
        payload: { loadingrec },
      } = action;
      return { ...state, loadingrec };
    },

    updateLoadingDoc(state = InitialState, action: any) {
      const {
        payload: { loadingDoc },
      } = action;
      return { ...state, loadingDoc };
    },
  },

  effects: {
    *getChannelProps({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const { status, data, reason } = yield call(getChannelProps, rest);
      if (status === 'success') {
        yield put({
          type: 'updateChannel',
          payload: { channel: data },
        });
        yield success && success();
      } else {
        yield fail && fail();
      }
    },

    // 通过fromid查找topnews
    *getTopNewsByFromid({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      yield put({
        type: 'updateLoading',
        payload: { loading: true },
      });
      const { status, data, reason } = yield call(getTopNewsByFromid, rest);
      if (status === 'success') {
        
        const { top_news, lifespan } = data;
        // lifespan默认为12 不能为0
        const tempData = { _id: rest.fromid, top_news: top_news || [], lifespan: lifespan || 12 };
        const docids = tempData.top_news.map((doc: TopItemProps) => doc.docid);
        // if (docids.length > 0) {
        //   const { data: dataMap } = yield call(getDocData, { docids, ...rest });
        //   if (dataMap) {
        //     // 将近期数据统计的数据放到topNews中更新
        //     tempData.top_news = tempData.top_news.map(
        //       (doc: TopItemProps) => ((doc.data = dataMap[doc.docid] || ''), doc),
        //     );
        //   }
        // }
        // 切换左侧menu大类时 捕获的数据变化清0
        yield put({
          type: 'updateTopNews',
          payload: { topNews: tempData },
        });
        // 更新后单个数据 未保存
        yield put({
          type: 'updateOperationLog',
          payload: { operationLog: [] },
        });
        // 保存开始数据 暂未用到
        // yield put({
        //   type: 'getPreTopNews',
        //   payload: { preTopNews: tempData },
        // });
        // 切换左侧menu时 获取初始数据
        yield put({
          type: 'updateLastTopNews',
          payload: { lastTopNews: tempData },
        });
        yield put({
          type: 'updateLoading',
          payload: { loading: false },
        });
        // start 更新近7日统计操作放在这里
        if (docids.length > 0) {
          const { data: dataMap } = yield call(getDocData, { docids, ...rest });
          if (dataMap) {
            // 将近期数据统计的数据放到topNews中更新
            tempData.top_news = tempData.top_news.map(
              (doc: TopItemProps) => ((doc.data = dataMap[doc.docid] || ''), doc),
            );
          }
          yield put({
            type: 'updateTopNews',
            payload: { topNews: tempData },
          });
          yield put({
            type: 'updateLastTopNews',
            payload: { lastTopNews: tempData },
          });
        }
        // end
        yield success && success();
      } else {
        yield fail && fail(reason);
        yield put({
          type: 'updateLoading',
          payload: { loading: false },
        });
      }
    },

    // 根据docids删除推荐内容
    *delNewsbyDocid({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      let fromid = rest.params.fromid;
      let docid = rest.params.recItem.docid;
      const result = yield call(delNewsbyDocid, rest);
    },

    /**
     * 通过fromid查找推荐内容源的数据
     */
    *getRecNewsByFromid({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      //  console.log("...rest1",rest)
      // console.log("page",rest.params.recList)
      // let recList=rest.params.recList
      let pageNum = rest.params.pageNum;
      yield put({
        type: 'updateLoadingrec',
        payload: { loadingrec: true },
      });
      const { result, reason, status, code, offset } = yield call(getRecNewsByFromid, rest);
      if (status === 'success' && code === 0) {
        let tempData = { _id: rest.params.fromid, rec_list: result || [] };

        yield put({
          type: 'updateRecNews',
          payload: { recNews: tempData },
        });
        yield put({
          type: 'updateRecListOrigin',
          payload: { recListOrigin: tempData.rec_list },
        });
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
      } else {
        yield fail && fail(reason);
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
      }
    },

    // 根据id动态请求渲染数据
    *getData({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      console.log('...rest2', rest);
      let tempData = { _id: rest.params.fromid, rec_list: rest.params.recItem || [] };
      let docids = rest.params.recItem.docid;
      let datas = {};
      datas[docids] = true;
      if (
        payload.params.recItem.docid.length > 0 &&
        !tempData.rec_list.props &&
        !tempData.rec_list.data
      ) {
        yield put({
          type: 'updateLoadingDoc',
          payload: { loadingDoc: true },
        });
        // 请求推荐内容源标签信息
        let docids = [];
        docids.push(payload.params.recItem.docid);
        let recProps = yield call(getRecDocProps, { docids });

        let propMap = {}; // 推荐内容源props属性
        if (recProps.status !== 'success') {
          message.error(
            recProps.reason ||
              'http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get 接口报错',
          );
          console.log('http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get');
        }
        recProps &&
          recProps.result &&
          recProps.result.forEach((item: any) => (propMap[item._id] = item));
        //请求推荐内容源文章数据
        let { data: dataMap } = yield call(getRecData, {
          docids,
          fromid: rest.params.fromid,
          ...rest,
        });
        tempData.rec_list.data = dataMap[tempData.rec_list.docid || ''];
        tempData.rec_list.props = propMap[tempData.rec_list.docid || ''];
        yield put({
          type: 'updateLoadingDoc',
          payload: { loadingDoc: false },
        });
        // return tempData;
      } else {
        yield put({
          type: 'updateLoadingDoc',
          payload: { loadingDoc: false },
        });
      }
    },

    /**
     * 通过搜索 获取推荐内容源的数据 和上面获取推荐内容源的处理方式是一样的
     */
    *searchByKeyword({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      yield put({
        type: 'updateLoadingrec',
        payload: { loadingrec: true },
      });
      const { status, reason, data } = yield call(searchByKeyword, rest);
      if (status === 'success' && data) {
        const { result } = data;
        let tempData = { _id: rest.params.fromid, rec_list: result || [] };
        let docids = result.map((item: RecItemProps) => item.docid);
        if (docids.length > 0) {
          // 请求推荐内容源标签信息
          let recProps = yield call(getRecDocProps, { docids });
          let propMap = {}; // 推荐内容源props属性
          if (recProps.status !== 'success') {
            message.error(
              recProps.reason ||
                'http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get 接口报错',
            );
            console.log('http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get');
          }
          recProps &&
            recProps.result &&
            recProps.result.forEach((item: any) => (propMap[item._id] = item));

          // 请求推荐内容源文章数据
          let { data: dataMap } = yield call(getRecData, {
            docids,
            fromid: rest.params.fromid,
            ...rest,
          });
          if (dataMap) {
            tempData.rec_list = tempData.rec_list.map((item: RecItemProps) => {
              item.data = dataMap[item.docid] || '';
              item.props = propMap[item.docid] || {};
              return item;
            });
          }
        }
        // console.log('tempdata: ', tempData, tempData.rec_list)
        // debugger
        yield put({
          type: 'updateRecNews',
          payload: { recNews: tempData },
        });
        yield put({
          type: 'updateRecListOrigin',
          payload: { recListOrigin: tempData.rec_list },
        });
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
        yield success && success();
      } else {
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
        yield fail && fail(reason);
      }
    },
    /**
     * 推荐内容源支持搜索docId，使用
     */
    *searchByKeywordAsDocId({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      yield put({
        type: 'updateLoadingrec',
        payload: { loadingrec: true },
      });
      let searchRest = {
        docid: rest.params.keyword,
        fromid: rest.params.fromid,
      };
      const { status, reason, data } = yield call(search, searchRest);
      if (status === 'success' && data) {
        // 查单篇文章的数据
        const docids = [data.docid];
        let tempData = { _id: rest.fromid, rec_list: data ? [data] : [] };

        if (docids.length > 0) {
          // 请求推荐内容源标签信息
          let recProps: any = {}
          // recProps = yield call(getRecDocProps, { docids }); // 这个请求没用， 不要发送这个请求了 还会导致报错 fuck
          let propMap = {}; // 推荐内容源props属性
          if (recProps.status !== 'success') {
            // message.error(
            //   recProps.reason ||
            //     'http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get 接口报错',
            // );
            // console.log('http://mermaid.ha.in.yidian.com:8101/mermaid/newsedit?method=get');
          }
          recProps &&
            recProps.result &&
            recProps.result.forEach((item: any) => (propMap[item._id] = item));

          // 请求推荐内容源文章数据
          let { data: dataMap } = yield call(getRecData, {
            docids,
            fromid: rest.params.fromid,
            ...rest,
          });
          if (dataMap) {
            tempData.rec_list = tempData.rec_list.map((item: RecItemProps) => {
              item.data = dataMap[item.docid] || '';
              item.props = propMap[item.docid] || {};
              return item;
            });
          }
        }
        yield put({
          type: 'updateRecNews',
          payload: { recNews: tempData },
        });
        yield put({
          type: 'updateRecListOrigin',
          payload: { recListOrigin: tempData.rec_list },
        });
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
        yield success && success();
      } else {
        yield put({
          type: 'updateLoadingrec',
          payload: { loadingrec: false },
        });
        yield fail && fail(reason);
      }
    },

    // 文章数据统计
    *getDocData({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const { status, data, reason } = yield call(getDocData, rest);
      // console.log(status, data)
      if (status === 'success') {
        yield success && success();
        return data;
      } else {
        yield fail && fail();
      }
    },

    // 推荐内容源侧的文章数据统计
    *getRecData({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const { status, data, reason } = yield call(getRecData, rest);
      // console.log(status, data)
      if (status === 'success') {
        yield success && success();
        return data;
      } else {
        yield fail && fail();
      }
    },

    // 查询
    *search({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      yield put({
        type: 'updateSearchResult',
        payload: { searchResult: {} },
      });
      yield put({
        type: 'updateMulitSearchResult',
        payload: { mulitSearchResult: [] },
      });
      const { status, data, reason } = yield call(search, rest);
      if (status === 'success') {
        // 查单篇文章的数据
        const docids = [data.docid];
        const { data: dataMap } = yield call(getDocData, { docids, ...rest });
        data.data = dataMap[docids[0]];
        yield put({
          type: 'updateSearchResult',
          payload: { searchResult: data },
        });
        // yield success && success()
      } else {
        yield fail && fail(reason);
      }
    },
    *mulitSearch({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      yield put({
        type: 'updateSearchResult',
        payload: { searchResult: {} },
      });
      yield put({
        type: 'updateMulitSearchResult',
        payload: { mulitSearchResult: [] },
      });
      const all = yield call(mulitSearch, rest);
      let id = '';
      const datas = all.reduce((pre: any, cur: any) => {
        if ((cur.status = 'success')) {
          pre.push(cur.data);
          id += ',' + cur.data.docid;
        }
        return pre;
      }, []);
      const { data: dataMap } = yield call(getDocData, {
        docids: id.substr(1, id.length - 1).split(','),
      });
      datas.forEach((item: { data: any; docid: string }) => {
        item.data = dataMap[item.docid];
      });
      yield put({
        type: 'updateMulitSearchResult',
        payload: { mulitSearchResult: datas },
      });
    },

    // 保存
    *saveTopNews({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const { status, data, reason } = yield call(saveTopNews, rest);
      if (status === 'success') {
        // yield put({
        //   type: 'updateTopNews',
        //   payload: { topNews: data }
        // })
        yield success && success();
      } else {
        yield fail && fail(reason);
      }
    },

    *getCategory({ payload = {} }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const { status, data, reason } = yield call(getCategory, rest);
      if (status === 'success') {
        yield put({
          type: 'updateCategoryList',
          payload: { categoryList: data },
        });
        yield success && success();
      } else {
        yield fail && fail();
      }
    },
  },
};

export default TopNewsModel;
