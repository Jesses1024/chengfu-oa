import { message } from 'antd';
import { query as queryUsers, queryCurrent, checkPassword } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    moduleSubmitting: false,
    visible: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *checkPassword({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(checkPassword, payload);
      if (!res.error) {
        message.success('修改成功');
        yield put({
          type: 'toogleModel',
          payload: false,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *toogleModel({ payload }, { put }) {
      yield put({
        type: 'changeModel',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    addNotifyCount(state) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: state.currentUser.notifyCount + 1,
        },
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        moduleSubmitting: payload,
      };
    },
    changeModel(state, { payload }) {
      return {
        ...state,
        visible: payload,
      };
    },
  },
};
