<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          ref="menuTree"
          :data="treeData"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox
          @node-click="getNodeData"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/admin/menu/index'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        abel: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      getMenuTree().then(data => {
        console.log(data.data.menuTree)
        this.treeData = data.data.menuTree
      })
    }
  }
}
</script>

