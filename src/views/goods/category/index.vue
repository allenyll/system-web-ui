<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="categoryManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <tree-table :data="treeData" :columns="columns" border>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="categoryManager_btn_edit" size="small" icon="el-icon-edit" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="categoryManager_btn_del" size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="分类名称" prop="categoryName">
              <el-input v-model="form.categoryName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="分类编码" prop="categoryNo">
              <el-input v-model="form.categoryNo" placeholder="请输入分类编码"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" placeholder="请选择父节点" prop="parentCategoryName">
              <el-input v-model="form.parentCategoryName" style="width:75%; float:left;"/>
              <el-button style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogCategoryVisible = true">上级分类</el-button>
            </el-form-item>
            <el-form-item label="父级分类" prop="parentId" v-if="parentCategoryId">
              <el-input v-model="form.parentId" placeholder="请输入父级id"></el-input>
            </el-form-item>
            <el-form-item label="层级" prop="categoryLevel">
              <el-input v-model="form.categoryLevel" placeholder="请输入层级"></el-input>
            </el-form-item>
            <el-form-item label="顺序" prop="categorySeq">
              <el-input v-model="form.categorySeq" placeholder="请输入顺序"></el-input>
            </el-form-item>
            <el-form-item label="是否最有一层" prop="isDefault">
              <el-radio v-model="form.isEnd" label="SW1001">是</el-radio>
              <el-radio v-model="form.isEnd" label="SW1002">否</el-radio>
            </el-form-item>
            <el-form-item label="是否启用" prop="isUsed">
              <el-radio v-model="form.isUsed" label="SW1301">停用</el-radio>
              <el-radio v-model="form.isUsed" label="SW1302">启用</el-radio>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="form.description" placeholder="请输入描述"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogCategoryVisible" title="商品分类" width="24%">
      <el-row style="margin:0 auto;">
        <el-col :span="15" style="margin-left:30px;">
          <el-input v-model="filterCategoryText" placeholder="输入关键字过滤" style="margin-bottom:15px;"/>
          <el-tree ref="categoryTree" :data="categoryTreeData" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" node-key="id" highlight-current show-checkbox default-expand-all check-strictly/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleCategory">取 消</el-button>
        <el-button type="primary" @click="configCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import { tree, page, addObj, getObj, delObj, putObj, list, categoryTree} from '@/api/goods/category/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'category',
    components: { treeTable },
    data() {
      return {
        columns: [
          {
            text: '分类名称',
            value: 'name'
          },
          {
            text: '分类编码',
            value: 'code'
          },
          {
            text: '层级',
            value: 'level'
          },
          {
            text: '是否启用',
            value: 'isUsed'
          }
        ],
        form: {
          categoryNo : undefined,
          categoryName : undefined,
          parentId : undefined,
          categoryLevel : undefined,
          description : undefined,
          categorySeq : undefined,
          isEnd : undefined,
          isUsed : undefined,
          parentCategoryName : undefined
        },
        rules: {
          categoryNo: [
            {
              required: true,
              message: '请输入分类编码',
              trigger: 'blur'
            }
          ],           
          categoryName: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            }
          ],           
          parentId: [
            {
              required: true,
              message: '请输入父级id',
              trigger: 'blur'
            }
          ],           
          categoryLevel: [
            {
              required: true,
              message: '请输入层级',
              trigger: 'blur'
            }
          ],           
          categorySeq: [
            {
              required: true,
              message: '请输入顺序',
              trigger: 'blur'
            }
          ],        
          isUsed: [
            {
              required: true,
              message: '请输入是否启用',
              trigger: 'blur'
            }
          ],
          parentCategoryName: [
          {
            required: true,
            message: '请选择上级分类',
            trigger: 'blur'
          }
        ]        
        },
        treeData: [],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        parentOptions: [],
        dialogFormVisible: false,
        dialogCategoryVisible:false,
        dialogStatus: '',
        categoryManager_btn_edit: false,
        categoryManager_btn_del: false,
        categoryManager_btn_add: false,
        parentCategoryId: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        show: false,
        nameMap:{},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterCategoryText: '',
        categoryTreeData: []
      }
    },
    created() {
      this.getList();
      this.getCategoryTree();
      this.categoryManager_btn_edit = this.elements['goods:category:edit'];
      this.categoryManager_btn_del = this.elements['goods:category:delete'];
      this.categoryManager_btn_add = this.elements['goods:category:add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      convert: function(){
        return this.nameMap
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        tree(this.listQuery)
            .then(response => {
          this.treeData = response.data.list;
          this.listLoading = false;
        })
      },
      getParentList() {
        list().then(response => {
              this.nameMap = response.data.map;
              this.parentOptions = response.data.list;
        })
      },
      getCategoryTree(){
        categoryTree().then(response => {
          this.categoryTreeData = response.data.categoryTree
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      cancleCategory() {
        this.filterCategoryText = ''
        this.dialogCategoryVisible = false
      },
      configCategory() {
        const keyArr = this.$refs.categoryTree.getCheckedKeys()
        if (keyArr.length < 1) {
          this.$notify({
            title: '错误',
            message: '请选择一条数据',
            type: 'error',
            duration: 2000
          })
          return
        }
        if (keyArr.length > 1) {
          this.$notify({
            title: '错误',
            message: '只能选择一个父节点',
            type: 'error',
            duration: 2000
          })
          return
        }
        this.form.parentId = keyArr[0]
        getObj(keyArr[0]).then(response => {
          this.form.parentCategoryName = response.data.obj.categoryName
        })
        this.dialogCategoryVisible = false
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
            .then(response => {
          this.form = response.data.obj;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        if (row.children.length > 0) {
          this.$notify({
            title: '错误',
            message: '该节点下有子节点，无法删除！',
            type: 'error',
            duration: 2000
          })
          return
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              delObj(row.id)
                .then(() => {
                    this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                  this.getCategoryTree();
                });
            });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.getCategoryTree();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form.pkCategoryId, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.getCategoryTree();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
              categoryNo : undefined,
              categoryName : undefined,
              parentId : undefined,
              categoryLevel : undefined,
              description : undefined,
              categorySeq : undefined,
              isEnd : "SW1001",
              isUsed : "SW1302",
              parentCategoryName : undefined
        };
      }
    }
  }
</script>
