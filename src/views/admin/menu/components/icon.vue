<template>
  <div v-show="showDialog" class="iconDialog">
    <el-dialog :visible.sync="showDialog" title="图标列表" style="font-size:30px;" width="40%">
      <el-row>
        <div class="icon-div" iconClass="404" @click="selectIcon($event, '404')">
          <svg-icon icon-class="404" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'email')">
          <svg-icon icon-class="email" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'password')">
          <svg-icon icon-class="password" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'bug')">
          <svg-icon icon-class="bug" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'chart')">
          <svg-icon icon-class="chart" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'clipboard')">
          <svg-icon icon-class="clipboard" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'dashboard')">
          <svg-icon icon-class="dashboard" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'documentation')">
          <svg-icon icon-class="documentation" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'drag')">
          <svg-icon icon-class="drag" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'example')">
          <svg-icon icon-class="example" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'excel')">
          <svg-icon icon-class="excel" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'eye')">
          <svg-icon icon-class="eye" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'form')">
          <svg-icon icon-class="form" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'guide')">
          <svg-icon icon-class="guide" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'icon')">
          <svg-icon icon-class="icon" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'international')">
          <svg-icon icon-class="international" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'language')">
          <svg-icon icon-class="language" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'link')">
          <svg-icon icon-class="link" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'list')">
          <svg-icon icon-class="list" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'lock')">
          <svg-icon icon-class="lock" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'menu')">
          <svg-icon icon-class="menu" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'message')">
          <svg-icon icon-class="message" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'money')">
          <svg-icon icon-class="money" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'nested')">
          <svg-icon icon-class="nested" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'people')">
          <svg-icon icon-class="people" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'qq')">
          <svg-icon icon-class="qq" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'shopping')">
          <svg-icon icon-class="shopping" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'size')">
          <svg-icon icon-class="size" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'satr')">
          <svg-icon icon-class="star" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'system')">
          <svg-icon icon-class="system" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'tab')">
          <svg-icon icon-class="tab" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'table')">
          <svg-icon icon-class="table" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'theme')">
          <svg-icon icon-class="theme" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'tree')">
          <svg-icon icon-class="tree" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'user')">
          <svg-icon icon-class="user" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'wechat')">
          <svg-icon icon-class="wechat" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'zip')">
          <svg-icon icon-class="zip" />
        </div>
        <div class="icon-div" @click="selectIcon($event, 'edit')">
          <svg-icon icon-class="edit" />
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      showDialog: true
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
        background: #409EFF;
        cursor: pointer;
    }
</style>
