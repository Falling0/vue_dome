/* eslint-disable camelcase */
/*
封装axios插件
*/

import axios from 'axios'

var myaxios = {}

myaxios.install = function (Vue) {
  // 设置axios请求的URL，此后axios发送的请求全部执行本地址
  // eslint-disable-next-line camelcase
  var axios_obj = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    headers: { Authorization: window.localStorage.getItem('token') }
  })
  // 将设置好的axios对象赋值给Vue实例的原型
  // 之后可以在Vue中直接只用 this.$myHttp 使用axios发送请求
  Vue.prototype.$myHttp = axios_obj
}

export default myaxios
