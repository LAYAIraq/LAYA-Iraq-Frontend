<template>
  <div class="laya-flag">
    I AM A FLAG!
  </div>
</template>

<script>
// import http from 'axios'
import { mapGetters, mapState } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'LayaFlag',

  mixins: [
      locale
  ],

  props: {
    refData: {
      flagged: Boolean,
      id: String
    }
  },

  computed: {
    ...mapGetters(['courseFlags']),
    ...mapState(['flags'])
  },

  data() {
    return{

    }
  }
}

</script>