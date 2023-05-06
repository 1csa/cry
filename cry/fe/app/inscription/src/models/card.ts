import { defaultCards } from '@/config/card.config';
import { postCard, getCard, getArticle, getList, stopCard, reuseCard, deleteCard, fetchOption } from '@/services/card';
import { CardForm } from '@/types/card';
import { Model, CardModelState } from '@/types/connect';
import { isEmpty } from "@/utils";

const InitialCard: CardModelState = {
  cardstore: defaultCards,
  cardlist: [],
  cardTotal: 0,
  docinfo: {},
};

interface CardModel extends Model<CardModelState> {
  namespace: 'card';
}

const cancelCardid = (card: CardForm) => {
  card.card_id = null;

  if (isEmpty(card.card_items) === false) {
    for (let item of card.card_items as CardForm[]) {
      cancelCardid(item);
    }
  }

  return card;
}

const CardModel: CardModel = {
  namespace: 'card',
  state: InitialCard,
  effects: {
    fetchcard: function* (action, { put, call }) {
      const { card_id, mode } = action.payload;

      try {
        const fetchRes = yield call(getCard, card_id, mode);

        if (fetchRes.status === 'success') {
          yield put({
            type: 'updatecard',
            payload: { card: fetchRes.data },
          });
        } else {
          throw new Error(fetchRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when fetch card======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    // 更新数据库中存的卡片
    postcard: function* (action, { put, call }) {
      const { mode, card, deleteCards = [], isnew } = action.payload;

      try {
        const updateRes = yield call(postCard, card, { isnew, delete: deleteCards.join(',') }, mode);

        if (updateRes.status === 'success') {
          yield put({
            type: 'fetchcard',
            payload: { card_id: updateRes.data, mode }
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(updateRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when post card======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    fetchdoc: function* (action, { put, call }) {
      const { mode, docid } = action.payload;

      try {
        const docRes = yield call(getArticle, docid, mode);

        if (docRes.status === 'success') {
          const { title, image } = docRes.data;
          yield put({
            type: 'updatedoc',
            payload: { docid, title, image },
          });
        } else {
          throw new Error(docRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when fetch doc======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    fetchlist: function* (action, { put, call }) {
      const { query, mode } = action.payload;

      try {
        const { status, data, message } = yield call(getList, query, mode);

        if (status === 'success') {
          yield put({
            type: 'updatelist',
            payload: { list: data.list, total: data.total },
          });

          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when fetch list======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    stopcard: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const stopRes = yield call(stopCard, id, mode);

        if (stopRes.status === 'success') {
          yield put({
            type: 'fetchlist',
            payload: { query: listQuery, mode },
          });
          yield put({
            type: 'common/message',
            payload: { message: `卡片 ${id} 已停用`, type: 'success' },
          });
        } else {
          throw new Error(stopRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when stop card======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    copycard: function* (action, { call, put }) {
      const { card_id, mode } = action.payload;

      try {
        const getRes = yield call(getCard, card_id, mode);

        if (getRes.status === 'success') {
          yield put({
            type: 'updatecard', // 把内层的 card_id 制空
            payload: { card: cancelCardid(getRes.data) },
          });
          if (action.callback) {
            yield call(action.callback);
          }
        } else {
          throw new Error(getRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when copy card======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    reusecard: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const stopRes = yield call(reuseCard, id, mode);

        if (stopRes.status === 'success') {
          yield put({
            type: 'fetchlist',
            payload: { query: listQuery, mode },
          });
          yield put({
            type: 'common/message',
            payload: { message: `卡片 ${id} 已启用`, type: 'success' },
          });
        } else {
          throw new Error(stopRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '============error when resue card======');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },

    deletecard: function* (action, { call, put }) {
      const { id, mode, listQuery } = action.payload;

      try {
        const deleteRes = yield call(deleteCard, id, mode);
        if (deleteRes.status === 'success') {
          yield put({
            type: 'fetchlist',
            payload: { query: listQuery, mode },
          });
          yield put({
            type: 'common/message',
            payload: { type: 'success', message: `卡片 ${id} 已删除` },
          });
        } else {
          throw new Error(deleteRes.message);
        }
      } catch (err) {
        console.log(err.toString(), '====error when delete===');
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },
    fetchcardoption: function* (action, { call, put }) {
      const { inputId, mode } = action.payload;

      try {
        const fetchRes = yield call(fetchOption, inputId, mode);
        if (fetchRes.status === 'success') {
          yield put({
            type: 'updateOption',
            payload: { option: fetchRes.data.map(({ value, label }) => ({ label, value: value + '' })) },
          });
          if (action.callback) {
            yield call(action.callback);
          }
        }
      } catch (err) {
        yield put({
          type: 'common/message',
          payload: { type: 'error', message: err.toString() },
        });
      }
    },
  },

  reducers: {
    updatecard: function (state = InitialCard, action) {
      return { ...state, cardstore: action.payload.card };
    },
    updatelist: function (state = InitialCard, action) {
      const { list, total } = action.payload;

      return { ...state, cardlist: list, cardTotal: total };
    },
    updatedoc: function (state = InitialCard, action) {
      const { docid, title, image } = action.payload;
      return { ...state, docinfo: { ...state.docinfo, [docid]: { title, image } } };
    },
    updateOption: function (state = InitialCard, action) {
      return { ...state, cardOption: action.payload.option };
    },
  },
};

export default CardModel;
