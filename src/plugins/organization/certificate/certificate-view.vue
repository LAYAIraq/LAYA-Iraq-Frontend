<!--
Filename: certificate-view.vue
Use: View certificate content block
Author: core
Since v1.0.0
-->

<template>
  <fieldset
    class="certificate-view"
  >
    <div>
      <!-- add pdf viewer -->
    </div>
  </fieldset>
</template>

<script>

import { locale, pluginView } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'CertificateView',

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData
    }
  },

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseSimple'
    ])
  }

}
</script>

<style scoped>

</style>
