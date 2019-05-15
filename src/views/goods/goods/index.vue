<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_goods_name" style="width: 190px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.eq_goods_code" style="width: 190px;" class="filter-item" placeholder="编码" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.eq_fk_brand_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择品牌" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in brandOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_fk_category_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择分类" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_fk_color_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择颜色" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in colorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_fk_size_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择尺码" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in sizeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_is_used" style="width: 190px;" class="filter-item" placeholder="请选择启用状态" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1302" label="启用" value="SW1302"/>
        <el-option key="SW1301" label="停用" value="SW1301"/>
      </el-select>
      <el-select v-model="listQuery.eq_status" style="width: 190px;" class="filter-item" placeholder="请选择商品状态" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1401" label="上架" value="SW1401"/>
        <el-option key="SW1402" label="下架" value="SW1402"/>
        <el-option key="SW1403" label="预售" value="SW1403"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="goodsManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column v-if="show" align="center" label="pk_goods_id">
        <template scope="scope">
          <span>{{ scope.row.pkGoodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template scope="scope">
          <img :src="scope.row.fileUrl" min-width="50" height="50" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品编码">
        <template scope="scope">
          <span>{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品价格">
        <template scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌">
        <template scope="scope">
          <span>{{ brandNameMap[scope.row.fkBrandId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template scope="scope">
          <span>{{ categoryNameMap[scope.row.fkCategoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="颜色">
        <template scope="scope">
          <span>{{ colorNameMap[scope.row.fkColorId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="尺码">
        <template scope="scope">
          <span>{{ sizeNameMap[scope.row.fkSizeId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存量">
        <template scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="季节性">
        <template scope="scope">
          <span>{{ scope.row.season | seasonFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template scope="scope">
          <span>{{ unitMap[scope.row.unit] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template scope="scope">
          <el-tag :type="scope.row.isUsed | isUsedTypeFilter">{{ scope.row.isUsed | isUsedFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品状态">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template scope="scope">
          <el-button v-if="goodsManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="goodsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" @close="closeDialog">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="商品基础信息" name="first">
          <div class="form">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品名称" prop="goodsName">
                    <el-input v-model="form.goodsName" placeholder="请输入商品名称"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品编码" prop="goodsCode">
                    <el-input v-model="form.goodsCode" placeholder="请输入商品编码"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品条形码" prop="goodsBarCode">
                    <el-input v-model="form.goodsBarCode" placeholder="请输入商品条形码"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品价格" prop="price">
                    <el-input v-model="form.price" placeholder="请输入商品价格"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="市场价" prop="marketPrice">
                    <el-input v-model="form.marketPrice" placeholder="请输入市场价"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="成本价" prop="costPrice">
                    <el-input v-model="form.costPrice" placeholder="请输入成本价"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="品牌" prop="fkBrandId">
                    <el-select v-model="form.fkBrandId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in brandOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属分类" prop="fkCategoryId">
                    <el-select v-model="form.fkCategoryId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="颜色" prop="fkColorId">
                    <el-select v-model="form.fkColorId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in colorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="尺码" prop="fkSizeId">
                    <el-select v-model="form.fkSizeId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in sizeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="库存量" prop="stock">
                    <el-input v-model="form.stock" placeholder="请输入库存量"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="告警库存" prop="warningStock">
                    <el-input v-model="form.warningStock" placeholder="请输入告警库存"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品积分" prop="goodsIntegral">
                    <el-input v-model="form.goodsIntegral" placeholder="请输入商品积分"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品标签" prop="goodsLabel">
                    <el-input v-model="form.goodsLabel" placeholder="请输入商品标签"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品排序" prop="goodsSeq">
                    <el-input v-model="form.goodsSeq" placeholder="请输入商品排序"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="单位" prop="unit">
                    <el-select v-model="form.unit" filterable placeholder="请选择">
                      <el-option
                        v-for="item in unitOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品状态" filterable prop="status">
                    <el-select v-model="form.status" style="wdith:100%;">
                      <el-option key="SW1401" label="上架" value="SW1401"/>
                      <el-option key="SW1402" label="下架" value="SW1402"/>
                      <el-option key="SW1403" label="预售" value="SW1403"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="上架时间" prop="saleTime">
                    <el-date-picker
                      v-model="form.saleTime"
                      type="datetime"
                      placeholder="请选择上架时间"
                      default-time="12:00:00"
                      style="wdith:100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="季节性" prop="season">
                    <el-select v-model="form.season" filterable style="wdith:100%;">
                      <el-option key="SW1701" label="春季" value="SW1701"/>
                      <el-option key="SW1702" label="夏季" value="SW1702"/>
                      <el-option key="SW1703" label="秋季" value="SW1703"/>
                      <el-option key="SW1704" label="冬季" value="SW1704"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="总销量" prop="saleNum">
                    <el-input v-model="form.saleNum" placeholder="请输入总销量"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="访问量" prop="visitNum">
                    <el-input v-model="form.visitNum" placeholder="请输入访问量"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="评价数" prop="appraiseNum">
                    <el-input v-model="form.appraiseNum" placeholder="请输入评价数"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否新品" prop="isNew">
                    <el-radio v-model="form.isNew" label="SW1001">是</el-radio>
                    <el-radio v-model="form.isNew" label="SW1002">否</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否推荐" prop="isRecom">
                    <el-radio v-model="form.isRecom" label="SW1001">是</el-radio>
                    <el-radio v-model="form.isRecom" label="SW1002">否</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否启用" prop="isUsed">
                    <el-radio v-model="form.isUsed" label="SW1301">停用</el-radio>
                    <el-radio v-model="form.isUsed" label="SW1302">启用</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否有规格" prop="isSpec">
                    <el-radio v-model="form.isSpec" label="SW1001">是</el-radio>
                    <el-radio v-model="form.isSpec" label="SW1002">否</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否精品" prop="isBest">
                    <el-radio v-model="form.isBest" label="SW1001">是</el-radio>
                    <el-radio v-model="form.isBest" label="SW1002">否</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否热卖" prop="isHot">
                    <el-radio v-model="form.isHot" label="SW1001">是</el-radio>
                    <el-radio v-model="form.isHot" label="SW1002">否</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="促销信息" prop="goodsTips">
                    <el-input v-model="form.goodsTips" type="textarea" placeholder="请输入促销信息"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="简介" prop="goodsBrief">
                    <el-input v-model="form.goodsBrief" type="textarea" placeholder="请输入简介"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="header" class="dialog-footer" style="float:right;">
              <el-button @click="cancel('form')">取 消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
              <el-button v-else type="primary" @click="update('form')">确 定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品详情" name="second">
          <div class="components-container">
            <div>
              <tinymce ref="tinymce" :height="300" v-model="form.goodsDesc"/>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="third">
          <el-upload
            :http-request="myUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            action="http://localhost:8080"
            list-type="picture-card"
            on-progress:on-progress>
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :visible.sync="dialogImageVisible">
            <img :src="dialogImageUrl" width="100%" alt="">
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/goods/goods/index'
import { getFileList, delFile } from '@/api/admin/file/index'
import { getBrandList } from '@/api/goods/brand/index'
import { getSizeList } from '@/api/goods/size/index'
import { getColorList } from '@/api/goods/color/index'
import { getCategoryList } from '@/api/goods/category/index'
import { getList } from '@/api/admin/dict/index'
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default {
  name: 'Goods',
  components: { Tinymce },
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1401': '上架',
        'SW1402': '下架',
        'SW1403': '预售'
      }
      return map[val]
    },
    statusTypeFilter(val) {
      const map = {
        'SW1401': 'success',
        'SW1402': 'danger',
        'SW1403': 'info'
      }
      return map[val]
    },
    isUsedFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    },
    isUsedTypeFilter(val) {
      const map = {
        'SW1302': 'success',
        'SW1301': 'info'
      }
      return map[val]
    },
    seasonFilter: function(val) {
      const map = {
        'SW1701': '春季',
        'SW1702': '夏季',
        'SW1703': '秋季',
        'SW1704': '冬季'
      }
      return map[val]
    },
    isOrNoFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    }

  },
  data() {
    return {
      form: {
        fkBrandId: undefined,
        fkCategoryId: undefined,
        fkColorId: undefined,
        fkUnitId: undefined,
        fkSizeId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: undefined,
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: undefined,
        status: undefined,
        isSpec: undefined,
        isBest: undefined,
        isHot: undefined,
        isNew: undefined,
        isRecom: undefined,
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      },
      rules: {
        fkBrandId: [
          {
            required: true,
            message: '请输入品牌主键',
            trigger: 'blur'
          }
        ], fkCategoryId: [
          {
            required: true,
            message: '请输入分类主键',
            trigger: 'blur'
          }
        ], fkColorId: [
          {
            required: true,
            message: '请输入颜色主键',
            trigger: 'blur'
          }
        ],
        fkSizeId: [
          {
            required: true,
            message: '请输入尺码主键',
            trigger: 'blur'
          }
        ],
        goodsName: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goodsCode: [
          {
            required: true,
            message: '请输入商品编码',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            message: '请输入库存量',
            trigger: 'blur'
          }
        ],
        season: [
          {
            required: true,
            message: '请输入季节性',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
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
        status: [
          {
            required: true,
            message: '请输入商品状态',
            trigger: 'blur'
          }
        ],
        saleTime: [
          {
            required: true,
            message: '请选择上架时间',
            trigger: 'blur'
          }
        ]
      },
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
      goodsManager_btn_edit: false,
      goodsManager_btn_del: false,
      goodsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      multipleSelection: [],
      brandMap: [],
      brandOptions: [],
      sizeMap: [],
      sizeOptions: [],
      colorMap: [],
      colorOptions: [],
      categoryMap: [],
      categoryOptions: [],
      unitMap: [],
      unitOptions: [],
      dialogImageUrl: '',
      dialogImageVisible: false,
      goodsId: '',
      fileList: [],
      activeName: 'first'
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    brandNameMap: function() {
      return this.brandMap
    },
    sizeNameMap: function() {
      return this.sizeMap
    },
    colorNameMap: function() {
      return this.colorMap
    },
    categoryNameMap: function() {
      return this.categoryMap
    }
  },
  created() {
    this.getList()
    this.getBrandList()
    this.getSizeList()
    this.getColorList()
    this.getCategoryList()
    this.getUnitList()
    this.download()
    this.goodsManager_btn_edit = this.elements['goods:goods:edit']
    this.goodsManager_btn_del = this.elements['goods:goods:delete']
    this.goodsManager_btn_add = this.elements['goods:goods:add']
  },
  methods: {
    closeDialog() {
      this.fileList = []
      this.form.goodsDesc = ''
      this.activeName = 'first'
    },
    myUpload(content) {
      const token = getToken()
      const self = this
      const config = {
        header: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token + ',JWT_PLATFORM'
        },
        onUploadProgress: progressEvent => {
          const percent = (progressEvent.loaded / progressEvent.total * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          content.onProgress({ percent: percent })
        }
      }
      const formData = new FormData()
      formData.append('file', content.file)
      formData.append('type', 'SW1801')
      formData.append('id', this.goodsId)

      axios.post('http://www.allenyll.com:8080/system-web/file/upload', formData, config).then((res) => {
        // 做处理
        this.getFileList(this.goodsId)
        if (res.data.code === '100000') {
          self.uploadMessage = '上传成功！'
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    download() {
      // download('group1/M00/00/00/rBsAA1yY_5iALGj7AAt46MDfrYg67.jpeg').then(response => {
      //   console.log(response)
      // })
    },
    getFileList(id) {
      const param = {
        id: id,
        type: 'SW1801'
      }
      getFileList(param).then(response => {
        this.fileList = response.data.list
        console.log(this.fileList)
      })
    },
    handleRemove(file, fileList) {
      const param = {
        eq_pk_file_id: file.id,
        url: file.url
      }
      delFile(param).then(response => {
        if (response.data.code === '100000') {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
    },
    getBrandList() {
      getBrandList().then(response => {
        this.brandMap = response.data.map
        this.brandOptions = response.data.list
      })
    },
    getSizeList() {
      getSizeList().then(response => {
        this.sizeMap = response.data.map
        this.sizeOptions = response.data.list
      })
    },
    getColorList() {
      getColorList().then(response => {
        this.colorMap = response.data.map
        this.colorOptions = response.data.list
      })
    },
    getCategoryList() {
      getCategoryList().then(response => {
        this.categoryMap = response.data.map
        this.categoryOptions = response.data.list
      })
    },
    getUnitList() {
      getList('SW16').then(response => {
        this.unitMap = response.data.map
        this.unitOptions = response.data.list
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
      this.$refs.tinymce.setContent(this.form.goodsDesc)
    },
    handleUpdate(row) {
      this.goodsId = row.pkGoodsId
      this.getFileList(this.goodsId)
      getObj(row.pkGoodsId)
        .then(response => {
          this.form = response.data.obj
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
          this.$refs.tinymce.setContent(this.form.goodsDesc)
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.pkGoodsId)
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
      const set = this.$refs
      set[formName].resetFields()
      this.activeName = 'first'
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putObj(this.form.pkGoodsId, this.form).then(() => {
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
        fkBrandId: undefined,
        fkCategoryId: undefined,
        fkColorId: undefined,
        fkUnitId: undefined,
        fkSizeId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: '',
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: 'SW1302',
        status: undefined,
        isSpec: 'SW1002',
        isBest: 'SW1002',
        isHot: 'SW1002',
        isNew: 'SW1001',
        isRecom: 'SW1002',
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      }
    }
  }
}
</script>
<style>
  .form .el-select{width:100%;}
</style>
