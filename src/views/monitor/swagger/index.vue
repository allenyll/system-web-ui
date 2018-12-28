<template>
  <div>
    <mu-circular-progress v-if="loading" :size="40"/>
    <div v-html="html"/>
  </div>
</template>
<style>

</style>
<script>
import request from '@/utils/request'
export default{
  // 使用时请使用 :url.sync=""传值
  props: {
    url: ''
  },
  data() {
    return {
      loading: false,
      html: '<h1>qwqqwq</h1>'
    }
  },
  watch: {
    url(value) {
      this.load(value)
    }
  },
  mounted() {
    return request({
      url: 'https://localhost:8082/swagger-ui.html',
      method: 'get'
    })
  },
  methods: {

  }
}
</script>
