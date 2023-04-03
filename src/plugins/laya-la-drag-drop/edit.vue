<!--
Filename: edit.vue
Use: Edit existing Drag & Drop content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    class="laya-la-drag-drop-new"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h4 class="d-inline-block mr-auto">
        {{ y18n('layaLaDragDrop.name') }}
      </h4>
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
      :header="y18n('layaLaDragDrop.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('layaLaDragDrop.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <!-- title -->
      <div class="form-group row">
        <label
          for="drag-drop-title"
          class="col-2 col-form-label"
        >
          {{ y18n('title') }}
        </label>
        <div class="col-10">
          <input
            id="drag-drop-title"
            v-model="title.text"
            type="text"
            class="form-control"
            :placeholder="y18n('titlePlaceholder')"
          >
        </div>
      </div>
      <!-- simple language alt -->
      <div
        v-if="courseSimple"
        class="form-group row"
      >
        <label
          for="drag-drop-title-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ y18n('simpleAlt') }}
          </span>
        </label>
        <div class="col-10">
          <input
            id="drag-drop-title-simple"
            v-model="title.simple"
            type="text"
            class="form-control"
            :placeholder="y18n('simpleAlt')"
          >
        </div>
      </div>

      <!-- task -->
      <div class="form-group row">
        <span
          class="col-2 col-form-label"
        >
          {{ y18n('task') }}
        </span>
        <div class="col-10">
          <textarea
            id="drag-drop-task"
            v-model="task.text"
            class="w-100"
            :placeholder="y18n('taskPlaceholder')"
          ></textarea>
        </div>
      </div>

      <!-- task simple -->
      <div
        v-if="courseSimple"
        class="form-group row"
      >
        <span
          class="col-2 col-form-labelsr-only"
        >
          {{ y18n('simpleAlt') }}
        </span>
        <div class="col-10">
          <textarea
            id="drag-drop-task-simple"
            v-model="task.simple"
            class="w-100"
            :placeholder="y18n('simpleAlt')"
          ></textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label
          for="drag-drop-task-audio"
          class="col-2 col-form-label"
        >
          {{ y18n('taskAudio') }}
        </label>
        <div class="col-10">
          <input
            id="drag-drop-task-audio"
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
          for="drag-drop-task-audio-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ y18n('simpleAlt') }}
          </span>
        </label>
        <div class="col-10">
          <input
            id="drag-drop-task-audio-simple"
            v-model="taskAudio.simple"
            type="text"
            class="form-control"
            :placeholder="y18n('simpleAlt')"
          >
        </div>
      </div>

      <p><b>{{ y18n('layaLaDragDrop.cats') }}</b></p>
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
          >{{ y18n('text') }}</label>
          <div class="col-7">
            <input
              :id="'cat-text-'+i"
              v-model="cat.text"
              class="form-control"
              type="text"
            >
          </div>
          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="y18n('deleteField')"
              @click="_delCategory(i)"
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
            >
          </div>
        </div>
      </div>

      <!-- add category -->
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addCategory"
          >
            <i class="fas fa-plus"></i>
            {{ y18n('layaLaDragDrop.catAdd') }}
          </button>
        </div>
      </div>

      <!-- items -->
      <p>
        <b>{{ y18n('items') }}</b>
      </p>
      <div
        v-for="(item, i) in items"
        :key="'item-'+i"
        class="form-group"
      >
        <div class="row">
          <!-- text -->
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
            >
          </div>

          <!-- category -->
          <div class="col-3">
            <select
              v-model="items[i].category"
              class="custom-select"
            >
              <option
                disabled
                :value="-1"
              >
                {{ y18n('cat') }}
              </option>
              <option
                v-for="(cat,j) in categories"
                :key="cat.text"
                :value="j"
              >
                {{ cat.text }}
              </option>
            </select>
          </div>

          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
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
            >
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addItem(y18n('layaLaScmc.edit.sampleOption'))"
          >
            <i class="fas fa-plus"></i>
            {{ y18n('itemAdd') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, routes, tooltipIcon } from '@/mixins'
import commonMethods from './common-methods'

export default {
  name: 'LayaLaDragDropEdit',

  mixins: [
    commonMethods,
    locale,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      title: {},
      task: {},
      taskAudio: '',
      items: [],
      categories: []
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple'])
  },

  created () {
    this.fetchData()
  },

  methods: {
    /**
     * Function fetchData(): fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 12, 2021
     */
    fetchData () {
      const preData = JSON.parse(JSON.stringify(this.courseContent[this.pathId]))
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
