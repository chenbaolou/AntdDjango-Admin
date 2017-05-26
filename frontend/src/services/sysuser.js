import { config, request } from '../utils';
const { api } = config
const { sysusers } = api

export function query(params) {
  return request({
    url: sysusers,
    method: 'get',
    data: params,
  });
}

export function create(params) {
  return request({
    url: sysusers,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: sysusers,
    method: 'delete',
    data: params,
  });
}

export function update(params) {
  return request({
    url: sysusers,
    method: 'put',
    data: params,
  });
}

export function checkName(username, params) {
  let queryStr = '';
  if (params.id) {
    queryStr = `?id=${params.id}`;
  }
  return request({
    url: `${sysusers}/${username}${queryStr}`,
    method: 'head',
    data: params,
  });
}

export function setGroup(groupIds, params) {
  return request({
    url: `${sysusers}/${groupIds}`,
    method: 'put',
    data: params,
  });
}
