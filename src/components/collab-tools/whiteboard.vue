<!--
  Filename: whiteboard.vue
  Use: whiteboard collab tool
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration.whiteboard') }}
          </h1>
        </div>
      </div>
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <!-- tool here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'Whiteboard',

  components: {
  },

  mixins: [
    locale
  ]
}
</script>
