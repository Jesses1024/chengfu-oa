import { createListModel } from '../utils/models';
import * as AttendanceAPi from '../services/attendance';

export default createListModel({
  namespace: 'attendanceList',
  fetch: AttendanceAPi.getList,
}, {
  effects: {
    *saveInfo({ payload }, { call, put }) {
      const res = yield call(AttendanceAPi.save, payload);
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
    *remove({ payload }, { call, put }) {
      const res = yield call(AttendanceAPi.remove, payload);
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
