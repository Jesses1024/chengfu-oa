import request from '../utils/request';
import { stringify } from '../utils/utils';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function checkPassword(params) {
  return request('/api/currentUser/password', {
    method: 'PUT',
    body: params,
  });
}

export async function getList(params) {
  return request(`/api/users/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/users/${id}`);
}

export async function saveUser(params) {
  const { isEdit } = params;
  const saveParams = { ...params };
  delete saveParams.isEdit;
  return request(`/api/users${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...saveParams,
    },
  });
}

export async function toogleUser(params) {
  return request(`/api/users/${params.id}/toggle`, {
    method: 'PUT',
  });
}
