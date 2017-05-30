import { config, request } from '../utils';
const { api } = config;
const { filetests } = api;

export function query(params) {
  return request({
    url: filetests,
    method: 'get',
    data: params,
  });
}

export function create(params) {
  return request({
    url: filetests,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: filetests,
    method: 'delete',
    data: params,
  });
}

export function update(params) {
  return request({
    url: filetests,
    method: 'put',
    data: params,
  });
}
