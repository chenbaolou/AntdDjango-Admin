import { create, remove } from '../services/filetest';

export default {

  namespace: 'fileTest',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    filterCase: {},
    timestamp: null,
    selectedRowKeys: [],
  },

  effects: {
    *'delete'({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload });
      console.log(data);
      if (data && data.success) {
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
    *create({ payload }, { call, put }) {
      const data = yield call(create, payload);
      if (data && data.success) {
        yield put({ type: 'hideWindow', payload: { wName: 'modalVisible' } });
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    showWindow(state, action) {
      const { wName, ...others } = action.payload;
      state[wName] = true;
      return { ...state, ...others };
    },
    hideWindow(state, action) {
      const { wName, ...others } = action.payload;
      state[wName] = false;
      return { ...state, ...others };
    },
    search(state, action) {
      return { ...state, filterCase: action.payload };
    },
    reload(state) {
      let timestamp = Date.parse(new Date());
      return { ...state, timestamp };
    },
    rowSelection(state, action) {
      return { ...state,
        selectedRowKeys: action.payload.selectedRowKeys,
      };
    },
  },
};
