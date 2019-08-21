<template>
  <fieldset class="ly-quiz-mchoice">


    <!-- render task -->
    <legend tabindex="0">
      <h3 class="pb-3">
        {{title}}
        <laya-audio-inline v-if="taskAudio" :src="taskAudio">
        </laya-audio-inline>
      </h3>
      {{task}}
    </legend>

    <!-- render options -->
    <div class="p-3 bg-light">
      <div v-for="(option,i) in options"
           class="form-check"
           :key="'mchoice-'+_uid+'-option-'+i">
        <input :id="'mchoice-in-'+_uid+'-'+i"
          class="form-check-input"
          type="checkbox"
          v-model="answers"
          :disabled="freeze"
          :value="i">
        <label :for="'mchoice-in-'+_uid+'-'+i" class="form-check-label">
          {{ option }}
        </label>
        <i class="ml-2" :class="{'far fa-check-circle text-success': correct(i)}"></i>
        <i class="ml-2" :class="{'far fa-times-circle text-danger': incorrect(i)}"></i>
      </div>
    </div>

    <!-- check -->
    <div v-if="maxTries > 0" class="text-secondary my-2" tabindex="0">
      <span>Versuche übrig:</span>
      {{maxTries-tries}}
    </div>
    <button type="button"
            class="btn btn-primary mt-3 float-right"
            @click="check"
            :disabled="freeze">
      <span><i class="fas fa-check"></i> Fertig</span>
    </button>
    <span :id="feedbackId" class="ml-2" aria-live="polite">{{ feedback }}</span>

  </fieldset>
</template>

<script lang="ts">
import Vue from "vue"
import {mapState, mapGetters} from 'vuex'

export default Vue.extend({
  name: 'laya-multiple-choice',
  created () {
  },
  data () {
    return {
      tries: 0,
      answers: [],
      checked: [],
      feedback: '',
      freeze: false
    }
  },
  props: {
    title: String,
    task: String,
    taskAudio: String,
    options: Array,
    solutions: Array,
    maxTries: Number,
    onFinish: Array
  },
  computed: {
    feedbackId: function () {
      return `mchoice-feedback-${this._uid}`
    }
  },
  methods: {
    correct: function (i) {
      return this.answers.includes(i) && this.checked[i]
    },
    incorrect: function (i) {
      return this.answers.includes(i) && (this.checked[i] === false)
    },
    markAnwsers: function () {
      const zis = this
      this.answers.forEach(function (answer) {
        zis.checked[answer] = zis.solutions.includes(answer)
      })
    },
    check: function () {
      if (this.freeze) return

      // TODO: remove later
      this.onFinish[0]()

      this.tries++
      /*
       * check given answers */
      this.markAnwsers()

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
      this.answers = [ ...this.solutions ]
      this.markAnwsers()
      this.feedback = 'Die Lösung wurde ergänzt!'
      document.getElementById(this.feedbackId).focus()
      this.freeze = true
    }
  }
})
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

legend {
  font-size: 1rem;
}
</style>
