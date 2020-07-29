<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="商品分类"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 表格 -->
      <!--引入的第三方UI组件 -->
      <tree-table :data="cataList" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" >
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加商品分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader v-model="selecedKeys" :options="parentCateList" :props="cascaderProps"
          @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 数据请求查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      cataList: [],
      // 数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'isok'
        },
        {
          label: '排序',
          // 当前列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'order'
        },
        {
          label: '操作',
          // 当前列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        // 要添加的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 当前添加分类等级
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: 'true',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selecedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cataList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize 改变是事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值(即页面所处的页码)改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async showAddCateDialog () {
      // 先获取父级分类数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    // 选择项发生变化
    handleChange () {
      console.log(this.selecedKeys)
      if (this.selecedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selecedKeys[this.selecedKeys.length - 1]
        this.addCateForm.cat_level = this.selecedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
    },
    // 添加新的商品分类
    addCate () {
      this.$refs.addCateFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  }
}
</script>
<style lang='less' scoped>
.el-button {
  margin-bottom: 15px;
}
</style>
