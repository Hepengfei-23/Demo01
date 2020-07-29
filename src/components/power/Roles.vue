<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="权限管理" title2="角色列表"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
    </el-card>
    <!-- 角色列表区域 -->
    <el-table  :data="rolesList" border stripe>
      <el-table-column label="展开" type="expand">
        <!-- 展开列 -->
        <template slot-scope="scope">
          <!-- 通过三元表达式判断若为第一个则添加top边框 -->
          <el-row :class="['bdbottom','vcenter',index1 === 0 ? 'bdtop' : '']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- for循环 嵌套渲染二级权限-->
              <el-row :class="[index2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="19" >
                  <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                  {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="reviseDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeRolesById(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 添加内容表单区 -->
      <el-form :model="addForm" :rules="rolesFormRules" ref="addFormRef" label-width="70px" status-icon>
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="reviseDialogVisible" width="50%" >
      <el-form :model="reviseForm" :rules="rolesFormRules" ref="reviseFormRef" label-width="70px">
        <el-form-item label="角色名称"  prop="roleName" label-width="100px">
          <el-input v-model="reviseForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="reviseForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviseRoles" >确 定</el-button>
      </span>
    </el-dialog >
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :props="treeProps" :data="rightList" show-checkbox node-key="id"
      :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 获取到的所有角色数据列表
      rolesList: [],
      // 获取到的所有权限数据列表
      rightList: [],
      // 当前角色id
      roleId: '',
      addDialogVisible: false,
      reviseDialogVisible: false,
      setRightDialogVisible: false,
      // 添加的角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      reviseForm: {},
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 24, message: '长度在 3 到 24 个字符', trigger: 'blur' }
        ]
      },
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树形权限中被默认被选中的节点ID值
      defKeys: []
    }
  },
  created () {
    // 向服务器请求角色数据
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      this.rolesList = await this.$PM.httpGet('roles', {}, 200)
    },
    // 根据选择修改用户的id去请求该用户的数据，并储存该数据
    async reviseDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('用户添加失败!')
      }
      // 注意根据API文档，此时返回的响应数据中是roleId，不是id，因此后面提交数据时应写roleId
      this.reviseForm = res.data
      this.reviseDialogVisible = true
    },
    // 添加角色对话框关闭后，将对话框表单内数据清除
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('用户添加失败!')
        }
        this.$message.success('用户添加成功!')
        // 提交成功后对话框隐藏
        this.addDialogVisible = false
        // 在重新获取用户数据列表s
        this.getRolesList()
      })
    },
    // 编辑角色
    reviseRoles () {
      this.$refs.reviseFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.reviseForm.roleId, {
          roleName: this.reviseForm.roleName,
          roleDesc: this.reviseForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('用户修改失败!')
        }
        this.$message.success('用户修改成功!')
        this.reviseDialogVisible = false
        this.getRolesList()
      })
    },
    // 删除角色
    async  removeRolesById (id) {
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
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('用户修改失败!')
        }
        this.$message.success('用户修改成功!')
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据id删除对应权限  接受形参：role对象和要删除的权限id
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('用户修改失败!')
        }
        // 根据API文档，本次响应数据中data是当前角色下最新的权限数据，所以直接将data赋值给children即可
        // 若使用 this.getRolesList() 则会重新请求整个页面数据，当前打开项会被关闭
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配权限
    async showSetRightDialog (role) {
      // 得到角色id
      this.roleId = role.id
      // 因为权限数据在web中的展示形式为树形结构，所以在请求当中使用tree，响应tree型数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('权限获取失败!')
      }
      this.rightList = res.data
      // 将之前打开过的角色权限节点id从defKeys中清除，防止影响本次权限节点的显示
      this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 用递归获取角色的所有三级权限的id，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前的node节点不包含children属性，则为三级节点，那么就添加节点id至arr数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    async allotRights () {
      const keys = [
        // 返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // rids为APP接口规定的请求体
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('权限添加失败!')
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
