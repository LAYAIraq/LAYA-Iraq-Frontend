<template>
  <div class="flag-view">
    <div class="container">
      <flag-question v-if="!flag"></flag-question>
      <flag-answer v-else></flag-answer>
      <div
        class="row mt-3"
      >
        <b-button
          :class="langIsAr? 'ml-auto': 'mr-auto'"
          @click="$router.push({ name: 'course-detail-view' })"
        >
          {{ y18n('backToCourse') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { locale, storeHandler } from '@/mixins'
import { mapGetters } from 'vuex'
export default {
  name: 'FlagView',

  components: {
    FlagQuestion: () => import('@/views/flag-views/flag-question'),
    FlagAnswer: () => import('@/views/flag-views/flag-answer')
  },

  mixins: [
    locale,
    storeHandler
  ],

  data () {
    return {
      flag: null
    }
  },

  computed: {
    ...mapGetters(['course', 'courseId', 'courseFlags'])
  },

  watch: {
    /**
     * watcher courseFlags: deep watcher to update currentFlag
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    courseFlags: {
      deep: true,
      handler () {
        // this.$store.dispatch('updateFlags')
        this.flag = this.$store.getters.singleFlag(this.$attrs.id)
      }
    }
  },

  created () {
    if (!this.courseId) this.fetchCourse()
    this.flag = this.$store.getters.singleFlag(this.$attrs.id)
  }
}
</script>

<style scoped>

</style>
