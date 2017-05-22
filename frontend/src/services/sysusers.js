import { config } from '../utils';
import { asynccreate, asyncremove, asyncupdate, asyncquery } from '../utils/services';
const { api } = config
const { sysusers } = api

export function query(params) {
  return asyncquery(sysusers, params);
}

export function create(params) {
  return asynccreate(sysusers, params);
}

export function remove(params) {
  return asyncremove(sysusers, params);
}

export function update(params) {
  return asyncupdate(sysusers, params);
}
