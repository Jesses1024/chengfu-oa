import { routerRedux } from 'dva/router';

const initOption = { state: {}, effects: {}, reducers: {} };
const defaultResponse = {
  list: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

export function createFormModel({
  namespace,
  fetch,
  save,
  redirectUrl,
}, {
  state: initState,
  effects,
  reducers,
} = initOption) {
  return {
    namespace,

    state: {
      submitting: false,
      loading: false,
      data: {},
      ...initState,
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        if (payload) {
          yield put({
            type: 'changeLoading',
            payload: true,
          });
          const res = yield call(fetch, payload);
          yield put({
            type: 'changeLoading',
            payload: false,
          });
          yield put({
            type: 'saveResponse',
            payload: res,
          });
        } else {
          yield put({
            type: 'saveResponse',
            payload: {},
          });
        }
      },

      *save({ payload }, { call, put }) {
        yield put({
          type: 'changePending',
          payload: true,
        });
        const res = yield call(save, payload);
        if (redirectUrl) {
          if (!res.error) {
            yield put(routerRedux.push(redirectUrl));
          }
        }
        yield put({
          type: 'changePending',
          payload: false,
        });
      },

      ...effects,
    },

    reducers: {
      saveResponse(state, { payload }) {
        return {
          ...state,
          data: payload,
        };
      },
      changeLoading(state, { payload }) {
        return {
          ...state,
          loading: payload,
        };
      },
      changePending(state, { payload }) {
        return {
          ...state,
          submitting: payload,
        };
      },

      ...reducers,
    },
  };
}

export function createListModel({
  namespace,
  fetch,
}, {
  state: initState,
  effects,
  reducers,
} = initOption) {
  return {
    namespace,

    state: {
      data: {
        list: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
      ...initState,
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(fetch, payload);
        yield put({
          type: 'save',
          payload: response.error ? defaultResponse : response,
        });
      },
      ...effects,
    },

    reducers: {
      save(state, { payload }) {
        return {
          ...state,
          data: {
            list: payload.content || [],
            pagination: {
              current: (payload.number || 0) + 1,
              pageSize: payload.size,
              total: payload.totalElements,
            },
          },
        };
      },
      ...reducers,
    },
  };
}
