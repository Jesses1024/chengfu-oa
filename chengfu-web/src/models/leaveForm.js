import { createFormModel } from '../utils/models';
import * as LeaveForm from '../services/leave';

export default createFormModel({
  namespace: 'leaveForm',
  fetch: LeaveForm.getInfo,
  save: LeaveForm.save,
  redirectUrl: '/inside/leave-list',
}, {
  effects: {
    *resetData(payload, { put }) {
      yield put({
        type: 'saveResponse',
        payload: {},
      });
    },
    *editStatus({ payload }, { call, put }) {
      const res = yield call(LeaveForm.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
      }
    },
  },
});
