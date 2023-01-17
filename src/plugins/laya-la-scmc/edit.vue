<!--
Filename: edit.vue
Use: Edit a Multiple Choice/Response content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    class="ly-bg-author p-3"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h3 class="d-inline-block mr-auto">
        {{ y18n('layaLaScmc.name') }}
      </h3>
      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :title="y18n('showTip')"
        aria-labelledby="tooltipText"
        aria-live="polite"
        @click="toggleTip"
      ></i>
    </div>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('layaLaScmc.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('layaLaScmc.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>
    <form>
      <!-- type -->
      <div class="form-group row">
        <label class="col-2 col-form-label">
          {{ y18n('type') }}
        </label>
        <div class="col-10">
          <div class="form-check form-check-inline align-text-top">
            <input
              id="scmc-sc"
              v-model="variation"
              class="form-check-input"
              type="radio"
              :value="single"
            >
            <label
              for="scmc-sc"
              class="form-check-label"
            >
              {{ y18n('layaLaScmc.edit.sc') }}
            </label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input
              id="scmc-mc"
              v-model="variation"
              class="form-check-input"
              type="radio"
              name="multiple"
              :value="multiple"
            >
            <label
              for="scmc-mc"
              class="form-check-label"
            >
              {{ y18n('layaLaScmc.edit.mc') }}
            </label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input
              id="scmc-tf"
              v-model="variation"
              class="form-check-input"
              type="radio"
              name="tf"
              :value="tf"
            >
            <label
              for="scmc-tf"
              class="form-check-label"
            >
              {{ y18n('layaLaScmc.edit.tf') }}
            </label>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="form-group">
        <div class="row">
          <label
            for="scmc-title"
            class="col-2 col-form-label"
          >
            {{ y18n('title') }}
          </label>
          <div class="col-10">
            <input
              id="scmc-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
            >
          </div>
        </div>
        <!-- simple title-->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="scmc-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <input
              id="scmc-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>

      <!-- task -->
      <div class="form-group">
        <div class="row">
          <label
            for="scmc-task"
            class="col-2 col-form-label"
          >
            {{ y18n('task') }}
          </label>
          <div class="col-10">
            <textarea
              id="scmc-task"
              v-model="task.text"
              class="w-100"
              :placeholder="y18n('taskPlaceholder')"
            >
            </textarea>
          </div>
        </div>
        <!-- task simple -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="scmc-task-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="scmc-task-simple"
              v-model="task.simple"
              class="w-100"
              :placeholder="y18n('simpleAlt')"
            >
            </textarea>
          </div>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group">
        <div class="row">
          <label
            for="scmc-task-audio"
            class="col-2 col-form-label"
          >
            {{ y18n('taskAudio') }}
          </label>
          <div class="col-10">
            <input
              id="scmc-task-audio"
              v-model="taskAudio.regular"
              type="text"
              class="form-control"
              :placeholder="y18n('taskAudioPlaceholder')"
            >
          </div>
        </div>
        <!-- task audio simple -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="scmc-task-audio-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <input
              id="scmc-task-audio-simple"
              v-model="taskAudio.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>

      <p><b>{{ y18n('items') }}</b></p>
      <div
        v-for="(option, i) in options"
        :key="'item-'+i"
        class="form-group"
      >
        <div class="row">
          <!-- caption -->
          <label
            class="col-form-label col-2"
            :for="'option-text-'+i"
          >
            {{ y18n('text') }}
          </label>
          <div class="col-7">
            <input
              v-if="variation === single || variation === multiple"
              :id="'option-text-'+i"
              v-model="option.text"
              class="form-control"
              type="text"
            >
            <input
              v-else
              :id="'option-text-'+i"
              v-model="option.text"
              class="form-control"
              type="text"
              readonly
            >
          </div>

          <!-- correct  -->
          <div class="form-check form-check-inline ">
            <input
              v-if="variation === single || variation === tf"
              :id="'option-corr-'+i"
              v-model="solution"
              class="form-check-input"
              type="radio"
              :value="i"
            >
            <input
              v-else
              :id="'option-corr-'+i"
              v-model="solutions[i]"
              class="form-check-input"
              type="checkbox"
              :value="i"
            >
            <label
              class="form-check-label"
              :for="'option-corr-'+i"
            >
              {{ y18n('layaLaScmc.edit.correct') }}
            </label>
          </div>

          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              v-if="variation === single || variation === multiple"
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_delItem(i)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            :for="'option-text-'+i"
            class="col-form-label col-2"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-7">
            <input
              v-if="variation === single || variation === multiple"
              :id="'option-text-'+i"
              v-model="options[i].simple"
              class="form-control"
              type="text"
            >
            <input
              v-else
              :id="'option-text-'+i"
              v-model="option.simple"
              class="form-control"
              type="text"
              readonly
            >
          </div>
        </div>
      </div>

      <button
        v-if="variation === single || variation === multiple"
        type="button"
        class="btn btn-primary btn-sm"
        @click="_addItem"
      >
        <i class="fas fa-plus"></i>{{ y18n('itemAdd') }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaLaScmcEdit',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      title: '',
      task: '',
      taskAudio: '',
      options: [],
      solution: 0,
      solutions: [],
      maxTries: 1,
      single: 0,
      multiple: 1,
      tf: 2,
      variation: 0
    }
  },

  computed: {
    ...mapGetters(['content', 'courseSimple'])
  },

  created () {
    this.fetchData()
  },

  methods: {

    /**
     * Function _delItem(idx): Delete item at given index
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    _delItem (idx) {
      this.options.splice(idx, 1)
    },

    /**
     * Function _addItem: Add item to options
     * Author: core
     * Last Updated: June 28, 2021
     */
    _addItem () {
      this.options.push({
        text: this.y18n('layaLaScmc.edit.sampleOption'),
        flagged: false,
        id: uuidv4()
      })
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx]['input']))
      this.variation = preData.variation
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.options = preData.options
      this.solutions = preData.solutions
      this.maxTries = preData.maxTries
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

legend {
  font-size: 1rem;
}

#questionmark {
  float: end;
  cursor: pointer;
}
</style>
