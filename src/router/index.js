import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件路由
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 路由规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // 路由重新定向
    redirect: '/welcome',
    // 子路由组件，显示在home组件中
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to表示将要访问的路径 from表示从那个路径跳转而来  next是一个函数，代表放行可跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
