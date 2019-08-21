<template>
  <div class="laya-html">
    <div v-html="html"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "laya-html",
  data() {
    return {
    }
  },
  mounted() {
  },
  props: {
    html: String,
  },
  computed: {
  },
  methods: {
  },
})
</script>

<style>
</style>
