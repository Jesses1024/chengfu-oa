import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/contact/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/contact/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/contact${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}
