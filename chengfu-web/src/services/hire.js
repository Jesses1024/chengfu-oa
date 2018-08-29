import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/employees/query?isDirectlyJoin=false&${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/employees/${id}`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/employees${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

