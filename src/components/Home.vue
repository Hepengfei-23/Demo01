<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/mi-logo.png" alt="">
        <span>电商后台管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- active-text-color 是选中标签的字体颜色;unique-opened是Element提供的属性，可以只保持一个子菜单的展开-->
        <!-- collapse是Element提供的属性用于是否水平折叠收起菜单，collapse-transition则是是否开启折叠动画  router开启路由链接-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened
        :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- v-for循环渲染，将index绑定，使得各一级菜单index不同，得以分离 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 动态绑定字体图标，根据item.id去查找对应的字体图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本内容 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 二次循环item中的children   index作为路由跳转地址-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <!-- 复用了一级菜单的内容格式 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 定义数组接受侧边栏数据，用于渲染页面
      menuList: [],
      // 创建字体图标对象，根据不同一级菜单的id和字体图标形成键值对
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的
      activePath: ''
    }
  },
  // 生命周期函数，页面加载就开始执行
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出账户，返回登录页面
    logout () {
      // 清除token值
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      this.menuList = await this.$PM.httpGet('menus', {}, 200)
    },
    // 侧边栏的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
// 在Element UI中标签名也是class类名
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #FFF;
  text-align: center;
  // 字符间距
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
