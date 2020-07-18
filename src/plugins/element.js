import Vue from 'vue'
// 在开启ESlint严格检查的情况下，需要把导入的所有ui写在一起，若未开启ESlint则可以分开多次import导入
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将Message通过原型链全局挂载为Vue属性，$message为属性名
Vue.prototype.$message = Message
