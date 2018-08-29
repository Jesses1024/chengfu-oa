// import qs from 'qs';
import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/inventory?${stringify(params)}`);
}
export async function getLogList(params) {
  return request(`/api/inventory/logs?${stringify(params)}`);
}

export async function editLimit(params) {
  return request('/api/inventory/limit', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function inventoryChange(params) {
  const p = { ...params };
  delete p.warehouse;
  delete p.goods;
  p.warehouseId = params.warehouse && params.warehouse.key;
  p.goodsId = params.goods && params.goods.key;
  return request('/api/inventory/change', {
    method: 'PUT',
    body: {
      ...p,
    },
  });
}

export async function batchInventoryChange(params) {
  const p = { ...params };
  delete p.changes;
  delete p.warehouse;
  delete p.goods;
  p.warehouseId = params.warehouse.key;
  p.goodsId = params.goods.key;
  const newChanges = params.changes.map(i => ({
    add: i.add,
    warehouseId: i.warehouse.key,
    goodsId: i.goods.key,
    number: i.number,
  }));

  newChanges.push({ ...p });
  return request('/api/inventory/batch/change', {
    method: 'PUT',
    body: {
      changes: newChanges,
    },
  });
}
