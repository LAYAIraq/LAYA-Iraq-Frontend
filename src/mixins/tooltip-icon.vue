<!--
  Filename: tooltip-icon.vue
  Use: define helper variables for component tooltips
  Creator: cmc
  Date: April 28, 2021
  Dependencies: None
-->

<script>
import { mapGetters } from 'vuex'
export default {

  data () {
    return {
      tooltipOn: false
    }
  },

  computed: {
    ...mapGetters(['courseSimple'])
  },

  methods: {
    /**
      * Function toggleTip: toggle tooltipOn boolean
      *
      * Author: cmc
      *
      * Last updated: unknown
      */
    toggleTip () {
      this.tooltipOn = !this.tooltipOn
    }
  }
}
</script>

<style scoped>

#questionmark {
  float: end;
  cursor: pointer;
}

</style>
