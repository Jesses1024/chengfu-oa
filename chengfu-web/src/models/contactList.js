import { createListModel } from '../utils/models';
import * as ContactApi from '../services/contact';

export default createListModel({
  namespace: 'contactList',
  fetch: ContactApi.getList,
}, {
  effects: {
    *editStatus({ payload }, { call, put }) {
      const res = yield call(ContactApi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: {
            page: 0,
            size: 10,
          },
        });
      }
    },
  },
});
