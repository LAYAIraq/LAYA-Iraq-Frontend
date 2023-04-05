<!--
  Filename: tooltip-icon.vue
  Use: define helper variables for component tooltips
  Creator: cmc
  Since: v1.1.0
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

<style>

#questionmark {
  float: inline-end;
  cursor: pointer;
}

</style>
