import { createFormModel } from '../utils/models';
import * as ReimburseAPi from '../services/reimburse';

export default createFormModel({
  namespace: 'reimburseDetail',
  fetch: ReimburseAPi.getInfo,
  save: ReimburseAPi.save,
  redirectUrl: '/inside/reimburse-list',
}, {
  effects: {
    *saveInfo({ payload }, { call, put }) {
      const res = yield call(ReimburseAPi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
      }
    },
  },
});
