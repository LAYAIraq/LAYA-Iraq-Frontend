<!--
Filename: choice-question-edit.vue
Use: Edit a Choice Question content block
Creator: core
Since: v1.0.0
-->

<template>
  <div
    class="bg-author p-3"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h3 class="d-inline-block mr-auto">
        {{ y18n('choiceQuestion.name') }}
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
      :header="y18n('choiceQuestion.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('choiceQuestion.tooltip') }}
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
              id="choices-sc"
              v-model="variation"
              class="form-check-input"
              type="radio"
              :value="single"
            >
            <label
              for="choices-sc"
              class="form-check-label"
            >
              {{ y18n('choiceQuestion.edit.sc') }}
            </label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input
              id="choices-mc"
              v-model="variation"
              class="form-check-input"
              type="radio"
              name="multiple"
              :value="multiple"
            >
            <label
              for="choices-mc"
              class="form-check-label"
            >
              {{ y18n('choiceQuestion.edit.mc') }}
            </label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input
              id="choices-tf"
              v-model="variation"
              class="form-check-input"
              type="radio"
              name="tf"
              :value="tf"
              @click="switchToTF"
            >
            <label
              for="choices-tf"
              class="form-check-label"
            >
              {{ y18n('choiceQuestion.edit.tf') }}
            </label>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="form-group">
        <div class="row">
          <label
            for="choices-title"
            class="col-2 col-form-label"
          >
            {{ y18n('title') }}
          </label>
          <div class="col-10">
            <input
              id="choices-title"
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
            for="choices-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <input
              id="choices-title-simple"
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
            for="choices-task"
            class="col-2 col-form-label"
          >
            {{ y18n('task') }}
          </label>
          <div class="col-10">
            <textarea
              id="choices-task"
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
            for="choices-task-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="choices-task-simple"
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
            for="choices-task-audio"
            class="col-2 col-form-label"
          >
            {{ y18n('taskAudio') }}
          </label>
          <div class="col-10">
            <input
              id="choices-task-audio"
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
            for="choices-task-audio-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-10">
            <input
              id="choices-task-audio-simple"
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

          <!-- correct -->
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
              {{ y18n('choiceQuestion.edit.correct') }}
            </label>
          </div>

          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              v-if="variation === single || variation === multiple"
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_itemDelete(options, i)"
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
        @click="_itemAdd(options, newItem())"
      >
        <i class="fas fa-plus"></i>{{ y18n('itemAdd') }}
      </button>
    </form>
    <b-modal
      id="confirm-change-tf"
      :title="y18n('warning')"
      header-bg-variant="danger"
      ok-variant="danger"
      :ok-title="y18n('courseCreate.modal.ok')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="populateTrueFalse()"
    >
      <p>
        {{ y18n('changeToTrueFalse.modal.text') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { array, locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'
import { deepCopy } from '@/mixins/general/helpers'

export default {
  name: 'ChoiceQuestionEdit',

  mixins: [
    array,
    locale,
    pluginEdit,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      title: '',
      task: '',
      taskAudio: '',
      options: [],
      solution: 0,
      solutions: [true],
      maxTries: 1,
      single: 0,
      multiple: 1,
      tf: 2,
      variation: 0
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple'])
  },

  watch: {
    multiple (val) { // reset solutions when changed to single choice
      if (!val) {
        // eslint-disable-next-line no-return-assign
        this.solutions = this.solutions.map((s, i) => s = false)
      }
    },
    /**
     * @function watch solution for change, reset solutions array to accept solution at index val
     * @param val integer value for solution
     */
    solution (val) {
      this.solutions = this.options.map(() => false)
      this.solutions[val] = true
    }
  },

  created () {
    if (this.edit) {
      this.fetchData()
    } else {
      this.taskTitlePopulate()
      this.options.push(this.newItem())
    }
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const preData = deepCopy(this.courseContent[this.pathId])
      this.variation = preData.variation
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.options = preData.options
      this.solutions = preData.solutions
      this.maxTries = preData.maxTries
    },
    /**
     * @function newItem: create new item
     * @author cmc
     * @return {{flagged: boolean, text: any, id: *}}
     */
    newItem () {
      return {
        simple: this.y18n('simpleAlt'),
        text: this.y18n('plugin.sampleOption'),
        flagged: false,
        id: uuidv4()
      }
    },
    /**
     * @description add the correct answer options if true and false is selected
     */
    populateTrueFalse () {
      this.options = [
        {
          text: this.y18n('choiceQuestion.edit.true'),
          simple: this.y18n('choiceQuestion.edit.true'),
          flagged: false,
          id: uuidv4()
        },
        {
          text: this.y18n('choiceQuestion.edit.false'),
          simple: this.y18n('choiceQuestion.edit.false'),
          flagged: false,
          id: uuidv4()
        }
      ]
      this.variation = this.tf
    },

    /**
     * @description prevent change to true/false before modal 'ok' is clicked
     * @param e 'click' event from radio button
     */
    switchToTF (e) {
      e.preventDefault()
      this.$bvModal.show('confirm-change-tf')
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
</style>
