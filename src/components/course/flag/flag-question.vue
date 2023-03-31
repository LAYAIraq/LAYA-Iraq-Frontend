<!--
  Filename: flag-question.vue
  Use: Display flag question view
  Author: cmc
  Since: v1.1.0
-->
<template>
  <div class="set-flag">
    <div class="flag-title">
      <h1>
        {{ y18n('flag.title') }}
      </h1>
    </div>

    <div class="form-group flag-question">
      <form
        @submit.prevent="setFlagQuestion()"
      >
        <div class="form-group row">
          <span
            id="question-hint"
            class="sr-only"
          >
          </span>
          <textarea
            id="set-flag-question"
            v-model="question"
            aria-labelledby="question-hint"
            class="form-control"
            rows="5"
            :placeholder="y18n('flag.questionPlaceholder')"
          ></textarea>
        </div>
        <div class="form-group row">
          {{ y18n('flag.anonymous') }}
          <i
            id="questionmark"
            class="fas fa-question-circle"
            :class="langIsAr? 'mr-3': 'ml-3'"
            :title="y18n('showTip')"
            @click="toggleTip"
          ></i>
          <div aria-live="polite">
            <b-jumbotron
              v-if="tooltipOn"
            >
              <div>{{ y18n('flag.anonHint') }}</div>
            </b-jumbotron>
          </div>
          <input
            id="anonymous-question"
            v-model="anonymous"
            type="checkbox"
            :class="langIsAr? 'mr-3': 'ml-3'"
            :aria-label="y18n('flag.anonymous')"
          >
        </div>

        <div class="form-group row">
          <b-button
            for="set-flag-question"
            type="submit"
          >
            {{ y18n('flag.setQuestion') }}
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/assets/styles/flag-styles.css'
export default {
  name: 'FlagQuestion',

  mixins: [
    locale,
    tooltipIcon
  ],

  props: {
    id: {
      type: String,
      default () { return '' }
    }
  },

  data () {
    return {
      answerSent: false,
      anonymous: false,
      newAnswer: '',
      // newFlag: null,
      question: '',
      unflagged: false
    }
  },

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseCreator',
      'courseId',
      'userId'
    ])

  },

  methods: {

    /**
     * function setFlagQuestion: bundle flag info and store it
     *
     * Author: cmc
     *
     * Last Updated: September 21, 2021
     */
    setFlagQuestion () {
      if (this.question === '') {
        this.$bvToast.toast(this.y18n('flag.noQuestion'), {
          title: this.y18n('flag.noQuestionTitle'),
          toaster: 'b-toaster-bottom-center',
          variant: 'warning'
        })
      } else {
        const flag = {
          question: {
            text: this.question,
            edited: false,
            editTime: null
          },
          referenceId: this.$route.params.id,
          courseId: this.courseId,
          authorId: this.userId,
          enrollmentId: (this.$store.state.enrollment)
            ? this.$store.state.enrollment.id
            : null
        }
        this.$store.commit('setFlag', flag)
        this.$store.dispatch('saveFlags')
        // this.newFlag = {
        //   ...flag,
        //   created: Date.now()
        // }
        this.$store.dispatch('checkCourseFlags')
      }
    }
  }
}
</script>

<style scoped>

</style>
