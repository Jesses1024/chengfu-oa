import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/position/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/position/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/position${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

export async function toggleDisable(params) {
  return request(`/api/position/${params.id}/toggle`, {
    method: 'PUT',
  });
}
