<template>
  <fieldset class="laya-la-scmc">


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
           class="form-check mb-3"
           :key="'mchoice-'+_uid+'-option-'+i">

        <input v-if="multiple"
          :id="'mchoice-in-'+_uid+'-'+i"
          class="form-check-input"
          type="checkbox"
          v-model="answers"
          :disabled="freeze"
          v-bind:value="i">
        <input v-else
          :id="'mchoice-in-'+_uid+'-'+i"
          class="form-check-input"
          type="radio"
          v-model="answers[0]"
          :disabled="freeze"
          v-bind:value="i">

        <label :for="'mchoice-in-'+_uid+'-'+i" class="form-check-label">
          {{ option }}
        </label>
        <i class="ml-2" :class="eval[i]"></i>
        <!--
        <i class="ml-2" :class="{'far fa-check-circle text-success': true}"></i>
        <i class="ml-2" :class="{'far fa-times-circle text-danger': true}"></i>
        -->
      </div>
    </div>

    <!-- check -->
    <!--
    <div v-if="maxTries > 0" class="text-secondary my-2" tabindex="0">
      <span>Versuche übrig:</span>
      {{maxTries-tries}}
    </div>
    -->
    <button type="button"
            class="btn btn-link mt-3"
            @click="diffSolution"
            :disabled="freeze">
      Lösung ergänzen
    </button>
    <button type="button"
            class="btn btn-primary mt-3 float-right"
            @click="onFinish[0]() || {}">
      <span>Nächster Inhalt <i class="fas fa-arrow-right"></i> </span>
    </button>
    <span :id="feedbackId" class="ml-2" aria-live="polite">{{ feedback }}</span>

  </fieldset>
</template>

<script>
import Vue from "vue"
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'laya-multiple-choice',
  created () {
  },
  data () {
    return {
      tries: 0,
      answers: [],
      checked: [],
      feedback: '',
      freeze: false,
      eval: []
    }
  },
  props: {
    multiple: Boolean,
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
    diffSolution: function() {

      for(let i=0; i<this.options.length; ++i) {
        // is solution ?
        if(this.solutions.includes(i)) {
          // is also answer ?
          if(this.answers.includes(i)) {
            this.eval[i] = {"far fa-check-circle text-success": true}
          } else {
            this.eval[i] = {"far fa-times-circle text-danger": true}
          }
        } else {
          // but is answer ?
          if(this.answers.includes(i)) {
            this.eval[i] = {"far fa-times-circle text-danger": true}
          } else {
            this.eval[i] = {"far fa-check-circle text-success": true}
          }
        }
      }
      this.freeze = true
      this.$forceUpdate()

    },
    check: function () {

      // NOTE: eval is currently not wanted so skip it
      this.onFinish[0]()
      if(true) return

      if (this.freeze) return

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
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

label {
  user-select: none;
}

legend {
  font-size: 1rem;
}

.form-check:last-child {
  margin-bottom: 0 !important;
}
</style>
