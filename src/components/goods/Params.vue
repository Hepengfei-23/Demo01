<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="参数列表"></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selecedKeys" :options="cateList" :props="cateProps"
          @change="handleChange"></el-cascader>
          <!-- tab标签 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 动态参数 -->
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible=true">添加参数</el-button>
              <el-table :data="manyTableData"  border stripe>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="序号" ></el-table-column>
                <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                <el-table-column  label="操作" >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 静态属性 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible=true">添加属性</el-button>
              <el-table :data="onlyTableData"  border stripe>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="序号" ></el-table-column>
                <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
                <el-table-column  label="操作" >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      selecedKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      isDisabled: true,
      cateId: 0,
      tableData: [],
      manyTableData: [],
      onlyTableData: [],
      // 控制添加对话框
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      // 修改的数据
      editForm: {
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateList () {
      this.cateList = await this.$PM.httpGet('categories', {}, 200)
    },
    async handleChange () {
      // 根据级联选择器是否已选择来决定添加按钮的禁用开启
      if (this.selecedKeys.length > 0) this.isDisabled = false
      // 获取到当前选择到的分类id
      this.cateId = this.selecedKeys[this.selecedKeys.length - 1]
      this.getParamsData()
    },
    async handleClick () {
      this.getParamsData()
    },
    async getParamsData () {
      this.tableData = await this.$PM.httpGet(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } }, 200)
      // 判断数据是动态参数还是静态属性，分别赋值
      if (this.activeName === 'many') {
        this.manyTableData = this.tableData
      } else {
        this.onlyTableData = this.tableData
      }
    },
    // 对话框关闭，清除数据
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 提交添加的数据
    addParams () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const params = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
        this.$PM.httpPost(`categories/${this.cateId}/attributes`, params, 201)
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 请求修改的数据
    async showEditDialog (id) {
      this.editForm = await this.$PM.httpGet(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      }, 200)
      this.editDialogVisible = true
    },
    // 参数修改后提交
    editParams () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$PM.httpPut(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName }, 200)
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    // 删除参数
    removeParams (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$PM.httpDelete(`categories/${this.cateId}/attributes/${id}`, {}, 200)
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-alert {
  width: 800px;
  margin-bottom: 15px;
}

.el-cascader {
  margin-left: 15px;
}
</style>
