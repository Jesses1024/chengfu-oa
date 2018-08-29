import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/attendance/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/attendance/${id}`);
}

export async function remove(id) {
  return request(`/api/attendance/${id}`, {
    method: 'DELETE',
  });
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/attendance${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}
