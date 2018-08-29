import { createListModel } from '../utils/models';
import * as UserApi from '../services/user';

export default createListModel({
  namespace: 'userList',
  fetch: UserApi.getList,
}, {
  effects: {
    *toogleUser({ payload }, { call, put }) {
      yield call(UserApi.toogleUser, payload);
      yield put({
        type: 'fetch',
        payload: {
          page: 0,
          size: 10,
        },
      });
    },
  },
});
