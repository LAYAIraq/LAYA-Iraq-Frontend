<!--
Filename: view.vue
Use: Display Drag & Drop content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="container">
    <div
      :id="title.id"
      class="flaggable row mb-3"
    >
      <div class="col">
        <h2>
          {{ courseSimple? title.simple : title.text }}
          <laya-audio-inline
            v-if="taskAudioExists"
            :src="courseSimple?
              taskAudio.simple :
              taskAudio.text"
          ></laya-audio-inline>
        </h2>
      </div>
      <laya-flag-icon
        v-if="!previewData"
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
        v-if="!previewData"
        :ref-data="task"

        @flagged="task.flagged = true"
      ></laya-flag-icon>
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
            min="0"
            :max="categories.length-1"
            :disabled="checked"
            :aria-valuenow="solution[i]"
            :aria-valuetext="categories[solution[i]]"
            :aria-label="y18n('layaLaDragDrop.label.slider')"
          >
          <laya-flag-icon
            v-if="!previewData"
            :ref-data="item"
            :interactive="true"
            @flagged="item.flagged = true"
          ></laya-flag-icon>
        </div>
      </div>
    </div>
    <div class="row">
      <button
        type="button"
        class="btn btn-link mt-3"
        :class="langIsAr? 'float-right': 'float-left'"
        :disabled="checked"
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
      {{ i18n["layaLaScmc.showCorrect"] }}
      <div
        v-for="(item, index) in items"
        :key="index"
      >
        {{ item.label }}: {{ categories[items[index].category] }},
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, viewPluginProps, watchContent } from '@/mixins'
import '@/styles/flaggables.css'

export default {
  name: 'LayaQuizDragDrop',

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.previewData) { // show preview
      return {
        ...this.previewData,
        checked: false,
        solution: [], // users solution as index
        eval: []
      }
    }
    return {
      checked: false,
      solution: [], // users solution as index
      eval: [], // list of booleans
      title: {},
      task: {},
      taskAudio: '',
      items: [],
      categories: [],
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
    if (!this.previewData) this.fetchData()
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
      this.onFinish[0]()
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
    },

    /**
     * Function fetchData(): fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 12, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.items = preData.items
      this.categories = preData.categories
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
