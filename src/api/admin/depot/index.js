import request from '@/utils/request'

export function requestTree(query) {
  return request({
    url: '/depot/getAllDepot',
    method: 'get',
    params: query
  })
}

export function getDepotTree() {
  return request({
    url: '/depot/getDepotTree',
    method: 'get'
  })
}

export function requestAll() {
  return request({
    url: '/depot/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/depot/addDepot',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/depot/' + id,
    method: 'get'
  })
}

export function delObj(id, obj) {
  return request({
    url: '/depot/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/depot/' + id,
    method: 'put',
    data: obj
  })
}
