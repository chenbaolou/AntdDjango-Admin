import { request } from './';

export async function asyncquery(requrl, params) {
  return request({
    url: requrl,
    method: 'get',
    data: params,
  });
}

export async function asynccreate(requrl, params) {
  return request({
    url: requrl,
    method: 'post',
    data: params,
  });
}

export async function asyncremove(requrl, params) {
  return request({
    url: requrl,
    method: 'delete',
    data: params,
  });
}

export async function asyncupdate(requrl, params) {
  return request({
    url: requrl,
    method: 'put',
    data: params,
  });
}
