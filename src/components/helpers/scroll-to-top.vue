<!--
Filename: scroll-to-top.vue
Use: shows little arrow to scroll to top after certain treshold
Creator: core
Date: unknown
Dependencies: none
-->

<template>
  <div
    v-show="show"
    class="scroll-to-top"
  >
    <button
      :aria-label="y18n('scrollUp')"
      type="button"
      class="btn btn-secondary btn-lg"
      @click="scrollTop"
    >
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'ScrollToTop',

  mixins: [locale],

  data () {
    return {
      show: false
    }
  },
  created () {
    window.addEventListener('scroll', this.scrollTreshold)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollTreshold)
  },
  methods: {

    /**
     * Function scrollTreshold: sets show to true if scrolled more than 200px
     *
     * Author: core
     *
     * Last Updated: March 12, 2021
     */
    scrollTreshold () {
      this.show = window.scrollY > 200
    },

    /**
     * Function scrollTop: scrolls to top of window
     *
     * Author: core
     *
     * Last Updated: March 12, 2021
     */
    scrollTop () {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 5;
}
</style>
