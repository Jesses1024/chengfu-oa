import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/sys/goods?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/sys/goods/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/sys/goods${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}
