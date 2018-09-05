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

// 提现拒绝
export function refuse(params) {
  return request({
    url: '/backend/wallet/withdraw/refuse',
    method: 'post',
    params: params
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
    url: '/backend/homepage/netred/page',
    method: 'get',
    params: params
  })
}

// 编辑网红列表
export function editNetred(params) {
  return request({
    url: '/backend/homepage/netred/update',
    method: 'post',
    data: params
  })
}

// 网红列表上下架
export function uplisting(status, params) {
  return request({
    url: '/backend/homepage/netred/' + status,
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

// 投票项目编辑
export function eidtVote(params) {
  return request({
    url: '/backend/project/update',
    method: 'post',
    data: params
  })
}

// 获取轮播分类
export function getClassifyList(params) {
  return request({
    url: '/backend/banner/category/list',
    method: 'get',
    params: params
  })
}

// 获取轮播图列表
export function getBannerList(params) {
  return request({
    url: '/backend/banner/list',
    method: 'get',
    params: params
  })
}

// 轮播图信息保存
export function saveBanner(params) {
  return request({
    url: '/backend/banner/save',
    method: 'post',
    data: params
  })
}

// 轮播图信息更新
export function updateBanner(params) {
  return request({
    url: '/backend/banner/update',
    method: 'post',
    data: params
  })
}

// 轮播图删除
export function deleteBanner(params) {
  return request({
    url: '/backend/banner/delete',
    method: 'post',
    data: params
  })
}

// 项目锁
export function lockProject(params) {
  return request({
    url: '/api/project/lock',
    method: 'post',
    data: params
  })
}

// PK模板村粗
export function modelSave(params) {
  return request({
    url: '/backend/pkModel/save',
    method: 'post',
    data: params
  })
}

// PK模板修改
export function updateModel(params) {
  return request({
    url: '/backend/pkModel/update',
    method: 'post',
    data: params
  })
}

// 获取轮播图列表
export function getModel(params) {
  return request({
    url: 'backend/pkModel/page',
    method: 'get',
    params: params
  })
}

// 红包模板列表
export function hbModelList(params) {
  return request({
    url: '/backend/redPacket/model/page',
    method: 'get',
    params: params
  })
}

// 红包列表
export function hblList(params) {
  return request({
    url: '/backend/redPacket/page',
    method: 'get',
    params: params
  })
}

// 用户网红接口
export function redSearch(params) {
  return request({
    url: '/backend/user/search',
    method: 'get',
    params: params
  })
}

// 红包模板修改
export function updateHbModel(params) {
  return request({
    url: 'backend/redPacket/model/save',
    method: 'post',
    data: params
  })
}

// 周数据
export function weekData(params) {
  return request({
    url: 'backend/forecast/weekBazaar',
    method: 'get',
    params: params
  })
}

//fomo模板列表
export function fomoModel(params) {
  return request({
    url: '/backend/fomo/template/page',
    method: 'get',
    params: params
  })
}

//保存fomo模板
export function fomoSave(params) {
  return request({
    url: '/backend/fomo/template/save',
    method: 'post',
    data: params
  })
}

