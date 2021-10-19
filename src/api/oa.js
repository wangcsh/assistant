import request from '@/utils/requestDefine'

// http://oa.auto-link.com.cn/admin/public/stafflogin
export function login(data) {
  return request({
    url: '/admin/public/stafflogin',
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
