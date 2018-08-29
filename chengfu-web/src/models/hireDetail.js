import { createFormModel } from '../utils/models';
import * as HireApi from '../services/hire';

export default createFormModel({
  namespace: 'hireDetail',
  fetch: HireApi.getInfo,
  save: HireApi.save,
  redirectUrl: '/inside/hire-list',
}, {
  effects: {
    *editStatus({ payload }, { call, put }) {
      yield put({
        type: 'changePending',
        payload: true,
      });
      const res = yield call(HireApi.save, payload);
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
  },
});
