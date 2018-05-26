import request from '@/utils/request'

export function getManageList(params) {
  return request({
    url: '/backend/project/page',
    method: 'get',
    params: params
  })
}


export function savePro(params) {
  return request({
    url: '/backend/project/save',
    method: 'post',
    data: params
  })
}

export function online(params) {
  return request({
    url: '/backend/project/online',
    method: 'post',
    data: params
  })
}

export function detail(params) {
  return request({
    url: '/backend/project/detail',
    method: 'get',
    params: params
  })
}


export function check(params) {
  return request({
    url: '/backend/project/result/check',
    method: 'post',
    data: params
  })
}

export function result(params) {
  return request({
    url: '/backend/project/result',
    method: 'post',
    data: params
  })
}

