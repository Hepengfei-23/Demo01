import Vue from 'vue'
// 在开启ESlint严格检查的情况下，需要把导入的所有ui写在一起，若未开启ESlint则可以分开多次import导入
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn, Switch, Tooltip, Pagination, Dialog,
  MessageBox, Tag, Tree, Select, Option, Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
// 通过原型链全局挂载为Vue属性，$message为属性名
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
