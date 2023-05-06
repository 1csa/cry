import { message } from 'antd';

import { parseTags, isEmpty } from '@/utils';

import { Effect, Reducer } from '@/models/connect';
import { PushDocInfo, DocInfo } from '@/config/editorpush/push';
import { StatisticItem, PushHistoryItem } from '@/config/editorpush/history';
import { getPushHistory, updatePush, updateContent } from '@/services/historyService';
import { getUserlayerList, getSyncPlatforms, getCatelist, getUserCount, getPushUsers, getDocinfo } from '@/services/editorpushService';

export interface PushModelState {
  statistics: Array<StatisticItem>;
  taskList: Array<PushHistoryItem>;
  countAll: number,
  cateList: Array<{ name: string; id: string }>;
  userlayerList: Array<{ name: string; id: string }>;
  storedIntags: Record<string, string>;
  storedExtags: Record<string, string>;
  storedIntertags: Record<string, string>;
  docrecInTags: Record<string, string>;
  selectedInTags: string[];
  seledtedExTags: string[];
  syncPlatforms: Array<{ id: string; name: string }>;
  pushUserCount: string;
  pushdocInfo: PushDocInfo;
  pushsectiondocInfo: Record<string, string>;
  articleInfo: DocInfo;
  localTags: Record<string, string>;
}

export interface AccountModelType {
  namespace: 'editorpush';
  state: PushModelState;
  effects: Record<string, Effect>;
  reducers: Record<string, Reducer<PushModelState>>;
}

const InitialEditorState: PushModelState = {
  statistics: [],
  taskList: [],
  countAll: 0,
  cateList: [],
  userlayerList: [],
  storedIntags: {},
  storedIntertags: {},
  storedExtags: {},
  docrecInTags: {},
  selectedInTags: [],
  seledtedExTags: [],
  syncPlatforms: [],
  pushUserCount: '0',
  pushdocInfo: { docid: '', title: '', summary: '', error: '' },
  pushsectiondocInfo: {
    docid1: '', title1: '', summary1: '', error1: '',
    docid2: '', title2: '', summary2: '', error2: '',
    docid3: '', title3: '', summary3: '', error3: '',
  },
  articleInfo: {
    image_urls: [],
    image: "",
    serving_status: false,
    summary: "",
    title: "",
    ncat: "",
    nsubcat: "",
    rec_tags: {},
  },
  localTags: {},
};

const EditorPushModel: AccountModelType = {
  namespace: 'editorpush',
  state: InitialEditorState,
  effects: {
    // 获取推送列表
    fetchPushHistory: function*(action, { call, put }) {
      const { formscreen } = action.payload || {};
      try {
        const historyRes = yield call(getPushHistory, formscreen);

        if (historyRes.status === 'success') {
          const { statistics = [], task_history = [], count_all = 0 } = historyRes.result;
          yield put({
            type: 'updatePushHitory',
            payload: { statistics: statistics, taskList: task_history, countAll: count_all },
          });
        } else {
          throw new Error(historyRes.message); // 假设这里的错误信息都用message字段返回
        }
      } catch (err) {
        message.error(err.toString());
      } finally {
        if (action.callback) {
          yield call(action.callback);
        }
      }
    },

    // 暂停/恢复推送
    updatePush: function*(action, { call, put }) {
      const { pushId, type = 'pause' } = action.payload;

      try {
        const pauseRes = yield call(updatePush, pushId, type);

        if (pauseRes.status === 'success') {
          yield put({
            type: 'updateHistoryList',
            payload: { pushId, type },
          });
          yield call(() => message.success('暂停推送成功'));
        } else {
          throw new Error(pauseRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      }
    },

    // 推送再次编辑
    updateContent: function*(action, { call, put }) {
      const { push_id, new_push_id, head, news } = action.payload;

      try {
        const updateRes = yield call(updateContent, push_id || new_push_id, head, news);

        if (updateRes.status !== 'success') {
          throw new Error(updateRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      } finally {
        if (action.callback) {
          yield call(action.callback);
        }
      }
    },

    // 获取分类列表
    fetchCateList: function*(action, { call, put }) {
      try {
        const listRes = yield call(getCatelist);

        if (listRes.status === 'success') {
          yield put({
            type: 'updateCatelist',
            payload: { list: listRes.result },
          });
        } else {
          throw new Error(listRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      }
    },

    // 获取用户层级列表
    fetchUserLayerList: function*(action, { call, put }) {
      try {
        const listRes = yield call(getUserlayerList);

        if (listRes.status === 'success') {
          yield put({
            type: 'updateUserlayerList',
            payload: { list: listRes.result },
          });
        } else {
          throw new Error(listRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      }
    },

    // 获取同步平台列表
    fetchAsyncPlatformList: function*(action, { call, put }) {
      try {
        const fetchRes = yield call(getSyncPlatforms);

        if (fetchRes.status === 'success') {
          yield put({
            type: 'updateSyncplatforms',
            payload: { list: fetchRes.result },
          });
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      } finally {
        if (action.callback) {
          yield call(action.callback);
        }
      }
    },

    // 获取标签对应的人数
    fetchStoredTagCount: function*(action, { call, put }) {
      const { tags, extags, interTags } = action.payload;

      try {
        if (isEmpty(tags) === false) {
          const channelRes = yield call(getUserCount, Object.keys(tags));

          if (channelRes.status !== 'success') {
            throw new Error(channelRes.message);
          }
          yield put({
            type: 'updateStoredTags',
            payload: { tags: parseTags(tags, channelRes.result), type: 'storedIntags' },
          });
          yield put({
            type: 'updateSelectedTags',
            payload: { tags: tags, type: 'selectedInTags' }, // bug
          });
          // yield put({
          //   type: 'updateSelectedTags',
          //   payload: { tags: interTags, type: 'selectedInTags' },
          // });
        }

        if (isEmpty(extags) === false) { // bug
          const exchannelRes = yield call(getUserCount, Object.keys(extags));

          if (exchannelRes.status !== 'success') {
            throw new Error(exchannelRes.message);
          }
          yield put({
            type: 'updateStoredTags',
            payload: { tags: parseTags(tags, exchannelRes.result), type: 'storedExtags' },
          });
          yield put({
            type: 'updateSelectedTags',
            payload: { tags: extags, type: 'selectedExTags' },
          });
        }
      } catch (err) {
        message.error(err.toString());
      }
    },

    // 根据标签获取能够推送到的用户数
    getPushUserCount: function*(action, { call, put }) {
      const { tags, extags } = action.payload; // bug
      try {
        const userRes = yield call(getPushUsers, tags, extags);

        if (userRes.status === 'success') {
          yield put({
            type: 'updatePushUsers',
            payload: { count: userRes.result.together },
          });
        } else {
          throw new Error(userRes.message);
        }
      } catch (err) {
        message.error(err.toString());
      }
    },

    // 获取文章对应的标题、摘要等信息
    fetchDocInfo: function*(action, { call, put }) {
      const { docid, index, biz_id } = action.payload;

      try {
        const { status, result, message } = yield call(getDocinfo, docid, biz_id);

        if (status !== 'success') {
          throw new Error(message);
        }
        const { serving_info, title, summary, rec_tags, ncat, nsubcat } = result;

        yield put({
          type: 'updateDocrecTags',
          payload: { tags: rec_tags },
        });
        if (index) { // 分段式
          yield put({
            type: 'updateSectionDocInfo',
            payload: {
              docinfo: {
                [`docid${index}`]: docid,
                [`title${index}`]: title,
                [`summary${index}`]: summary,
                [`error${index}`]: serving_info,
              }
            },
          })
        } else {
          let articleInfo: DocInfo = { image_urls: [], image: "" };
          for (const key in result) {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
              articleInfo[key] = result[key];
            }
          }
          yield put({
            type: 'updateDocInfo',
            payload: { docinfo: { docid, title, summary, error: serving_info }},
          });
          yield put({ // 图片信息
            type: 'updateImage',
            payload: { articleInfo },
          });
        }
        if (action.callback) {
          yield call(action.callback);
        }
      } catch (err) {
        message.warning('获取文章信息失败，请手动输入');
      }
    },
  },
  reducers: {
    saveTags: function(state = InitialEditorState, action) {
      const { localTags } = action.payload;
      let tempLocalTags = state.localTags;
      Object.keys(localTags).map(key => {
        tempLocalTags[key] = localTags[key]
      })
      return { ...state, localTags: tempLocalTags }
    },
    updateImage: function(state = InitialEditorState, action) {
      const { articleInfo } = action.payload;
      return { ...state, articleInfo };
    },
    // 只对统计数据更新一次
    updatePushHitory: function(state = InitialEditorState, action) {
      const { statistics, taskList, countAll } = action.payload;

      if (state.statistics.length > 0) {
        return { ...state, taskList, countAll };
      }
      return { ...state, taskList, statistics, countAll };
    },

    updateHistoryList: function(state = InitialEditorState, action) {
      const pushId = action.payload.pushId;
      const pauseData = action.payload.type === 'continue' ? false : true;

      const initList = state.taskList.map(listItem => {
        return listItem.push_id === pushId || listItem.new_push_id === pushId ? { ...listItem, pause: pauseData } : listItem;
      });

      return { ...state, taskList: initList };
    },

    // 更新分类列表
    updateCatelist: function(state = InitialEditorState, action) {
      return { ...state, cateList: action.payload.list };
    },

    // 更新用户层级列表
    updateUserlayerList: function(state = InitialEditorState, action) {
      return { ...state, userlayerList: action.payload.list || [] };
    },

    // 更新同步推送端
    updateSyncplatforms: function(state = InitialEditorState, action) {
      return { ...state, syncPlatforms: action.payload.list };
    },

    // 更新推送人数
    updatePushUsers: function(state = InitialEditorState, action) {
      return { ...state, pushUserCount: action.payload.count };
    },

    // 更新选中的标签
    updateSelectedTags: function(state = InitialEditorState, action) {
      return { ...state, [action.payload.type]: action.payload.tags };
    },

    // 更新存储的标签
    updateStoredTags: function(state = InitialEditorState, action) {
      const { extags, tags, interTags } = action.payload;
      return { ...state, storedIntags: tags, storedExtags: extags, storedIntertags: interTags };
    },

    // 更新存储的文章相关标签
    updateDocrecTags: function(state = InitialEditorState, action) {
      return { ...state, docrecInTags: action.payload.tags };
    },

    // 更新存储的文章相关信息
    updateDocInfo: function(state = InitialEditorState, action) {
      return { ...state, pushdocInfo: action.payload.docinfo };
    },

    // 分段式更新存储的文章相关信息
    updateSectionDocInfo: function(state = InitialEditorState, action) {
      const { payload: { docinfo } } = action;
      let tempDocInfo = state.pushsectiondocInfo;
      Object.keys(docinfo).map(key => {
        tempDocInfo[key] = docinfo[key]
      })
      return { ...state, pushsectiondocInfo: tempDocInfo };
    },
  },
};

export default EditorPushModel;
