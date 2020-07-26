import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/CSS/global.css'
// 导入字体图标CSS
import './assets/fonts/iconfont.css'
import axios from 'axios'
import store from './store'
// 配置请求的更路径，由后台服务端提供
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器添加token值，来保证获取数据（使用部分API接口）的权限管理
axios.interceptors.request.use(config => {
  // config是请求对象，该对象中有headers属性
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 将axios挂载再Vue对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
