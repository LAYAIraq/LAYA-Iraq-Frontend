<template>
  <div class="laya-timed-message">
    <h3 class="m-5 text-center">{{ msg }}</h3>
    <h4 class="text-center"><i class="fas fa-spin fa-circle-notch"></i></h4>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "laya-timed-message",
  data() {
    return {
      timeoutID: -1
    }
  },
  mounted() {
    const vue = this
    vue.timeoutID = setTimeout(() => vue.onFinish(), vue.timeout);
  },
  destroyed() {
    clearTimeout(this.timeoutID)
  },
  props: {
    msg: String,
    timeout: Number,
    onFinish: Function
  },
  computed: {
  },
  methods: {
  },
})
</script>

<style>
</style>
