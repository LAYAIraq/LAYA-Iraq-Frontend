<!--
Filename: view.vue
Use: Display Course Feedback content block
Creator: cmc
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="laya-feedback">
    <b-toast
      id="feedback-new"
      :title="y18n('layaLaFeedback.name')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="feedback-toast"
    >
      {{ y18n('successfulSave') }}
    </b-toast>

    <b-toast
      id="feedback-updated"
      :title="y18n('layaLaFeedback.title')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="feedback-toast"
    >
      {{ y18n('layaLaFeedback.bToast.feedbackUpdated') }}
    </b-toast>

    <div class="feedback-container-main">
      <div class="row mb-3">
        <div class="col">
          <h2>
            {{ title.text }}
          </h2>
          <p>{{ task.text }}</p>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="col">
          <div
            v-for="(item, i) in items"
            :key="item.text"
            class="item flaggable interactive"
          >
            <h3 class="text-center item-label">
              {{ item.text }}
            </h3>
            <div class="d-flex justify-content-between">
              <b
                v-for="cat in categoriesLocal"
                :key="cat"
                aria-hidden="true"
              >{{ cat }}</b>
            </div>

            <input
              v-model.number="choice[i]"
              type="range"
              class="custom-range"
              min="0"
              :max="categoriesLocal.length-1"
              :aria-valuenow="choice[i]"
              :aria-valuetext="categoriesLocal[choice[i]]"
              :aria-label="y18n('layaLaFeedback.label.slider')"
            >
            <laya-flag-icon
              :ref-data="item"
              :flagged="item.flagged"
              :interactive="true"
            >
            </laya-flag-icon>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h4>{{ y18n('layaLaFeedback.addFreetext') }}</h4>
          <textarea
            v-model="freetext"
            class="w-100 mt-1"
            rows="5"
            :aria-label="y18n('layaLaFeedback.label.freetext')"
          ></textarea>
        </div>
      </div>
      <div class="row mt-1">
        <div class="col">
          <button
            type="button"
            class="btn btn-outline-success btn-block"
            @click="storeFeedback"
          >
            <i class="fas fa-check"></i>
            {{ y18n('save') }}
          </button>
        </div>
      </div>

      <div class="row">
        <button
          type="button"
          class="btn btn-primary mt-3 ml-auto"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="done"
        >
          {{ y18n('nextContent') }}
          <i
            :class="langIsAr?
              'fas fa-arrow-left':
              'fas fa-arrow-right'"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { locale, watchContent } from '@/mixins'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

// import layaWsyisyg from '../misc/laya-html'
export default {
  name: 'LayaFeedback',

  mixins: [
    locale,
    watchContent
  ],
  props: {
    init: {
      type: Object,
      default () { return null }
    },
    onFinish: {
      type: Array,
      default () { return [] }
    },
    onSave: {
      type: Function,
      default () { return () => {} }
    }
  },

  data () {
    return {
      choice: [], // users choice as index
      freetext: '',
      answered: false,
      // step: this.init.fno,
      step: this.$route.params.step - 1,
      id: uuidv4(),
      items: [],
      prevFeedback: '',
      categoriesLocal: '',
      numberOfFeedbacksEntries: 0
    }
  },

  computed: {
    ...mapGetters(['content']),
    ...mapGetters(['getEnrollmentFeedback'])
  },

  created () {
    this.fetchData()
    this.mapSolutions()
    this.getPrevFeedback()
  },
  beforeDestroy () {
    // add saving feedback data

  },
  methods: {
    mapSolutions () {
      this.categoriesLocal = this.categories
      const mid = Math.floor((this.categories.length) / 2)
      const s = this.items.map(() => mid)
      this.solution = [...s]
    },

    /**
     * Function getPreviousFeedback: fetch eventual previous feedback
     *
     * Author: cmc
     *
     * Last Updated: unknown
     */
    getPrevFeedback () {
      if (typeof this.getEnrollmentFeedback !== 'undefined') {
        this.prevFeedback = JSON.parse(JSON.stringify(this.getEnrollmentFeedback))
        if ((this.prevFeedback[this.numberOfFeedbacksEntries] !== null) && this.prevFeedback.length !== 0) {
          this.answered = true
          this.freetext = this.prevFeedback[this.numberOfFeedbacksEntries].freetext
          this.choice = this.prevFeedback[this.numberOfFeedbacksEntries].choice
          this.created = this.prevFeedback[this.numberOfFeedbacksEntries].choice
          this.step = this.prevFeedback[this.numberOfFeedbacksEntries].step
          if (typeof this.choice === 'undefined') {
            this.choice = []
          }
        }
      }
    },

    /*  getPreviousFeedback() {
      for (var i of this.init) {
        if(i.step === this.step) {
          this.answered = true
          let tmp = i
          this.freetext = tmp.freetext
          this.choice = tmp.choice
          this.created = tmp.created
          this.step = tmp.step
          return
        }
      }
    }, */

    /**
     * Function done: execute function from onFinish[0]
     *
     * Creator: cmc
     *
     * LastUpdated: unknown
     */
    done () {
      this.onFinish[0]()
    },

    /**
     * function bundleFeedback: bundle input in Object to persist
     *
     * Author: pj
     *
     * Last Updated: September 10, 2021
     */
    bundleFeedback () {
      return {
        step: this.step,
        created: Date.now(),
        choice: this.choice,
        freetext: this.freetext,
        id: this.id,
        numberOfFeedbacksEntries: this.numberOfFeedbacksEntries,
        options: {
          questions: this.items,
          answers: this.categories
        }
      }
    },

    /* save() {
      let step = this.step -1 // to comply to array indexing in store
      const newInput = this.stepData
      const updatedStep = {
        name: this.cid,
        nextStep: null,
        input: newInput
      }

      // choose way depending on new or existing content
      if(!this.editContent){
        this.$store.commit('appendContent', updatedStep)
      }
      else{
        this.$store.commit('updateStep', { step, updatedStep })
      }
      this.$emit('saved')
    }, */

    /**
     * function storeFeedback: emit feedback to parent component, show toast
     *
     * Author: cmc
     *
     * Last Updated: September 10, 2021
     */
    storeFeedback () {
      const newFeedback = this.bundleFeedback()
      this.$store.commit('appendFeedback', newFeedback)
      this.$forceUpdate()
      this.$store.dispatch('updateEnrollment')
      !this.answered
        ? this.$bvToast.show('feedback-new')
        : this.$bvToast.show('feedback-updated')
    },

    /**
     * Function fetchData(): fetch data from vuex and make data property
     *
     * Author: pj
     *
     * Last Updated: September 10, 2021
     */
    fetchData () {
      for (let i = 0; i < this.step; i++) {
        if (this.content[i].name === 'laya-course-feedback') {
          this.numberOfFeedbacksEntries++
        }
      }
      const preData = JSON.parse(JSON.stringify(this.content[this.step].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.items = preData.items
      this.categories = preData.categories
    },
    fetchEnrollment () {
      this.$store.dispatch('fetchEnrollment', this.course.courseId)
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

.item {
  margin-bottom: 2rem;
}
.item:last-child {
  margin-bottom: 0;
}

.feedback-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>
