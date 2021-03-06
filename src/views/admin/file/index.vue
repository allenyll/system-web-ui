<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="fileManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_file_id">
        <template scope="scope">
          <span>{{ scope.row.pkFileId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="外键Id">
        <template scope="scope">
          <span>{{ scope.row.fkId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="文件类型">
        <template scope="scope">
          <span>{{ scope.row.fileType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="文件路径">
        <template scope="scope">
          <span>{{ scope.row.fileUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template scope="scope">
          <el-button v-if="fileManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="fileManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="外键Id" prop="fkId">
          <el-input v-model="form.fkId" placeholder="请输入外键Id"/>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-input v-model="form.fileType" placeholder="请输入文件类型"/>
        </el-form-item>
        <el-form-item label="文件路径" prop="fileUrl">
          <el-input v-model="form.fileUrl" placeholder="请输入文件路径"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/system/file/index'
import { mapGetters } from 'vuex'
export default {
  name: 'File',
  data() {
    return {
      form: {
        fkId: undefined,
        fileType: undefined,
        fileUrl: undefined,
        remark: undefined
      },
      rules: {
        fkId: [
          {
            required: true,
            message: '请输入外键Id',
            trigger: 'blur'
          }
        ], fileType: [
          {
            required: true,
            message: '请输入文件类型',
            trigger: 'blur'
          }
        ], fileUrl: [
          {
            required: true,
            message: '请输入文件路径',
            trigger: 'blur'
          }
        ], remark: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      fileManager_btn_edit: false,
      fileManager_btn_del: false,
      fileManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.fileManager_btn_edit = this.elements['system:file:edit']
    this.fileManager_btn_del = this.elements['system:file:delete']
    this.fileManager_btn_add = this.elements['system:file:add']
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
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
      getObj(row.pkFileId).then(response => {
        this.form = response.data.obj
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.pkFileId)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
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
      const set = this.$refs
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.pkFileId, this.form).then(() => {
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
    resetTemp() {
      this.form = {
        fkId: undefined,
        fileType: undefined,
        fileUrl: undefined,
        remark: undefined
      }
    }
  }
}
</script>
