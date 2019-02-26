<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.customerName" style="width: 200px;" class="filter-item" placeholder="姓名" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.customerAccount" style="width: 200px;" class="filter-item" placeholder="账户" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" style="width: 200px;" class="filter-item" placeholder="手机号" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="customerManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="ID">
        <template scope="scope">
          <span>{{ scope.row.pkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户">
        <template scope="scope">
          <span>{{ scope.row.customerAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{ scope.row.statusName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template scope="scope">
          <span>{{ scope.row.genderName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300"> 
        <template scope="scope">
            <el-button v-if="customerManager_btn_edit" size="small" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button v-if="customerManager_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
            </el-button>
        </template> 
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="账户" prop="customerAccount">
          <el-input v-if="dialogStatus == 'create'" v-model="form.customerAccount" placeholder="请输入账户"/>
          <el-input v-else v-model="form.customerAccount" placeholder="请输入账户" readonly/>
        </el-form-item>
        <el-form-item label="状态" placeholder="请选择状态" prop="status">
          <el-radio v-model="form.status" label="SW0001">启用</el-radio>
          <el-radio v-model="form.status" label="SW0002">冻结</el-radio>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/customer/customer/index'
import { getDepotTree } from '@/api/admin/depot/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Customer',
  data() {
    return {
      form: {
        customerName: undefined,
        customerAccount: undefined,
        nickName: undefined,
        gender: '男',
        phone: undefined,
        email: undefined,
        status: 'SW0001'
      },
      rules: {
        customerName: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        customerAccount: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      show: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        customerName: '',
        status: '',
        customerAccount: '',
        phone: ''
      },
      sexOptions: [
        {
          'name': '男',
          'value': 'SW0201'
        },
        {
          'name': '女',
          'value': 'SW0202'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      customerManager_btn_edit: false,
      customerManager_btn_del: false,
      customerManager_btn_add: false,
      customerManager_btn_config_role: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      configCustomerId: ''
    }
  },
  watch: {
  },
  created() {
    this.getList()
    this.customerManager_btn_edit = this.elements['customer:customer:edit']
    this.customerManager_btn_del = this.elements['customer:customer:delete']
    this.customerManager_btn_add = this.elements['customer:customer:add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.pkCustomerId)
        .then(response => {
          this.form = response.data.customer
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.pkCustomerId)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
        })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.pkCustomerId, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.form = {
        customerName: undefined,
        customerAccount: undefined,
        nickName: undefined,
        gender: '男',
        phone: undefined,
        email: undefined,
        status: 'SW0001'
      }
    }
  }
}
</script>
