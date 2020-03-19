import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// 路由懒加载（打包的时候通过拆分js文件来加速浏览器的加载）
const Home = () => import('@/components/home/home')
const Login = () => import('@/components/login/login')
const Users = () => import('@/components/users/users')
const Rights = () => import('@/components/rights/rights')
const Roles = () => import('@/components/roles/roles')

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

var route = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {path: '/users', name: 'Users', component: Users},
        {path: '/rights', name: 'Rights', component: Rights},
        {path: '/roles', name: 'Roles', component: Roles}
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

// 导航守卫
route.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next()
  } else {
    var token = localStorage.getItem('token')
    if (!token) {
      next({name: 'Login'})
    } else {
      next()
    }
  }
})

export default route;