<!--
Filename: button-navigation-edit.vue
Use: Edit Button Navigation content block
Creator: core
Since: v1.0.0
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="row">
      <h2 class="d-inline-block mr-auto">
        {{ y18n('buttonNavigation.name') }}
      </h2>

      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :class="langIsAr? 'mr-auto' : 'ml-auto'"
        :title="y18n('showTip')"
        aria-labelledby="tooltipText"
        aria-live="polite"
        @click="toggleTip"
      ></i>
    </div>
    <hr>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('buttonNavigation.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('buttonNavigation.tooltip') }}
      </span>
    </b-jumbotron>

    <form>
      <!-- title -->
      <content-title-edit
        :title="title"
        @set-title="title = $event"
      >
      </content-title-edit>
      <div class="form-group">
        <!-- task -->
        <div class="row">
          <label
            for="dialog-question"
            class="col-2 col-form-label"
          >
            {{ y18n('task') }}
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question"
              v-model="task.text"
              class="w-100"
              :placeholder="y18n('buttonNavigation.optional')"
            ></textarea>
          </div>
        </div>
        <!-- task simple -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="dialog-question-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('task') }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question-simple"
              v-model="task.simple"
              class="w-100"
              :placeholder="y18n('simpleAlt')"
            ></textarea>
          </div>
        </div>
      </div>
      <!-- TODO: TLI-303
      <div class="form-group row">
        <label
          for="dialog-bg"
          class="col-2 col-form-label"
          style="word-wrap: anywhere"
        >
          {{ y18n('buttonNavigation.bgURL') }}
        </label>
        <div class="col-10">
          <input
            id="dialog-bg"
            v-model="bg"
            type="text"
            class="form-control"
            :placeholder="y18n('buttonNavigation.bgPlaceholder')"
          >
        </div>
      </div>
      -->

      <p><b>{{ y18n('buttonNavigation.answers') }}</b></p>
      <div
        v-for="(answer, i) in answers"
        :key="'answer-'+i"
        class="form-group"
      >
        <div class="row">
          <!-- text -->
          <label
            class="col-form-label col-2"
            :for="'answer-text-'+i"
          >
            {{ y18n('text') }}
          </label>
          <div class="col-5">
            <textarea
              :id="'answer-text-'+i"
              v-model="answer.text"
              class="form-control"
              style="height: 6rem; font-size: 80%"
            ></textarea>
          </div>
          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_itemDelete(answers, i)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- item simple -->
          <label
            class="col-form-label col-2"
            :for="`answer-text-simple-${i}`"
          >
            <span class="sr-only">
              {{ y18n('text') }}
            </span>
          </label>
          <div class="col-5">
            <textarea
              :id="`answer-text-simple-${i}`"
              v-model="answer.simple"
              class="form-control"
              style="height: 6rem; font-size: 80%"
              :placeholder="y18n('simpleAlt')"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="row">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="_itemAdd(answers, newItem())"
        >
          <i class="fas fa-plus"></i>
          {{ y18n('buttonNavigation.addAnswer') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { array, locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { deepCopy } from '@/mixins/general/helpers'
import ContentTitleEdit from '@/components/helpers/content-title-edit'

export default {
  name: 'ButtonNavigationEdit',
  components: { ContentTitleEdit },

  mixins: [
    array,
    locale,
    pluginEdit,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      bg: '',
      task: {},
      answers: [],
      title: {}
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple'])
  },

  created () {
    if (this.edit) {
      this.fetchData()
    } else {
      this.taskTitlePopulate()
      this._itemAdd(this.answers, this.newItem())
    }
  },

  methods: {
    /**
     * Function fetchData: Fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      // create deep copy of store object to manipulate in vue instance
      const preData = deepCopy(this.courseContent[this.pathId])
      // this.bg = preData.bg // reinstate when TLI-303 is tackled
      this.task = preData.task
      this.answers = preData.answers
      this.title = preData.title
    },

    /**
     * @function return new item
     * @author cmc
     * @returns {object} new item
     */
    newItem () {
      return {
        simple: this.y18n('simpleAlt'),
        text: this.y18n('plugin.sampleOption'),
        flagged: false,
        id: uuidv4()
      }
    }
  }
}
</script>

<style scoped>

</style>
