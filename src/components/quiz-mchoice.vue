<template>
  <fieldset class="ly-quiz-mchoice">

    <!-- render task -->
    <legend tabindex="0">{{task}}</legend>

    <!-- render options -->
    <div class="p-3 bg-light">
      <div v-for="(option,i) in options"
           class="form-check"
           :key="'mchoice-'+_uid+'-option-'+i">
        <input :id="'mchoice-in-'+_uid+'-'+i"
          class="form-check-input"
          type="checkbox"
          v-model="answers"
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
      <span v-if="profile.lang === 'de'">Versuche übrig:</span>
      <span v-else>Tries left:</span>
      {{maxTries-tries}}
    </div>
    <button type="button"
            class="btn btn-primary"
            @click="check"
            :disabled="freeze">
      <i class="fas fa-check"></i>
      <span v-if="profile.lang === 'de'">Prüfen</span>
      <span v-else>Check</span>
    </button>
    <span :id="feedbackId" class="ml-2" aria-live="polite">{{ feedback }}</span>

  </fieldset>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'ly-quiz-mchoice',
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
    task: String,
    options: Array,
    solutions: Array,
    maxTries: Number
  },
  computed: {
    ...mapState(['profile']),
    ...mapGetters(['isAuthor']),
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

      this.tries++
      /*
       * check given answers */
      this.markAnwsers()

      /*
       * check if solutions === answers */
      if (this.solutions.every(s => this.answers.includes(s)) &&
        this.answers.every(a => this.solutions.includes(a))) {
        this.feedback = (this.profile.lang === 'de')
          ? 'Alles richtig!'
          : 'All correct!'
        document.getElementById(this.feedbackId).focus()
        this.freeze = true
        return
      }

      /*
       * solutions !== answers, still has tries ? */
      if (this.maxTries - this.tries > 0) {
        this.feedback = (this.profile.lang === 'de')
          ? 'Es fehlen noch richtige Antworten oder Korrekturen!'
          : 'You are still missing some answers or corrections!'
        document.getElementById(this.feedbackId).focus()
        return
      }

      /*
       * no tries left - show solutions */
      this.answers = [ ...this.solutions ]
      this.markAnwsers()
      this.feedback = (this.profile.lang === 'de')
        ? 'Die Lösung wurde ergänzt!'
        : 'The solution is being shown!'
      document.getElementById(this.feedbackId).focus()
      this.freeze = true
    }
  }
}
</script>

<style scoped>
.author {
  padding: 0.5rem;
  border: 2px solid lightskyblue;
}

*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}
</style>
