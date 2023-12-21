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
    <!-- render title -->
    <div
      :id="title.id"
      :class="courseLangIsAr? 'flaggable-ar row' : 'flaggable-en row'"
    >
      <div
        class="col"
        :class="courseLangIsAr? 'text-right' : 'text-left'"
      >
        <h1 class="pb-3">
          {{ courseSimple? title.simple : title.text }}
          <!--
            <audio-button
              v-if="taskAudioExists"
              :src="courseSimple?
                taskAudio.simple :
                taskAudio.text"
            ></audio-button>
            -->
        </h1>
      </div>
      <a>
        <flag-icon
          v-if="!editPreview"
          :ref-data="title"
          @flagged="title.flagged = true"
        ></flag-icon>
      </a>
    </div>

    <div
      :id="task.id"
      class="row"
    >
      <div class="col task-label">
        <p>{{ courseSimple? task.simple : task.text }}</p>
      </div>
    </div>
    <hr>

    <div class="row">
      <div class="col">
        <div
          v-for="(item,i) in items"
          :id="item.id"
          :key="item.id"
          class="mb-3 item"
        >
          <label
            class="centering item-label"
          >
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
          </label>

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
            :class="courseLangIsAr? '': ''"
            min="0"
            :max="categories.length-1"
            :disabled="checked"
            :aria-valuenow="solution[i]"
            :aria-valuetext="courseSimple? categories[solution[i]].simple: categories[solution[i]].text"
            :aria-label="y18n('categoryMatching.label.slider')"
          >
        </div>
      </div>
    </div>

    <div class="langIsAr ? mr-3 : ml-3">
      <div class="row mb-3">
        <button
          type="button"
          class="btn btn-primary"
          :class="langIsAr? 'float-right': 'float-left'"
          :disabled="checked"
          aria-labelledby="solutions"
          @click="check"
        >
          {{ y18n('check') }}
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

    <div class="row">
      <navigation-buttons
        :cid="id"
      ></navigation-buttons>
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import NavigationButtons from '@/components/helpers/navigation-buttons.vue'

export default {
  name: 'CategoryMatchingView',
  components: { NavigationButtons, FlagIcon },

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
.item-label {
  font-size: 18pt;
}

.task-label {
  font-size: 18pt;
}
</style>
