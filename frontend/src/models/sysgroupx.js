import { create, remove, update, query } from '../services/sysgroup';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { config } from '../utils';
const { defaultPagination } = config

export default {

  namespace: 'sysGroupX',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    pagination: defaultPagination,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sysgroupx') {
          dispatch({
            type: 'query',
            payload: location.query,
          });
        }
      });
    },
  },

  effects: {
    *requery({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: location.pathname,
        query: parse(location.search.substr(1)),
      }));
    },
    *query({ payload }, { select, call, put }) {
      const state = yield select(({ sysGroupX }) => sysGroupX);
      let start = payload.start || 0;
      let limit = payload.limit || state.pagination.pageSize;
      payload = { ...payload, start, limit };
      const data = yield call(query, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              total: data.total,
              pageSize: Number(payload.limit),
              current: Number(payload.current),
            },
          },
        });
      }
    },
    *'delete'({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data && data.success) {
        yield put({ type: 'requery' });
      } else {
        throw data;
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      const data = yield call(create, payload)
      if (data && data.success) {
        yield put({ type: 'requery' });
      } else {
        throw data;
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      const id = yield select(({ sysGroup }) => sysGroup.currentItem.id)
      const newGroup = { ...payload, id }
      const data = yield call(update, newGroup)
      if (data && data.success) {
        yield put({ type: 'requery' });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    querySuccess(state, action) {
      const { list, pagination } = action.payload;
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};
