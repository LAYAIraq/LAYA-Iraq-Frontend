<template>
  <div class="set-flag">
    <div class="flag-title">
        {{ i18n['flag.title'] }}
    </div>

    <div class="form-group flag-question">
      <form
        @submit="setFlagQuestion()"
      >
        <div class="form-group row">
          <span
            id="question-hint"
            class="sr-only"
          >
            {{ i18n['flag.typeHere'] }}
          </span>
          <textarea
            aria-labelledby="question-hint"
            class="form-control"
            id="set-flag-question"
            rows="5"
            v-model="question"
            :placeholder="i18n['flag.questionPlaceholder']"
          ></textarea>
        </div>
        <div class="form-group row">
          <label
            class="form-check-label"
            for="anonymous-question"
          >
            {{ i18n['flag.anonymous'] }}
            <i
              class="fas fa-question-circle"
              :title="i18n['flag.anonHint']"
              v-b-tooltip.top
              tabindex="0"
            ></i>
          </label>
          <input
            id ="anonymous-question"
            type="checkbox"
            v-model="anonymous"
            :class="langIsAr? 'mr-3': 'ml-3'"
          >
        </div>

        <div class="form-group row">
          <b-button
            for="set-flag-question"
            type="submit"
          >
            {{ i18n['flag.setQuestion'] }}
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'
import './flag-styles.css'
export default {
  name: 'flag-question',

  mixins: [
      locale
  ],

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseCreator',
      'courseId',
      'userId'
    ]),

  },

  props: {
    id: String
  },

  data() {
    return{
      answerSent: false,
      anonymous: false,
      newAnswer: '',
      // newFlag: null,
      question: '',
      unflagged: false
    }
  },

  methods: {

    /**
     * function setFlagQuestion: bundle flag info and store it
     *
     * Author: cmc
     *
     * Last Updated: September 21, 2021
     */
    setFlagQuestion() {
      if (this.question === '') {
        this.$bvToast.toast(this.i18n['flag.noQuestion'], {
          title: this.i18n['flag.noQuestionTitle'],
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
          enrollmentId: (this.$store.state.enrollment) ?
              this.$store.state.enrollment.id :
              null
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