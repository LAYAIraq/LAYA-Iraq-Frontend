<!--
  Filename: feedback-edit.vue
  Use: Edit or create Course Feedback content block
  Creator: pj
  Since: v1.1.0
-->

<template>
  <div
    class="feedback-edit"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h2
        class="d-inline-block"
        :class="langIsAr? 'ml-auto' : 'mr-auto'"
      >
        {{ y18n('feedback.name') }}
      </h2>
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
      :header="y18n('feedback.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('feedback.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>

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

      <!-- task audio -->
      <div class="form-group row">
        <label
          for="feedback-task-audio"
          class="col-2 col-form-label"
        >
          {{ y18n('taskAudio') }}
        </label>
        <div class="col-10">
          <input
            id="feedback-task-audio"
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
        class="form-group row"
      >
        <label
          for="feedback-task-audio-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ y18n('simpleAlt') }}
          </span>
        </label>
        <div class="col-10">
          <input
            id="feedback-task-audio-simple"
            v-model="taskAudio.simple"
            type="text"
            class="form-control"
            :placeholder="y18n('simpleAlt')"
          >
        </div>
      </div>

      <!-- Answers -->
      <p><b>{{ y18n('feedback.edit.questions') }}</b></p>
      <div
        v-for="(item, i) in items"
        :key="'item-'+i"
        class="form-group"
      >
        <!-- text -->
        <div class="row">
          <label
            class="col-form-label col-2"
            :for="`item-text-${item.id}`"
          >
            {{ y18n('text') }}
          </label>
          <div class="col-5">
            <input
              :id="`item-text-${item.id}`"
              v-model="item.label"
              class="form-control"
              type="text"
              :placeholder="y18n('plugin.sampleOption')"
            >
          </div>

          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_itemDelete(items, i)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- simple item -->
          <label
            class="col-form-label col-2"
            :for="'item-simple-'+i"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-5">
            <input
              :id="'item-simple-'+i"
              v-model="item.simple"
              class="form-control"
              type="text"
              :placeholder="y18n('simpleAlt')"
            >
            <p
              v-if="isMissing(item)"
              id="'missing-simple-language-item-' + i"
            >
              {{ y18n('simpleAlt.missing') }}
            </p>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_itemAdd(items, newItem())"
          >
            <i class="fas fa-plus"></i>{{ y18n('feedback.edit.addQuestion') }}
          </button>
        </div>
      </div>

      <!-- Categories -->
      <p>
        <b>
          {{ y18n('feedback.edit.answers') }}
        </b>
      </p>
      <div
        v-for="(cat, i) in categories"
        :key="'cat-'+i"
        class="form-group"
      >
        <!-- text -->
        <div class="row">
          <label
            class="col-form-label col-2"
            :for="'cat-text-'+i"
          >
            {{ y18n('text') }}
          </label>
          <div class="col-7">
            <input
              :id="'cat-text-'+i"
              v-model="cat.text"
              class="form-control"
              type="text"
              :placeholder="y18n('plugin.sampleOption')"
            >
          </div>

          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_itemDelete(categories, i)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <!-- simple alt -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            class="col-form-label col-2"
            :for="'cat-simple-'+i"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-7">
            <input
              :id="'cat-simple-'+i"
              v-model="cat.simple"
              class="form-control"
              type="text"
              :placeholder="y18n('simpleAlt')"
            >
            <p
              v-if="isMissing(cat)"
              id="'missing-simple-language-cat-' + i"
            >
              {{ y18n('simpleAlt.missing') }}
            </p>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_itemAdd(categories)"
          >
            <i class="fas fa-plus"></i>{{ y18n('feedback.edit.addAnswer') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { deepCopy } from '@/mixins/general/helpers'
import { array, locale, routes, pluginEdit, tooltipIcon } from '@/mixins'
import ContentTitleEdit from '@/components/helpers/content-title-edit'
import ContentTaskEdit from '@/components/helpers/content-task-edit'

export default {
  name: 'FeedbackEdit',
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
      items: [],
      categories: [],
      id: ''
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple'])
  },

  created () {
    if (this.edit) {
      this.fetchData()
    } else {
      this.fillForm()
      this.taskTitlePopulate()
    }
  },

  methods: {
    /**
     * Function fetchData: Fill in localized sample input
     *
     * Author: cmc
     *
     * Last Updated: August 15, 2021
     */
    fetchData () {
      const preData = deepCopy(this.courseContent[this.pathId])
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.items = preData.items
      this.categories = preData.categories
      this.id = preData.id
    },
    /**
     * Function fillForm: Fill in sample input
     *
     * Author: cmc
     *
     * Last Updated: October 15, 2022 by nv
     */
    fillForm () {
      if (this.categories.length === 0) {
        const tmpItem = {
          label: '',
          simple: '',
          category: -1,
          flagged: false,
          id: uuidv4()
        }
        this.items.push(tmpItem)

        for (let i = 1; i < 3; i++) {
          this.categories.push({
            text: '',
            simple: ''
          })
        }
      }
    },
    /**
     * @function return new item with empty text
     * @return {{flagged: boolean, label: string, id, category: number}}
     */
    newItem () {
      return { label: '', category: -1, flagged: false, id: uuidv4() }
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
