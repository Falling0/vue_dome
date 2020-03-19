// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/style.css'
// 导入element-ui组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios插件
import myaxios from '@/assets/js/myaxios.js'

// 引入axios插件
Vue.use(myaxios)
// 引入vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
