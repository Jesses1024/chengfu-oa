import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/projects/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/projects/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/projects${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

export async function editStatus(params) { // 修改状态
  return request('/api/projects/updateStatus', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function savePlanPurchase(params) { // 保存计划购买项
  const { projectId } = params;
  return request(`/api/projects/purchase/item/${projectId}`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function saveVisitItem(params) { // 保存访问记录
  const { projectId } = params;
  return request(`/api/projects/visit/item/${projectId}`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function saveNeedItem(params) { // 保存特殊需求
  const { projectId } = params;
  return request(`/api/projects/need/item/${projectId}`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function saveAskItem(params) { // 保存询价单
  const { projectId } = params;
  return request(`/api/projects/ask/item/${projectId}`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function savePurchaseOrder(params) { // 保存采购单
  const { projectId } = params;
  return request(`/api/projects/purchase/order/${projectId}`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function editAuditStatus(params) { // 审核接口  报价、合同、需求、采购
  return request('/api/projects/audit', {
    method: 'PUT',
    body: { ...params },
  });
}

export async function productPurchase({ id, projectId }) {
  return request(`/api/projects/purchase/order/${projectId}/build/${id}`, {
    method: 'POST',
  });
}
