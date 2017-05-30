import { create, remove, update, setGroup } from '../services/sysuser';
import { query as queryGroup } from '../services/sysgroup';
import { parse } from 'qs';

export default {

  namespace: 'sysUser',

  state: {
    currentItem: {},
    modalVisible: false,
    transferVisible: false,
    modalType: 'create',
    filterCase: {},
    timestamp: null,
    selectedRowKeys: [],
    groupList: [],
    targetKeys: [],
  },

  effects: {
    *'delete'({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload });
      if (data && data.success) {
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
    *create({ payload }, { call, put }) {
      const data = yield call(create, payload);
      if (data && data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      const id = yield select(({ sysUser }) => sysUser.currentItem.id);
      const newUser = { ...payload, id };
      const data = yield call(update, newUser);
      if (data && data.success) {
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
    *updateGroup({ payload }, { call, put }) {
      yield put({ type: 'hideWindow', payload: { wName: 'transferVisible' } });
      const { userIds, groupIds } = payload;
      const data = yield call(setGroup, groupIds, { userIds });
      if (data && data.success) {
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
    *queryGroup({ payload }, { call, put }) {
      const data = yield call(queryGroup, parse(payload));
      if (data && data.data) {
        let groupList = data.data.map((item) => {
          return { key: item.id, title: item.name };
        });
        yield put({
          type: 'queryGroupSuccess',
          payload: {
            groupList,
          },
        });
      }
    },
  },

  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    showWindow(state, action) {
      const { wName, ...others } = action.payload;
      state[wName] = true;
      return { ...state, ...others };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    hideWindow(state, action) {
      const { wName, ...others } = action.payload;
      state[wName] = false;
      return { ...state, ...others };
    },
    search(state, action) {
      return { ...state, filterCase: action.payload };
    },
    rowSelection(state, action) {
      return { ...state,
        selectedRowKeys: action.payload.selectedRowKeys,
        targetKeys: action.payload.targetKeys,
      };
    },
    reload(state) {
      let timestamp = Date.parse(new Date());
      return { ...state, timestamp };
    },
    queryGroupSuccess(state, action) {
      const { groupList } = action.payload;
      state.transferVisible = true;
      return { ...state, groupList };
    },
  },
};
