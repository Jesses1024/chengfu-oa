import { createListModel } from '../utils/models';
import * as StaffApi from '../services/staff';

export default createListModel({
  namespace: 'staffList',
  fetch: StaffApi.getList,
}, {
  effects: {
    *editStatus({ payload }, { call, put }) {
      const res = yield call(StaffApi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: {
            pagination: {
              current: 1,
              pageSize: 10,
            },
          },
        });
      }
    },
  },
});
