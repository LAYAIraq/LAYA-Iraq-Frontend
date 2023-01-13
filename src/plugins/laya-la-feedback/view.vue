<!--
Filename: view.vue
Use: Display Course Feedback content block
Creator: cmc
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<!--
Reorganisation
Author: nv
Last Updated: May 04, 2022
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

    <div class="container">
      <div
        :id="title.id"
        class="flaggable row mb-3"
      >
        <hr>
        <div class="col">
          <h2>
            {{ courseSimple? title.simple : title.text }}
            <laya-audio-inline
              v-if="taskAudioExists"
              :src="courseSimple?
                taskAudio.simple :
                taskAudio.regular"
            ></laya-audio-inline>
          </h2>
        </div>
        <laya-flag-icon
          v-if="!viewData"
          :ref-data="title"
          @flagged="title.flagged = true"
        ></laya-flag-icon>
      </div>

      <div
        :id="task.id"
        class="flaggable row"
      >
        <div class="col">
          <p>{{ courseSimple? task.simple : task.text }}</p>
        </div>
        <laya-flag-icon
          v-if="!viewData"
          :ref-data="task"
          @flagged="task.flagged = true"
        ></laya-flag-icon>
      </div>
      <hr>

      <div class="row">
        <div class="col">
          <div
            v-for="(item, i) in items"
            :id="item.id"
            :key="item.id"
            class="flaggable item mb-5"
          >
            <h3 class="text-center item-label">
              {{ courseSimple? item.simple : item.label }}
            </h3>

            <div class="d-flex justify-content-between">
              <b
                v-for="cat in categories"
                :key="cat.text"
              >
                {{ courseSimple? cat.simple : cat.text }}
              </b>
            </div>

            <input
              v-model.number="choice[i]"
              type="range"
              class="custom-range"
              min="0"
              :max="categories.length-1"
              :aria-valuenow="choice[i]"
              :aria-valuetext="categories[choice[i]]"
              :aria-label="y18n('layaLaFeedback.label.slider')"
            >
            <laya-flag-icon
              v-if="!viewData"
              :ref-data="item"
              :interactive="true"
              @flagged="item.flagged = true"
            ></laya-flag-icon>
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

      <div class="row mt-5">
        <div class="col">
          <star-rating
            :rating="rating"
            @rating-selected="e => rating = e"
          >
          </star-rating>
          <div>
            {{ y18n('selected.rating') }}: {{ rating }}
          </div>
          <div>
            <a
              href="#"
              @click.prevent="rating = 0"
            >
              {{ y18n('reset.rating') }}</a>
          </div>
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
          class="btn btn-primary mt-3 ml"
          :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
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
import { locale, viewPluginProps, watchContent } from '@/mixins'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import '@/styles/flaggables.css'
import { StarRating } from 'vue-rate-it'

// import layaWsyisyg from '../misc/laya-html'
export default {
  name: 'LayaFeedback',

  components: {
    StarRating
  },

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.viewData) { // show preview
      return {
        ...this.viewData,
        choice: [], // users solution as index
        answered: []
      }
    }

    return {
      title: {},
      task: {},
      taskAudio: {},
      choice: [], // users choice as index
      freetext: '',
      answered: [],
      // step: this.init.fno,
      step: this.$route.params.step - 1,
      id: uuidv4(),
      items: [],
      prevFeedback: '',
      categories: '',
      numberOfFeedbacksEntries: 0,
      rating: 0
    }
  },

  computed: {
    ...mapGetters([
      'content',
      'courseId',
      'courseSimple',
      'enrollmentFeedback'
    ]),

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
    if (!this.viewData) {
      this.fetchData()
      this.mapSolutions()
      this.getPrevFeedback()
    }

    if (!this.enrollmentFeedback) {
      this.$store.dispatch('fetchEnrollment', this.courseId)
    }
  },
  beforeDestroy () {
    // add saving feedback data
    this.storeFeedback()
  },
  methods: {
    mapSolutions () {
      const mid = Math.floor((this.categories.length) / 2)
      const s = this.items.map(() => mid)
      this.choice = [...s]
    },

    /**
     * Function getPreviousFeedback: fetch eventual previous feedback
     *
     * Author: cmc
     *
     * Last Updated: September 10, 2022
     */
    getPrevFeedback () {
      if (typeof this.enrollmentFeedback !== 'undefined') {
        this.prevFeedback = JSON.parse(JSON.stringify(this.enrollmentFeedback))[this.id] // get feedback by content id
        if (this.prevFeedback) {
          this.choice = this.prevFeedback.choice
          this.freetext = this.prevFeedback.freetext
          this.rating = this.prevFeedback.rating
        }
      }
    },

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
     * Last Updated: September 10, 2022
     */
    bundleFeedback () {
      return {
        created: Date.now(),
        choice: this.choice,
        freetext: this.freetext,
        rating: this.rating,
        id: this.id
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
     * Last Updated: September 10, 2022
     */
    storeFeedback () {
      const newFeedback = this.bundleFeedback()
      this.$store.commit('addFeedback', newFeedback)
      // this.$forceUpdate()
      this.$store.dispatch('updateEnrollment')
      !this.answered
        ? this.$bvToast.show('feedback-new')
        : this.$bvToast.show('feedback-updated')
    },

    /**
     * Function fetchData(): fetch data from vuex and make data property
     *
     * Author: nv
     *
     * Last Updated: May 04, 2022
     */
    fetchData () {
      // for (let i = 0; i < this.step; i++) {
      //   if (this.content[i].name === 'laya-course-feedback') {
      //     this.numberOfFeedbacksEntries++
      //   }
      // }
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.id = preData.id
      this.items = preData.items
      this.categories = preData.categories
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
