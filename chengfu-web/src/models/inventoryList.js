import { createListModel } from '../utils/models';
import * as InventoryApi from '../services/inventory';

export default createListModel({
  namespace: 'inventoryList',
  fetch: InventoryApi.getList,
}, {
  state: {
    logData: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    logLoading: false,
  },
  effects: {
    *editLimit({ payload }, { call, put }) {
      yield call(InventoryApi.editLimit, payload);
      yield put({
        type: 'fetch',
        payload: {
          page: 0,
          size: 10,
        },
      });
    },
    *fetchLogList({ payload }, { call, put }) {
      const response = yield call(InventoryApi.getLogList, payload);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'saveLogList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *changeInventory({ payload }, { call, put }) {
      const res = yield call(InventoryApi.inventoryChange, payload);
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
    *batchInventoryChange({ payload }, { call, put }) {
      const res = yield call(InventoryApi.batchInventoryChange, payload);
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
    // *checkInventory({ payload }, { call, put }) {
    //   const res = yield call(InventoryApi.checkInventory, payload);
    //   if (!res.error) {
    //     yield put({
    //       type: 'fetch',
    //       payload: {
    //         pagination: {
    //           current: 1,
    //           pageSize: 10,
    //         },
    //       },
    //     });
    //   }
    // },
  },
  reducers: {
    saveLogList(state, { payload }) {
      return {
        ...state,
        logData: {
          list: payload.list,
          pagination: {
            current: (payload.page || 0) + 1,
            pageSize: payload.size,
            total: payload.total,
          },
        },
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        logLoading: payload,
      };
    },
  },
});
