import request from '@/utils/request'

const path = '/system-web/category/'

export function tree(query) {
  return request({
    url: path + 'tree',
    method: 'get',
    params: query
  })
}

export function categoryTree() {
  return request({
    url: path + 'categoryTree',
    method: 'get'
  })
}

export function getCategoryList() {
  return request({
    url: path + 'list',
    method: 'post'
  })
}

export function page(query) {
  return request({
    url: path + 'page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: path + 'add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: path + id,
    method: 'get'
  })
}

export function delObj(id, obj) {
  return request({
    url: path + id,
    method: 'delete',
    params: {
      eq_pk_category_id: id
    }
  })
}

export function putObj(id, obj) {
  return request({
    url: path + id,
    method: 'put',
    data: obj
  })
}
