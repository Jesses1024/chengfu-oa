import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/shelf/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/shelf/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/shelf${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

export async function toggleDisable(params) {
  return request(`/api/shelf/${params.id}/toggle`, {
    method: 'PUT',
  });
}
