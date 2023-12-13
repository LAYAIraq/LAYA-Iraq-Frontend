<!--
  Filename: flag.vue
  Use: Display flag view
  Author: cmc
  Since: v1.1.0
-->
<template>
  <div class="flag">
    <div class="container">
      <flag-question v-if="!flag"></flag-question>
      <flag-answer v-else></flag-answer>
      <div
        class="row mt-3"
      >
        <b-button
          :class="langIsAr? 'ml-auto': 'mr-auto'"
          @click="$router.back()"
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
  name: 'Flag',

  components: {
    FlagQuestion: () => import('@/components/course/flag/flag-question.vue'),
    FlagAnswer: () => import('@/components/course/flag/flag-answer.vue')
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
        // this.$store.dispatch('flagsUpdate')
        this.flag = this.$store.getters.courseFlagSingle(this.$attrs.id)
      }
    }
  },

  created () {
    if (!this.courseId) this.courseFetch()
    this.flag = this.$store.getters.courseFlagSingle(this.$attrs.id)
  }
}
</script>

<style scoped>

</style>
