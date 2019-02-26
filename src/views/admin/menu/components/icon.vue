<template>
  <div v-show="showDialog" class="iconDialog">
    <el-dialog :visible.sync="showDialog" title="图标列表" style="font-size:30px;" width="40%">
      <el-row>
        <div class="icon-div" v-for="item of iconsMap" :key="item" @click="selectIcon($event, item)">
          <el-tooltip :content="item" placement="bottom">
            <svg-icon :icon-class="item" />
          </el-tooltip>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import icons from './requireIcons'
export default {
  props: {
    value: {}
  },
  data() {
    return {
      showDialog: true,
      iconsMap: icons
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.showDialog = newVal // 监测value的变化，并赋值。
    }
  },
  mounted() {
    this.showDialog = this.value
  },
  methods: {
    selectIcon: function(e, icon) {
      this.$emit('sendIcon', icon)
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss">
    .icon-div{
        width:40px;
        height: 40px;
        text-align: center;
        float: left;
        font-size: 30px;
        margin-left: 8px;
        margin-bottom: 10px;
    }
    .icon-div:hover{
        cursor: pointer;
    }
</style>
