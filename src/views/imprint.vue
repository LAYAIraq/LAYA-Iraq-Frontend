<!--
Filename: imprint.vue 
Use: display imprint
Creator: core
Date: unknown
Dependencies: @/i18n/imprint
-->

<template>
  <div class="imprint-view">

    <div class="container">
      <div class="row">
        <div class="col">

          <div style="height: 2rem"></div>
          <h1><b>{{ i18n.title }}</b></h1>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/imprint'

export default {
  name: 'imprint-view',
  mounted () {
    window.scroll(0, 0)
  },
  computed: {

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
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
