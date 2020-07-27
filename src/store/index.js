import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 用于存放全局的数据
  state: {
  },
  // 可以起到组件中computed计算属性的作用，Getter 接收state为第一参数，会暴露为 store.getters 对象，你可以以属性的形式访问这些值
  getters: {
  },
  // mutation类似于组件中的methods，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  // 只能用于同步处理，异步使用actions
  mutations: {
  },
  // Action 提交的是 mutation，而不是直接变更状态
  // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
  actions: {
  },
  modules: {
  }
})
