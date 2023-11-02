<!--
  @file component to render Next Content button for plugin views
  @author cmc
  @since v1.3.1
-->
<template>
  <button
    type="button"
    class="btn btn-primary mt-3"
    :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
    @click="onFinish"
  >
    {{ y18n('nextContent') }}
    <i :class="langIsAr? 'fas fa-arrow-left' : 'fas fa-arrow-right'"></i>
  </button>
</template>
<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
export default {
  name: 'ButtonNextContent',
  mixins: [locale],
  props: {
    cid: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['courseContentFollowMap', 'courseRoutes']),
    /**
     * @function return a route push for following content
     * @author cmc
     * @return {string} id of following content
     */
    followContent () {
      return this.courseContentFollowMap[this.cid]
    },
    /**
     * @description return function to be invoked on click of next content
     * @author cmc
     * @since v1.3.1
     * @returns {(function(): void)} route change to next content block
     */
    onFinish () {
      return () => this.$router.push({ params: { coursePath: this.courseRoutes[this.followContent] } })
    }
  }
}
</script>

<style scoped>

</style>
