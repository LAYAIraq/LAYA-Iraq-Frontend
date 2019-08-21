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
    scrollTreshold: function () {
      this.show = window.scrollY > 200
    },
    scrollTop: function () {
      window.scroll({top: 0, behavior: "smooth"})
    }
  },
  created () {
    window.addEventListener("scroll", this.scrollTreshold)
  },
  destroyed () {
    window.removeEventListener("scroll", this.scrollTreshold)
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
