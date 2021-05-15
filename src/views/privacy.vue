<!--
Filename: privacy.vue 
Use: Show privacy and legal notices
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="privacy-view">

    <div class="container">
      <div class="row">
        <div class="col">

          <div style="height: 2rem"></div>
          <h1><b>{{ i18n['privacy.title'] }}</b></h1>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'privacy-view',

  mixins: [
    locale
  ],

  mounted () {
    window.scroll(0, 0)
  }
}
</script>

<style scoped>
*:focus {
  outline: 3px dashed deepskyblue;
}

a {
  color: #000;
  text-decoration: underline;
}
</style>
