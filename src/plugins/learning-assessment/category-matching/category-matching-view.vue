<!--
  Filename: category-matching-view.vue
  Use: Display Category Matching Assessment block
  Creator: cmc
  Since: v1.3.0
-->

<template>
  <fieldset
    class="category-matching-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">
      <div
        :id="title.id"
        class="flaggable row mb-3"
      >
        <div class="col">
          <h2>
            {{ courseSimple? title.simple : title.text }}
            <audio-button
              v-if="taskAudioExists"
              :src="courseSimple?
                taskAudio.simple :
                taskAudio.text"
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
            v-for="(item,i) in items"
            :id="item.id"
            :key="item.id"
            class="flaggable item mb-5"
          >
            <h3 class="text-center item-label">
              {{ courseSimple? item.simple : item.label }}
              <i
                v-if="checked"
                class="fas"
                :class="{
                  'fa-check text-success': eval[i],
                  'fa-times text-danger': !eval[i]
                }"
              >
              </i>
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
              v-model.number="solution[i]"
              type="range"
              class="custom-range"
              :class="courseLangIsAr? 'mr-3': 'ml-3'"
              min="0"
              :max="categories.length-1"
              :disabled="checked"
              :aria-valuenow="solution[i]"
              :aria-valuetext="courseSimple? categories[solution[i]].simple: categories[solution[i]].text"
              :aria-label="y18n('categoryMatching.label.slider')"
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
      <div class="row">
        <button
          type="button"
          class="btn btn-link mt-3"
          :class="langIsAr? 'float-right': 'float-left'"
          :disabled="checked"
          aria-labelledby="solutions"
          @click="check"
        >
          {{ y18n('check') }}
        </button>
        <button
          type="button"
          class="btn btn-primary mt-3"
          :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
          @click="done"
        >
          {{ y18n('nextContent') }}
          <i :class="langIsAr? 'fas fa-arrow-left' : 'fas fa-arrow-right'"></i>
        </button>
      </div>
      <div
        v-if="showSolutionsBool"
        id="solutions"
      >
        {{ i18n["choiceQuestion.showCorrect"] }}
        <div
          v-for="(item, index) in items"
          :key="index"
        >
          {{ item.label }}: {{ courseSimple
            ? categories[item.category].simple
            : categories[item.category].text
          }}
        </div>
      </div>
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
  name: 'CategoryMatchingView',
  components: { AudioButton, FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData,
      checked: false,
      solution: [], // users solution as index
      eval: [],
      showSolutionsBool: false
    }
  },

  computed: {
    ...mapGetters(['content', 'courseSimple']),

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
    // if (!this.viewData) this.fetchData()
    this.mapSolutions()
  },

  methods: {
    /**
     * Function done: execute function from onFinish[0]
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    done () {
      this.onFinish()
    },

    /**
     * Function check: check if given answers are correct
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    check () {
      if (this.eval.length === 0) {
        for (let i = 0; i < this.solution.length; i++) {
          const solution = this.solution[i]
          this.eval[i] = (solution === this.items[i].category)
        }
      }
      this.checked = !this.checked
      this.showSolutionsBool = true
      // this.$forceUpdate()
    },

    /**
     * Function mapSolutions: initialize rendered ranges to the middle
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    mapSolutions () {
      const mid = Math.floor((this.categories.length) / 2)
      const s = this.items.map(() => mid)
      this.solution = [...s]
    }
  }
}
</script>

<style scoped>

.item {
  margin-bottom: 2rem;
}
.item:last-child {
  margin-bottom: 0;
}
</style>
