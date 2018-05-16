import request from '@/utils/request'
// import axios from 'axios';
// var instance = axios.create({
//   // withCredentials: true,
//   // headers:{'Content-Type':'application/x-www-form-urlencoded'},
//   headers: {'X-Requested-With':'XMLHttpRequest'}
//   // baseURL: 'http://localhost:8080'
// });
export function login(params) {
  return request({
    url: '/backend/login',
    method: 'post',
    data: params
  })
}

export function loginOut() {
  return request({
    url: '/backend/signOut',
    method: 'post'
  })
}

export function getImage() {
	return request({
		url: '/backend/captcha/image',
    	method: 'get',
	})
}



