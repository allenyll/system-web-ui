import request from '@/utils/request'

export function requestTree(query) {
  return request({
    url: '/menu/getAllMenu',
    method: 'get',
    params: query
  })
}

export function getMenuTree(type) {
  return request({
    url: '/menu/getMenuTree?type=' + type,
    method: 'get'
  })
}

export function requestAll() {
  return request({
    url: '/menu/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/menu/addMenu',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function delObj(id, obj) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/menu/' + id,
    method: 'put',
    data: obj
  })
}
