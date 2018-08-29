import { stringify } from '../utils/utils';
import request from '../utils/request';

export async function getList(params) {
  return request(`/api/sys/orgs?type=Port&${stringify(params)}`);
}

export async function getInfo(id) {
  return request(`/api/sys/orgs/${id}?type=Port`);
}

export async function save(params) {
  const isEdit = Boolean(params.id);
  return request(`/api/sys/orgs${isEdit ? `/${params.id}` : ''}?type=Port`, {
    method: `${isEdit ? 'PUT' : 'POST'}`,
    body: {
      ...params,
    },
  });
}

export async function tooglePort(params) {
  return request(`/api/sys/orgs/${params.id}/${params.type ? 'disable' : 'enable'}?type=Port`, {
    method: 'PUT',
  });
}
