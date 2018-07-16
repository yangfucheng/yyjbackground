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
 
// 项目提前结束下注
export function breakShort(params) {
  return request({
    url: '/backend/project/breakShort',
    method: 'post',
    data: params
  })
}
// 项目提前结束
export function cancel(params) {
  return request({
    url: '/backend/project/cancel',
    method: 'post',
    data: params
  })
}
// 修改项目权重
export function updateWeight(params) {
  return request({
    url: '/backend/project/updateWeight',
    method: 'post',
    data: params
  })
}

// 获取钱包列表
export function getCoin(params) {
  return request({
    url: '/app/user/walletList',
    method: 'get',
    data: params
  })
}

// 空投
export function airdrop(params) {
  return request({
    url: '/backend/wallet/update',
    method: 'post',
    data: params
  })
}

// 提现列表
export function withdrawList(params) {
  return request({
    url: '/backend/wallet/withdrawList',
    method: 'get',
    params: params
  })
}

// 一键审核
export function allCheck(params) {
  return request({
    url: '/backend/wallet/withdraw/checkAll',
    method: 'post',
    data: params
  })
}

// 批量审核
export function batchCheck(params) {
  return request({
    url: '/backend/wallet/withdraw/check',
    method: 'post',
    data: params
  })
}

// 搜索评论
export function searchComment(params) {
  return request({
    url: '/backend/project/comment/search',
    method: 'get',
    params: params
  })
}

// 搜索回复
export function searchReply(params) {
  return request({
    url: '/backend/project/reply/search',
    method: 'get',
    params: params
  })
}

// 删除评论
export function deleteComment(params) {
  return request({
    url: '/backend/project/comment/delete/'+params,
    method: 'get',
    params: params
  })
}

// 删除回复
export function deleteReply(params) {
  return request({
    url: '/backend/project/reply/delete/'+params,
    method: 'get',
    params: params
  })
}

// 新增网红
export function addNetred(params) {
  return request({
    url: '/backend/homepage/netred',
    method: 'post',
    data: params
  })
}

// 获取网红列表
export function getNetred(params) {
  return request({
    url: '/backend/homepage/netred',
    method: 'get',
    params: params
  })
}

// 编辑网红列表
export function editNetred(params) {
  return request({
    url: '/backend/homepage/homepage/description',
    method: 'post',
    data: params
  })
}

// 网红列表上下架
export function uplisting(status, params) {
  return request({
    url: '/backend/homepage/homepage/netred/' + status,
    method: 'get',
    params: params
  })
}

// 投票项目审核
export function checkVote(params) {
  return request({
    url: '/backend/project/check',
    method: 'post',
    data: params
  })
}