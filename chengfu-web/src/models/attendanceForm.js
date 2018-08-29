import { createFormModel } from '../utils/models';
import * as AttendanceApi from '../services/attendance';

export default createFormModel({
  namespace: 'attendanceForm',
  fetch: AttendanceApi.getInfo,
  save: AttendanceApi.save,
  redirectUrl: '/inside/attendance-list',
}, {
  effects: {
    *save({ payload }, { call, put }) {
      yield put({
        type: 'changePending',
        payload: true,
      });
      const res = yield call(AttendanceApi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
      }
      yield put({
        type: 'changePending',
        payload: false,
      });
    },
    *editStatus({ payload }, { call, put }) {
      const res = yield call(AttendanceApi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
      }
    },
  },
});
