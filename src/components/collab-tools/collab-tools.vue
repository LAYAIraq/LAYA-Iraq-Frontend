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
        <div class="col-8 m-5">
          <h5>
            {{ y18n('collaboration.description') }}
          </h5>
        </div>
      </div>
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col ml-5">
          <b-button>
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
