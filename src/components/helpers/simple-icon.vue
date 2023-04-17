<!--
Filename: simple-icon.vue
Use: Shows a simple icon
Author: core
Date: unknown
Dependencies: none
-->

<template>
  <span class="ly-simple-icon">
    <i class="lc fas fa-circle"></i>
    <i class="rc fas fa-circle"></i>
    <i class="text far fa-comment-alt"></i>
  </span>
</template>

<script>
export default {
  name: 'LySimpleIcon'
}
</script>

<style scoped>
.ly-simple-icon {
  position: relative;
}
.ly-simple-icon .lc {
  position: absolute;
  top: 0.6em;
  left: 0.45em;
  font-size: 0.4em;
}
.ly-simple-icon .rc {
  position: absolute;
  top: 0.6em;
  right: 0.45em;
  font-size: 0.4em;
}
.ly-simple-icon .text {
  font-size: 1.2em;
  vertical-align: text-bottom;
}
</style>
