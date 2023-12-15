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
      <div class="col">
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
    </div>
    <hr>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('buttonNavigation.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <p
        v-for="str in y18n('buttonNavigation.tooltip').split(';')"
        :key="str.length"
      >
        <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
        <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
      </p>
    </b-jumbotron>

    <form>
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
              :placeholder="y18n('plugin.sampleOption')"
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
          <p
            v-if="isMissing(answer)"
            id="'missing-simple-language-answer-' + i"
          >
            {{ y18n('simpleAlt.missing') }}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :class="langIsAr? 'float-right': 'float-left'"
            @click="_itemAdd(answers, newItem())"
          >
            <i
              class="fas fa-plus"
              aria-hidden="true"
            ></i>
            {{ y18n('buttonNavigation.addAnswer') }}
          </button>
        </div>
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
import ContentTaskEdit from '@/components/helpers/content-task-edit'

export default {
  name: 'ButtonNavigationEdit',
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
        simple: '',
        text: '',
        flagged: false,
        id: uuidv4()
      }
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

</style>
