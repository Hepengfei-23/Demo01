<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{title1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{title2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  // props接受父组件参数
  props: ['title1', 'title2']
}
</script>
<style lang='less' scoped>
</style>
