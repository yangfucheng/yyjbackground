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

//项目提前结束下注
export function breakShort(params) {
  return request({
    url: '/backend/project/breakShort',
    method: 'post',
    data: params
  })
}
//项目提前结束
export function cancel(params) {
  return request({
    url: '/backend/project/cancel',
    method: 'post',
    data: params
  })
}
//修改项目权重
export function updateWeight(params) {
  return request({
    url: '/backend/project/updateWeight',
    method: 'post',
    data: params
  })
}

//获取钱包列表
export function getCoin(params) {
  return request({
    url: '/app/user/walletList',
    method: 'get',
    data: params
  })
}

//空投
export function airdrop(params) {
  return request({
    url: '/backend/wallet/update',
    method: 'post',
    data: params
  })
}

//提现列表
export function withdrawList(params) {
  return request({
    url: '/backend/wallet/withdrawList',
    method: 'get',
    params: params
  })
}

//一键审核
export function allCheck(params) {
  return request({
    url: '/backend/wallet/withdraw/checkAll',
    method: 'post',
    data: params
  })
}

//批量审核
export function batchCheck(params) {
  return request({
    url: '/backend/wallet/withdraw/check',
    method: 'post',
    data: params
  })
}




