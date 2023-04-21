<!--
Filename: choice-question-view.vue
Use: View a Choice Question content block
Creator: core
Since: v1.0.0
-->

<template>
  <fieldset
    class="choice-question"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <!-- render task -->
    <div
      :id="title.id"
      class="flaggable row"
    >
      <div class="col">
        <h2 class="pb-3">
          {{ courseSimple? title.simple : title.text }}
          <audio-button
            v-if="taskAudioExists"
            :src="courseSimple?
              taskAudio.regular:
              taskAudio.simple"
          >
          </audio-button>
        </h2>
      </div>
      <flag-icon
        v-if="!editPreview"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
    </div>
    <div
      :id="task.id"
      class="flaggable row"
    >
      <div class="col">
        {{ courseSimple? task.simple: task.text }}
      </div>
      <flag-icon
        v-if="!editPreview"
        :ref-data="task"
        @flagged="task.flagged = true"
      ></flag-icon>
    </div>

    <!-- render options -->
    <div class="p-3 bg-light">
      <div
        v-for="(option,i) in options"
        :id="option.id"
        :key="'mchoice-option-'+i"
        class="flaggable form-check m-2 mb-3"
      >
        <div>
          <input
            v-if="variation === multiple"
            :id="'mchoice-in-'+i"
            v-model="answers"
            class="position-absolute mt-2"
            :class="langIsAr? 'mr-3': 'ml-3'"
            type="checkbox"
            :disabled="freeze"
            :value="i"
          >
          <input
            v-else
            :id="'mchoice-in-'+i"
            v-model="answers[0]"
            class="position-absolute mt-2"
            :class="langIsAr? 'mr-3': 'ml-3'"
            type="radio"
            :disabled="freeze"
            :value="i"
          >

          <label
            :for="'mchoice-in-'+i"
            class="form-check-label"
            :class="langIsAr? 'mr-4' : ''"
          >
            {{ courseSimple? option.simple: option.text }}
          </label>
          <i
            class="ml-2"
            :class="eval[i]"
          ></i>
        </div>

        <!--
        <i class="ml-2" :class="{'far fa-check-circle text-success': true}"></i>
        <i class="ml-2" :class="{'far fa-times-circle text-danger': true}"></i>
        -->
        <flag-icon
          v-if="!editPreview"
          :ref-data="option"
          :interactive="true"
          @flagged="option.flagged = true"
        ></flag-icon>
      </div>
    </div>

    <!-- check -->
    <!--
    <div v-if="maxTries > 0" class="text-secondary my-2" tabindex="0">
      <span>{{ y18n('choiceQuestion.triesLeft') }}</span>
      {{maxTries-tries}}
    </div>
    -->
    <div>
      <button
        type="button"
        class="btn btn-link mt-3"
        :disabled="freeze"
        @click="diffSolution"
      >
        {{ y18n('check') }}
      </button>
      <div aria-live="polite">
        <div v-if="showSolutionsBool">
          {{ i18n["choiceQuestion.showCorrect"] }}
          <div
            v-for="(showSolution, index) in showSolutions"
            :key="index"
          >
            {{ showSolution }}
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary mt-3"
        :class="langIsAr? 'float-left': 'float-right'"
        @click="onFinish[0]() || {}"
      >
        <span>
          {{ y18n('nextContent') }}
          <i :class="langIsAr? 'fas fa-arrow-left' : 'fas fa-arrow-right'"></i>
        </span>
      </button>
      <span
        :id="feedbackId"
        class="ml-2"
        aria-live="polite"
      >
        {{ feedback }}
      </span>
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import AudioButton from '@/components/helpers/audio-button.vue'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

export default {
  name: 'ChoiceQuestionView',
  components: { FlagIcon, AudioButton },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      answers: [],
      checked: [],
      eval: [],
      feedback: '',
      freeze: false,
      showSolutions: [],
      showSolutionsBool: false,
      tries: 0,
      ...this.viewData
    }
  },

  computed: {
    ...mapGetters(['courseSimple']),

    /**
     * feedbackId: creates an identifier string
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    feedbackId () {
      return `mchoice-feedback-${this._uid}`
      // FIXME vm _uid is not supposed to be used as data
      // source: https://github.com/vuejs/vue/issues/5886#issuecomment-308625735
    },

    /**
     * function taskAudioExists: returns true if taskAudio object doesn't
     *  contain empty strings
     *
     *  Author: cmc
     *
     *  Last Updated: October 31, 2021
     * @returns {boolean} true if strings are set
     */
    taskAudioExists () {
      return this.courseSimple
        ? this.taskAudio.regular !== ''
        : this.taskAudio.regular !== '' && this.taskAudio.simple !== ''
    }
  },

  created () {
    this.populateShowSolutions()
  },

  methods: {
    /**
     *Function populateShowSolutions: Fills the showSolutions array to be used when the used clicks the 'show solutions' button
     *
     * Author: pj
     *
     * Last Updated: October 12, 2022 by cmc
     */
    populateShowSolutions () {
      for (let i = 0; i <= this.options.length; i++) {
        if (this.solutions[i]) {
          this.showSolutions.push(this.courseSimple ? this.options[i].simple : this.options[i].text)
        }
      }
    },

    /**
     * Function correct: returns true if user choice is correct
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     *
     * @param {*} i index of answer
     */
    correct (i) {
      // FIXME currently not used
      return this.answers.includes(i) && this.checked[i]
    },

    /**
     * Function incorrect: returns true if answer is incorrect
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     *
     * @param {*} i index of answer
     */
    incorrect (i) {
      // FIXME currently not used
      return this.answers.includes(i) && (this.checked[i] === false)
    },

    /**
     * Function markAnswers: marks questions that have been checked
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     */
    markAnswers () {
      const zis = this
      this.answers.forEach((answer) => {
        zis.checked[answer] = zis.solutions.includes(answer)
      })
    },

    /**
     * Function diffSolution: check if given answers are correct,
     *  mark with check if yes, cross if not
     *
     * Author: core
     *
     * Last Updated: October 12, 2022 by cmc
     */
    diffSolution () {
      for (let i = 0; i < this.options.length; ++i) {
        if (this.solutions[i] && this.answers.includes(i)) {
          // is correct answer ?
          this.eval[i] = { 'far fa-check-circle text-success': true }
        } else if (this.answers.includes(i) ||
          (this.solutions[i] && this.answers.length === 0) // no answer is chosen
        ) {
          // is wrong answer ?
          this.eval[i] = { 'far fa-times-circle text-danger': true }
        }
      }
      this.freeze = true
      this.showSolutionsBool = true
    },

    /**
     * Function check: check user's answers, give feedback accordingly
     *
     * Author: core
     *
     * Updated: March 21, 2021
     */
    check () {
      // FIXME is never called, missing i18n, missing connection to diffSolution

      // NOTE: eval is currently not wanted so skip it
      this.onFinish[0]()
      /* if(true) return */ // commented out for compilation reasons

      if (this.freeze) return

      this.tries++
      /*
       * check given answers */
      this.markAnswers()

      /*
       * check if solutions === answers */
      if (this.solutions.every(s => this.answers.includes(s)) &&
        this.answers.every(a => this.solutions.includes(a))) {
        this.feedback = 'Alles richtig!'
        document.getElementById(this.feedbackId).focus()
        this.freeze = true
        return
      }

      /*
       * solutions !== answers, still has tries ? */
      if (this.maxTries - this.tries > 0) {
        this.feedback = 'Es fehlen noch richtige Antworten oder Korrekturen!'
        document.getElementById(this.feedbackId).focus()
        return
      }

      /*
       * no tries left - show solutions */
      this.answers = [...this.solutions]
      this.markAnswers()
      this.feedback = 'Die Lösung wurde ergänzt!'
      document.getElementById(this.feedbackId).focus()
      this.freeze = true
    }
  }
}
</script>

<style scoped>
/*@import '@/styles/flaggables.css'*/

*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

label {
  user-select: none;
}

.form-check-label {
  width: 90%;
  padding-left: 3rem;
  padding-right: 3rem;
}

legend {
  font-size: 1rem;
}

.form-check:last-child {
  margin-bottom: 0 !important;
}

input[type='radio'] {
  height: 15px;
  width: 15px;
  vertical-align: middle;
}
</style>