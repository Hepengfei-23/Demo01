<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input></el-col>
          <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row对象即一整行的数据对象 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="reviseDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 内容表单区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="reviseDialogVisible" width="50%">
      <!-- 内容表单区 -->
      <el-form :model="reviseForm" :rules="reviseFormRules" ref="reviseFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="reviseForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  prop="email">
          <el-input v-model="reviseForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="reviseForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviseUser" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱的自定义规则
    const checkEmail = (rule, value, callBack) => {
      // 正则表达式验证邮箱
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callBack()
      }
      callBack(new Error('请输入合法的邮箱'))
    }
    // 验证手机的自定义规则
    const checkMobile = (rule, value, callBack) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callBack()
      }
      callBack(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框是否显示
      addDialogVisible: false,
      // 控制修改用户对话框是否显示
      reviseDialogVisible: false,
      // 添加用户的表单数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      reviseForm: {
      },
      // 添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // validator添加自定义的验证规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户表单的验证规则
      reviseFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // validator添加自定义的验证规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 向服务器请求用户数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize 改变是事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值(即页面所处的页码)改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch 开关状态的改变
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // 事件触发时通过ref属性来获得表单对象，调用Element封装方法清除表单数据
      this.$refs.addFormRef.resetFields()
    },
    // 点击确认，添加新用户
    addUser () {
      // 表单提交之前进行预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('用户添加失败!')
        }
        this.$message.success('用户添加成功!')
        // 提交成功后对话框隐藏
        this.addDialogVisible = false
        // 在重新获取用户数据列表s
        this.getUserList()
      })
    },
    // 根据选择修改用户的id去请求该用户的数据，并储存该数据
    async reviseDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('用户添加失败!')
      }
      this.reviseForm = res.data
      this.reviseDialogVisible = true
    },
    // 修改用户信息并提交至服务器
    reviseUser () {
      this.$refs.reviseFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.reviseForm.id, {
          email: this.reviseForm.email,
          mobile: this.reviseForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('用户修改失败!')
        }
        this.$message.success('用户修改成功!')
        this.reviseDialogVisible = false
        this.getUserList()
      })
    },
    // 根据id删除指定的用户数据
    async  removeUserById (id) {
      // 以下代码根据Element中MessageBox弹框的确认消息代码进行二次加工
      //  confirm需要在element.js中进行全局挂载，才能作为方法来使用
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('用户修改失败!')
        }
        this.$message.success('用户修改成功!')
        this.getUserList()
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
</style>
