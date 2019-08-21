<template>
  <div class="ly-media-text2 position-relative mb-3 pt-3">
    <span v-html="text"></span>
  </div>
</template>

<script>
export default {
  name: 'ly-media-text2',
  props: {
    text: String
  }
}
</script>

<style scoped>
</style>
