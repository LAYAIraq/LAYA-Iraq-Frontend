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
    class="laya-la-drag-drop-edit"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h3 class="d-inline-block mr-auto">
        {{ i18n['layaLaDragDrop.name'] }}
      </h3>
      <i
        id ="questionmark"
        class="fas fa-question-circle"
        @click="toggleTip"
        :title="i18n['showTip']"
        v-b-tooltip.left
      ></i>
    </div>

    <b-jumbotron
      v-if="tooltipOn"
      :header="i18n['layaLaDragDrop.name']"
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span v-html="i18n['layaLaDragDrop.tooltip']"></span>
    </b-jumbotron>
    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <label
          for="drag-drop-title"
          class="col-2 col-form-label"
        >
          {{ i18n['title'] }}
        </label>
        <div class="col-10">
          <input
            id="drag-drop-title"
            type="text"
            v-model="title.text"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
      </div>
      <!-- simple language alt -->
      <div
        class="form-group row"
        v-if="courseSimple"
      >
        <label
          for="drag-drop-title-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ i18n['simpleAlt'] }}
          </span>
        </label>
        <div class="col-10">
          <input
            id="drag-drop-title-simple"
            type="text"
            v-model="title.simple"
            class="form-control"
            :placeholder="i18n['simpleAlt']"
          >
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label
          for="drag-drop-task"
          class="col-2 col-form-label"
        >
          {{ i18n['task'] }}
        </label>
        <div class="col-10">
          <textarea
            id="drag-drop-task"
            v-model="task.text"
            class="w-100"
            :placeholder="i18n['taskPlaceholder']"
          ></textarea>
        </div>
      </div>

      <!-- task simple -->
      <div
        class="form-group row"
        v-if="courseSimple"
      >
        <label
          for="drag-drop-task-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ i18n['simpleAlt'] }}
          </span>
        </label>
        <div class="col-10">
          <textarea
            id="drag-drop-task-simple"
            v-model="task.simple"
            class="w-100"
            :placeholder="i18n['simpleAlt']"
          ></textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label
          for="drag-drop-task-audio"
          class="col-2 col-form-label"
        >
          {{ i18n['taskAudio'] }}
        </label>
        <div class="col-10">
          <input
            id="drag-drop-task-audio"
            type="text"
            v-model="taskAudio.regular"
            class="form-control"
            :placeholder="i18n['taskAudioPlaceholder']">
        </div>
      </div>

      <!-- task audio simple -->
      <div
        class="form-group row"
        v-if="courseSimple"
      >
        <label
          for="drag-drop-task-audio-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ i18n['simpleAlt'] }}
          </span>
        </label>
        <div class="col-10">
          <input
            id="drag-drop-task-audio-simple"
            type="text"
            v-model="taskAudio.simple"
            class="form-control"
            :placeholder="i18n['simpleAlt']">
        </div>
      </div>

      <p><b>{{ i18n['layaLaDragDrop.cats'] }}</b></p>
      <div class="form-group" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <div class="row">
          <label class="col-form-label col-2" :for="'cat-text-'+i">{{ i18n['text'] }}</label>
          <div class="col-7">
            <input
              :id="'cat-text-'+i"
              class="form-control"
              type="text"
              v-model="cat.text"
            >
          </div>
          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="_delCategory(i)"
              :aria-label="i18n['deleteField']"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- simple alt -->
        <div class="row">
          <label
            class="col-form-label col-2"
            :for="'cat-simple-'+i"
          >
            <span class="sr-only">
            {{ i18n['simpleAlt'] }}
          </span>
          </label>
          <div class="col-7">
            <input
              :id="'cat-simple-'+i"
              class="form-control"
              type="text"
              v-model="cat.simple"
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
            @click="_addCategory">
            <i class="fas fa-plus"></i>
            {{ i18n['layaLaDragDrop.catAdd'] }}
          </button>
        </div>
      </div>

      <!-- items -->
      <p>
        <b>{{ i18n['items'] }}</b>
      </p>
      <div
        class="form-group"
        v-for="(item, i) in items"
        :key="'item-'+i"
      >
        <div class="row">
          <!-- text -->
          <label
            class="col-form-label col-2"
            :for="'item-text-'+item.id"
          >
            {{ i18n['text'] }}
          </label>
          <div class="col-5">
            <input
              :id="'item-text-'+i"
              class="form-control"
              type="text"
              v-model="item.label"
            >
          </div>

          <!-- category -->
          <div class="col-3">
            <select
              class="custom-select"
              v-model="items[i].category"
            >
              <option disabled :value="-1">{{ i18n['cat'] }}</option>
              <option
                v-for="(cat,j) in categories"
                :value="j"
                :key="cat.text"
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
              @click="_delItem(i)"
              :aria-label="i18n['deleteField']"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="row">
          <!-- simple item -->
          <label
            class="col-form-label col-2"
            :for="'item-simple-'+i"
          >
            <span class="sr-only">
            {{ i18n['simpleAlt'] }}
          </span>
          </label>
          <div class="col-5">
            <input
              :id="'item-simple-'+i"
              class="form-control"
              type="text"
              v-model="item.simple"
            >
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addItem(i18n['layaLaScmc.edit.sampleOption'])"
          >
            <i class="fas fa-plus"></i>
            {{ i18n['itemAdd'] }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'laya-la-drag-drop-edit',

  mixins: [
    locale,
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
    ...mapGetters(['content']),
  },

  created () {
    this.fetchData()
  },

  methods: {
    /**
     * Function _delItem: remove item at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove
     */
    _delItem(idx) {
      this.items.splice(idx, 1)
    },

    /**
     * Function _addItem: Add new item to items
     * Author: core
     * Last Updated: June 6, 2021
     * @param {string} str string to be added
     */
    _addItem(str) {
      this.items.push({label: str, category: -1, flagged: false, id: uuidv4()})
    },

    /**
     * Function _delCategory: delete category at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove the category
     */
    _delCategory(idx) {
      this.categories.splice(idx, 1)
    },

    /**
     * Function _addCategory: Add new category to categories
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     */
    _addCategory() {
      this.categories.push('')
    },

    /**
     * Function fetchData(): fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 12, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
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
