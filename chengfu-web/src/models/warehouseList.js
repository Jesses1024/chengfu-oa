import { createListModel } from '../utils/models';
import * as WarehouseApi from '../services/warehouse';

export default createListModel({
  namespace: 'warehouseList',
  fetch: WarehouseApi.getList,
}, {
  effects: {
    *toggleDisable({ payload }, { call, put }) {
      yield call(WarehouseApi.toggleDisable, payload);
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
