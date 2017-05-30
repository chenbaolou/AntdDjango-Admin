import { create, remove, update } from '../services/sysgroup';

export default {

  namespace: 'sysGroup',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    filterCase: {},
    timestamp: null,
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
      const id = yield select(({ sysGroup }) => sysGroup.currentItem.id);
      const newGroup = { ...payload, id };
      const data = yield call(update, newGroup);
      if (data && data.success) {
        yield put({ type: 'reload' });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    search(state, action) {
      return { ...state, filterCase: action.payload };
    },
    reload(state) {
      let timestamp = Date.parse(new Date());
      return { ...state, timestamp };
    },
  },
};
