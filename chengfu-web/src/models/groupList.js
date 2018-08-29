import { createListModel } from '../utils/models';
import * as GroupApi from '../services/group';

export default createListModel({
  namespace: 'groupList',
  fetch: GroupApi.getList,
}, {
  effects: {
    *toogleDept({ payload }, { call, put }) {
      yield call(GroupApi.toogleDept, payload);
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
