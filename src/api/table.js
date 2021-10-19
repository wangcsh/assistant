import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
export function getPage(data) {
  return request({
    url: '/user/page',
    method: 'POST',
    data: data
  })
}
export function getAllDepartmentList() {
  return request({
    url: '/user/department',
    method: 'get'
  })
}
