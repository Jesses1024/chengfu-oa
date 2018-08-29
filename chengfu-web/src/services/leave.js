import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/leave/query?${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/leave/${id}`).then(res => ({
    ...res,
    name: `${res.name}-${res.deptName}`,
  }));
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/leave${isEdit ? `/${params.id}` : ''}`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

