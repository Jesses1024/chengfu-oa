import { message } from 'antd';
import { createFormModel } from '../utils/models';
import * as ProjectsAPi from '../services/projects';

export default createFormModel({
  namespace: 'projectDetail',
  fetch: ProjectsAPi.getInfo,
  save: ProjectsAPi.save,
  redirectUrl: '/project/list',
}, {
  effects: {
    *save({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.save, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
      }
    },
    *saveContract({ payload }, { call }) {
      yield call(ProjectsAPi.save, payload);
    },
    *editStatus({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.editStatus, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
        yield message.success('操作成功');
      }
    },
    *savePlanPurchase({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.savePlanPurchase, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
      }
    },
    *saveVisitItem({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.saveVisitItem, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
      }
    },
    *saveNeedItem({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.saveNeedItem, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
      }
    },
    *saveAskItem({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.saveAskItem, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
      }
    },
    *savePurchaseOrder({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.savePurchaseOrder, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
      }
    },
    *editAuditStatus({ payload }, { call, put }) {
      const p = { ...payload };
      delete p.projectId;
      const res = yield call(ProjectsAPi.editAuditStatus, p);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.id,
        });
        yield message.success('操作成功');
      }
    },
    *productPurchase({ payload }, { call, put }) {
      const res = yield call(ProjectsAPi.productPurchase, payload);
      if (!res.error) {
        yield put({
          type: 'fetch',
          payload: payload.projectId,
        });
        yield message.success('操作成功');
      }
    },
  },
});
