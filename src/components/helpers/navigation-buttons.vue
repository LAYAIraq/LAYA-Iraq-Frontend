<!--
  @file component to render Next Content button for plugin views
  @author cmc
  @since v1.3.1
-->
<template>
  <div class="col">
    <b-button
      v-if="cid !== courseStart"
      variant="primary"
      @click="$router.back()"
    >
      <i
        :class="langIsAr? 'fas fa-arrow-right' : 'fas fa-arrow-left'"
        aria-hidden="true"
      ></i>
      {{ y18n('previousContent') }}
    </b-button>
    <b-button
      v-if="buttonNextShow"
      variant="primary"
      :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
      @click="onFinish"
    >
      {{ y18n('nextContent') }}
      <i
        aria-hidden="true"
        :class="langIsAr? 'fas fa-arrow-left' : 'fas fa-arrow-right'"
      ></i>
    </b-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
export default {
  name: 'NavigationButtons',
  mixins: [locale],
  props: {
    cid: {
      type: String,
      required: true
    },
    buttonNav: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters(['courseContentFollowMap', 'courseEnd', 'courseRoutes', 'courseStart']),
    /**
     * @description whether or not to show "next content" button
     * @return {boolean} true if block is not a button navigation and not last in course
     */
    buttonNextShow () {
      return this.buttonNav
        ? false
        : this.cid !== this.courseEnd
    },
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
