<template>
  <div v-show="note.busy" class="ly-busy-note">
    <i class="fas fa-spinner fa-spin"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import http from 'axios'

export default {
  name: 'ly-busy-note',
  computed: {
    ...mapState(['note'])
  }
}
</script>

<style scoped></style>
