<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登入表单 -->
      <!-- 通过v-model双向绑定表单数据，先绑定数据对象，在绑定数据对象的属性'username'和'password' -->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- 通过添加属性的方式导入字体图标 -->
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        // 数据对象的属性
        username: '',
        password: ''
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          // 用户名验证规则：required--用户名不能为空，若为空则显示message提示文本，trigger--验证触发事件
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击触发重置表单
    resetLoginForm () {
      // 给表单元素添加ref属性，通过该属性得到表单是实例化对象，再调用Element封装的resetFields方法重置表单数据，其中this是该组件对象
      // 再原生js中是没有resetFields方法的，所以不能使用原生js中获取元素的方式来调用该封装函数
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 调用Element封装的validate方法，对表单数据进行验证，该函数参数为一个回调函数  Function(callback: Function(boolean, object))
      this.$refs.loginFormRef.validate(async valid => {
        // 若valid为flase，则直接返回
        if (!valid) return
        // 根据后台登录验证接口说明发起对应请求，loginForm为数据对象，包含了username和password数据
        // { data：res}是对返回的数据进行解构，只要data数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 根据后台登录验证接口说明 当meta中的status为200时是登录成功
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        // 使用了Element UI中的Message弹出提示，将Message挂载为Vue自定义原型属性，通过this来使用
        this.$message.success('登录成功')
        // 1.将登录成功后的token（登录令牌）保存到客户端的sessionStorage（单页面应用有效）中
        //  在项目中部分API接口必须在登录成功之后才有权限使用，此时需要token
        // 通过编程式导航跳转至后台主页，路由地址为 /home
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

// scoped 使得样式只在当前组件中生效
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  // 将盒子对应方向移动自身长宽的50%，使得盒子在页面居中,在CSS中y轴方向与数学中相反，向下为正轴
  transform: translate(-50%, -50%);
}

.avater_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  // 外边框加阴影
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  //改为CSS3盒子模型，不会将子元素挤出父盒子
  box-sizing: border-box;
}

.btns {
  // 变为弹性盒子
  display: flex;
  // 盒子在主轴（横轴）方向上的对齐方式
  justify-content: flex-end;
}
</style>
