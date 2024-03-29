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
      <p
        v-for="str in y18n('choiceQuestion.tooltip').split(';')"
        :key="str.length"
      >
        <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
        <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
      </p>
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
      <content-title-edit
        :title="title"
        @set-title="title = $event"
      >
      </content-title-edit>

      <!-- task -->
      <content-task-edit
        :task="task"
        @set-task="task = $event"
      >
      </content-task-edit>

      <!-- task audio
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

         task audio simple
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
      -->
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
              :placeholder="y18n('plugin.sampleOption')"
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
              <i
                class="fas fa-times"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- caption simple -->
          <label
            :for="'option-text-'+i"
            class="col-form-label col-2"
          >
            {{ y18n('simpleAlt') }}

          </label>

          <div class="col-7">
            <input
              v-if="variation === single || variation === multiple"
              :id="'option-text-'+i"
              v-model="options[i].simple"
              class="form-control"
              type="text"
              :placeholder="y18n('simpleAlt')"
            >
            <input
              v-else
              :id="'option-text-'+i"
              v-model="option.simple"
              class="form-control"
              type="text"
              readonly
            >
            <p
              v-if="isMissing(option)"
              id="'missing-simple-language' + i"
            >
              {{ y18n('simpleAlt.missing') }}
            </p>
          </div>
        </div>
      </div>

      <button
        v-if="variation === single || variation === multiple"
        type="button"
        class="btn btn-success btn-sm"
        @click="_itemAdd(options, newItem())"
      >
        <i
          class="fas fa-plus"
          aria-hidden="true"
        ></i>{{ y18n('itemAdd') }}
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
import ContentTitleEdit from '@/components/helpers/content-title-edit'
import ContentTaskEdit from '@/components/helpers/content-task-edit'

export default {
  name: 'ChoiceQuestionEdit',
  components: { ContentTitleEdit, ContentTaskEdit },
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
        simple: '',
        text: '',
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
    },
    /**
     * Function isMissing: Checks if simple language is filled in
     * Author: nv
     * Since: v1.3.0
     */
    isMissing (option) {
      return !option.simple
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
