<!--
Filename: create.vue
Use: Creating a new Drag & Drop content block
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
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
        @click="toggleTip"
      ></i>
    </div>

    <b-jumbotron
      v-if="tooltipOn"
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
            :for="'cat-simple-'+i"
            class="col-form-label col-2"
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
        v-for="(it, i) in items"
        :key="'item-'+i"
        class="form-group"
      >
        <div class="row">
          <!-- text -->
          <label
            class="col-form-label col-2"
            :for="'item-text-'+i"
          >
            {{ y18n('text') }}
          </label>
          <div class="col-5">
            <input
              :id="'item-text-'+i"
              v-model="items[i].label"
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
            :for="'item-simple-'+i"
            class="col-form-label col-2"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-5">
            <input
              :id="'item-simple-'+i"
              v-model="it.simple"
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
import { locale, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaLaDragDropNew',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      title: {},
      task: {},
      taskAudio: {},
      items: [],
      categories: []
    }
  },

  computed: {
    ...mapGetters(['courseSimple'])
  },

  created () {
    this.fillFormSamples()
    this.populateVars()
  },

  methods: {
    /**
     * Function fillFormSamples: fill form with example names in locale
     *
     * Author: cmc
     *
     * Last Updated: March 12, 2021
     */
    fillFormSamples () {
      // fill item and category props with localized tokens
      if (this.categories.length === 0) {
        const temp = this.y18n('layaLaDragDrop.answer') + ' 1'
        const tmpItem = {
          label: temp,
          simple: 'simple lang alternative',
          category: -1,
          flagged: false,
          id: uuidv4()
        }
        this.items.push(tmpItem)

        for (let i = 1; i < 3; i++) {
          const tmp = this.y18n('cat') + ' ' + i
          this.categories.push({
            text: tmp,
            simple: 'simple language alternative'
          })
        }
      }
    },

    populateVars () {
      this.title = {
        text: '',
        flagged: false,
        id: uuidv4()
      }
      this.task = {
        text: '',
        flagged: false,
        id: uuidv4()
      }
    },

    /**
     * Function _delItem: remove item at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove
     */
    _delItem (idx) {
      this.items.splice(idx, 1)
    },

    /**
     * Function _addItem: Add new item to items
     * Author: core
     * Last Updated: June 6, 2021
     * @param {string} str string to be added
     */
    _addItem (str) {
      this.items.push({ label: str, category: -1, flagged: false, id: uuidv4() })
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
    _delCategory (idx) {
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
    _addCategory () {
      this.categories.push({})
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
