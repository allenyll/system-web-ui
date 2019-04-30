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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="closeDialog()">
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
            <el-form-item label="图片">
              <el-upload
                        ref="upload"
                        action="/upload.do"
                        :http-request="myUpload"
                        name="picture"
                        list-type="picture-card"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="onExceed"
                        :before-upload="beforeUpload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
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
  import treeTable from '@/components/TreeTable';
  import { tree, page, addObj, getObj, delObj, putObj, list, categoryTree} from '@/api/goods/category/index';
  import { mapGetters } from 'vuex';
  import { getToken } from '@/utils/auth';
  import axios from 'axios';
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
            text: '图片',
            value: 'url',
            ifImage: 0
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
          parentCategoryName : undefined,
          fileName: undefined
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
        categoryTreeData: [],
        dialogImageUrl: '',
        dialogVisible: false,
        //图片列表（用于在上传组件中回显图片）
        fileList: []
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
          var fileUrl = response.data.file.fileUrl;
          console.log(fileUrl)
          if(fileUrl !== undefined && fileUrl !== ''){
            var data = {
              name: '分类',
              url: response.data.file.fileUrl
            }
            this.fileList.push(data)
          }
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
            this.form.fileList = this.fileList
            console.log(this.form)
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
        this.fileList = [];
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.fileList = this.fileList
            putObj(this.form.pkCategoryId, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.getCategoryTree();
              this.$notify({
                title: '成功',
                message: '更新成功',
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
              parentCategoryName : undefined,
              fileName: undefined
        };
      },
      closeDialog() {
        this.fileList = []
      },
      // 自定义上传
      myUpload(content) {
        const token = getToken()
        let self = this
        let config= {
          header:{
            'Content-Type': 'multipart/form-data',
            'Authorization': token + ',JWT_PLATFORM'
          },
          onUploadProgress: progressEvent => {
            let percent=(progressEvent.loaded / progressEvent.total * 100) | 0
            //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            content.onProgress({percent:percent})
          }
        }
        let formData = new FormData();
        formData.append("file", content.file)
        formData.append("type", "SW1803")
        formData.append("id", '')
        
        axios.post('http://www.allenyll.com:8080/system-web/file/upload', formData, config).then( (res) => {
          //做处理
          //this.getFileList(this.goodsId)
          if(res.data.code === '100000'){
            var data = {
              name: '分类',
              url: res.data.url
            }
            this.fileList.push(data)
            self.uploadMessage = '上传成功！';
          }
        }).catch((error) =>{

    

        });
      },
      //文件上传成功的钩子函数
      handleSuccess(res, file) {
          this.$message({
              type: 'info',
              message: '图片上传成功',
              duration: 6000
          });
          if (file.response.success) {
              this.editor.picture = file.response.message; //将返回的文件储存路径赋值picture字段
          }
      },
      //删除文件之前的钩子函数
      handleRemove(file, fileList) {
          this.$message({
              type: 'info',
              message: '已删除原有图片',
              duration: 6000
          });
      },
      //点击列表中已上传的文件事的钩子函数
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //上传的文件个数超出设定时触发的函数
      onExceed(files, fileList) {
          this.$message({
              type: 'info',
              message: '最多只能上传一个图片',
              duration: 6000
          });
      },
      //文件上传前的前的钩子函数
      //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
      beforeUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isGIF = file.type === 'image/gif';
          const isPNG = file.type === 'image/png';
          const isBMP = file.type === 'image/bmp';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG && !isGIF && !isPNG && !isBMP) {
              this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
          }
          if (!isLt2M) {
              this.$message.error('上传图片大小不能超过 2MB!');
          }
          return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      }
    }
  }
</script>
