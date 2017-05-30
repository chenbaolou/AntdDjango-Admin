import { config, request } from '../utils';

export function removeFile(params) {
  return request({
    url: config.api.common.upload,
    method: 'delete',
    data: params,
  });
}

