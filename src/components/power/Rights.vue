<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="权限管理" title2="权限列表"></breadcrumb>
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <!-- 用v-if来判断权限等级，符合对应等级的tag视图才会显示 -->
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      this.rightList = await this.$PM.httpGet('rights/list', {}, 200)
    }
  }
}
</script>
<style lang='less' scoped>
</style>
