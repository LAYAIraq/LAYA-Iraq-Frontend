<!--
  Filename: collab-tools.vue
  Use: overview of collaboration tools
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration') }}
          </h1>
        </div>
      </div>

      <div class="row">
        <div class="col-8 mx-auto mt-4">
          <h5>
            {{ y18n('collaboration.description') }}
          </h5>
        </div>
      </div>
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row header">
        <div class="col-1 mx-auto">
          <h4>{{ y18n('collaboration') }}</h4>
        </div>
        <div class="col-3 mx-auto">
          <h4>{{ y18n('feedback.edit.desc') }}</h4>
        </div>
      </div>

      <div class="row">
        <div class="col-1 mt-3 mx-auto">
          <b-button
            block
            variant="primary"
            append
            :to="{path: '/chat'}"
          >
            {{ y18n('collaboration.chat') }}
          </b-button>
        </div>
        <div class="col-3 mt-3 mx-auto">
          {{ y18n('collaboration.chat.tooltip') }}
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-1 mx-auto">
          <b-button
            block
            variant="primary"
            append
            :to="{path: '/whiteboard'}"
          >
            {{ y18n('collaboration.whiteboard') }}
          </b-button>
        </div>
        <div class="col-3 mx-auto">
          {{ y18n('collaboration.whiteboard.tooltip') }}
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'CollabTools',

  mixins: [
    locale
  ]
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.header {
  border-bottom: 2px solid black;
}

</style>
