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
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h3>
            {{ y18n('collaboration.description') }}
          </h3>
        </div>
      </div>
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <b-button size="large">
            {{ y18n('collaboration.chat') }}
          </b-button>
        </div>
      </div>
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
