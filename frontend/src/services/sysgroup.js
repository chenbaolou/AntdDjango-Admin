import { config, request } from '../utils';
const { api } = config
const { sysgroups } = api

export function query(params) {
  return request({
    url: sysgroups,
    method: 'get',
    data: params,
  });
}

export function create(params) {
  return request({
    url: sysgroups,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: sysgroups,
    method: 'delete',
    data: params,
  });
}

export function update(params) {
  return request({
    url: sysgroups,
    method: 'put',
    data: params,
  });
}

export function checkName(name, params) {
  let queryStr = '';
  if (params.id) {
    queryStr = `?id=${params.id}`;
  }
  return request({
    url: `${sysgroups}/${name}${queryStr}`,
    method: 'head',
    data: params,
  });
}
