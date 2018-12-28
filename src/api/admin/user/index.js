import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function getDepotObj(id) {
  return request({
    url: '/depot/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data: obj
  })
}

export function getRoleList(id) {
  return request({
    url: '/role/getRoleList/' + id,
    method: 'get'
  })
}

export function setRoles(id, obj) {
  return request({
    url: '/user/setRoles',
    method: 'post',
    data: {
      'ids': obj,
      'id': id
    }
  })
}

