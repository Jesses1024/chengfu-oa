import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/groups/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/groups/${id}`);
}

export async function toogleDept(params) {
  return request(`/api/groups/${params.id}/toggle`, {
    method: 'PUT',
  });
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/groups${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

