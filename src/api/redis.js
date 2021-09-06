import request from '@/utils/request'

export function redis(method) {
  return request({
    url: '/redis/' + (method || 'm'),
    method: 'get'
  })
}

export function scan(method, params) {
  return request({
    url: '/redis/' + method,
    method: 'get',
    params
  })
}

export function common(key, data) {
  return request({
    url: '/redis/abc/' + key,
    method: 'get',
    params: data
  })
}

export function commonHistory(key, data) {
  return request({
    url: key,
    method: 'get',
    params: data
  })
}
