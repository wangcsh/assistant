import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUserNameInfo(param) {
  return request({
    url: '/oa/get',
    method: 'post',
    data: param
  })
}

export function syncNewPerson(param) {
  return request({
    url: '/oa/sync',
    method: 'post',
    data: param
  })
}
export function getRecord(param) {
  return request({
    url: '/oa/record',
    method: 'post',
    data: param
  })
}
