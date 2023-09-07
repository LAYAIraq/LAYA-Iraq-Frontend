<!--
  Filename: feedback-view.vue
  Use: Display Course Feedback content block
  Creator: cmc
  Date: unknown
  Dependencies: @/mixins/locale.vue
-->

<template>
  <fieldset
    class="feedback-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div>
      <b-toast
        id="feedback-new"
        :title="y18n('feedback.name')"
        static
        variant="success"
        auto-hide-delay="1500"
        class="feedback-toast"
      >
        {{ y18n('successfulSave') }}
      </b-toast>

      <b-toast
        id="feedback-updated"
        :title="y18n('feedback.title')"
        static
        variant="success"
        auto-hide-delay="1500"
        class="feedback-toast"
      >
        {{ y18n('feedback.bToast.feedbackUpdated') }}
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
              <audio-button
                v-if="taskAudioExists"
                :src="courseSimple?
                  taskAudio.simple :
                  taskAudio.regular"
              ></audio-button>
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
            <p>{{ courseSimple? task.simple : task.text }}</p>
          </div>
          <flag-icon
            v-if="!editPreview"
            :ref-data="task"
            @flagged="task.flagged = true"
          ></flag-icon>
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
                :aria-label="y18n('feedback.label.slider')"
              >
              <flag-icon
                v-if="!editPreview"
                :ref-data="item"
                :interactive="true"
                @flagged="item.flagged = true"
              ></flag-icon>
            </div>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col">
            <h4>{{ y18n('feedback.addFreetext') }}</h4>
            <textarea
              v-model="freetext"
              class="w-100 mt-1"
              rows="5"
              :aria-label="y18n('feedback.label.freetext')"
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
  </fieldset>
</template>

<script>
import { locale, pluginView, watchContent } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/assets/styles/flaggables.css'
import { StarRating } from 'vue-rate-it'
import AudioButton from '@/components/helpers/audio-button.vue'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

// import layaWsyisyg from '../misc/laya-html'
export default {
  name: 'FeedbackView',

  components: {
    FlagIcon,
    AudioButton,
    StarRating
  },

  mixins: [
    locale,
    pluginView,
    watchContent
  ],

  data () {
    return {
      ...this.viewData,
      choice: [], // users solution as index
      freetext: '',
      answered: [],
      prevFeedback: '',
      rating: 0
    }
  },

  computed: {
    ...mapGetters([
      'content',
      'courseId',
      'courseSimple',
      'enrollmentFeedback',
      'userEnrolled'
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
    if (!this.viewData) { // TODO: fix when existing feedback can be tested see #TLI-204
      this.fetchData()
      this.mapSolutions()
      this.getPrevFeedback()
    }

    if (!this.userEnrolled) {
      this.$store.dispatch('enrollmentFetch', this.courseId)
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

    /**
     * function storeFeedback: emit feedback to parent component, show toast
     *
     * Author: cmc
     *
     * Last Updated: September 10, 2022
     */
    storeFeedback () {
      const newFeedback = this.bundleFeedback()
      this.$store.commit('feedbackAdd', newFeedback)
      // this.$forceUpdate()
      this.$store.dispatch('enrollmentUpdate')
      !this.answered
        ? this.$bvToast.show('feedback-new')
        : this.$bvToast.show('feedback-updated')
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
