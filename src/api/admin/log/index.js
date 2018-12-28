import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/sysLog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/sysLog/' + id,
    method: 'get'
  })
}

