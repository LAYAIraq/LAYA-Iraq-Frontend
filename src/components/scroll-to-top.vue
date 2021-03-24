<!--
Filename: scroll-to-top.vue
Use: shows little arrow to scroll to top after certain treshold
Creator: core
Date: unknown
Dependencies: none
-->

<template>
  <div v-show="show" class="ly-scroll-to-top">
    <button type="button" class="btn btn-secondary btn-lg" @click="scrollTop">
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ly-scroll-to-top',
  data () {
    return {
      show: true
    }
  },
  methods: {

    /**
     * Function scrollTreshold: sets show to true if scrolled more than 200px
     * 
     * Author: core
     * 
     * Last Updated: March 12, 2021
     */
    scrollTreshold() {
      this.show = window.scrollY > 200
    },

    /**
     * Function scrollTop: scrolls to top of window
     * 
     * Author: core
     * 
     * Last Updated: March 12, 2021
     */
    scrollTop() {
      window.scroll({top: 0, behavior: 'smooth'})
    }
  },
  created() {
    window.addEventListener('scroll', this.scrollTreshold)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollTreshold)
  }
}
</script>

<style scoped>
.ly-scroll-to-top {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 5;
}
</style>
