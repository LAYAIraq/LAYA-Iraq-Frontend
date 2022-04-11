<!--
Filename: edit.vue
Use: Edit a Course Feedback content block
Creator: pj
Date: 17.08.2021
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    class="laya-la-feedback-edit"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <label>
      <h4>
        {{ y18n('layaLaFeedback.name') }}
      </h4>
    </label>
    <i
      id="questionmark"
      v-b-tooltip.left
      class="fas fa-question-circle"
      :title="y18n('showTip')"
      @click="toggleTip"
    ></i>
    <b-jumbotron
      v-if="tooltipOn"
      :header="y18n('layaLaFeedback.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('layaLaFeedback.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <!-- title -->
      <div class="form-group row">
        <label
          for="feedback-title"
          class="col-2 col-form-label"
        >
          {{ y18n('title') }}
        </label>
        <div class="col-10">
          <input
            id="feedback-title"
            v-model="title"
            type="text"
            class="form-control"
          >
        </div>
      </div>

      <!-- task -->
      <div class="form-group row">
        <label
          for="feedback-task"
          class="col-2 col-form-label"
        >
          {{ y18n('layaLaFeedback.edit.desc') }}
        </label>
        <div class="col-10">
          <textarea
            id="feedback-task"
            v-model="task"
            class="w-100"
          >
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <!--
      <div class="form-group row">
        <label for="feedback-task-audio" class="col-2 col-form-label">
          Offstimme
        </label>
        <div class="col-10">
          <input id="feedback-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 placeholder="z.B. https://www.laya.de/offstimme.mp3">
        </div>
      </div>
      -->

      <p>
        <b>
          {{ y18n('layaLaFeedback.edit.answers') }}
        </b>
      </p>
      <div
        v-for="(cat, i) in categories"
        :key="'cat-'+i"
        class="form-group row"
      >
        <!-- text -->
        <label
          class="col-form-label col-2"
          :for="'cat-text-'+i"
        >
          {{ y18n('text') }}
        </label>
        <div class="col-7">
          <input
            :id="'cat-text-'+i"
            v-model="categories[i]"
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
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addCategory"
          >
            <i class="fas fa-plus"></i>{{ y18n('layaLaFeedback.edit.addAnswer') }}
          </button>
        </div>
      </div>

      <p><b>{{ y18n('layaLaFeedback.edit.questions') }}</b></p>
      <div
        v-for="(item, i) in items"
        :key="'item-'+i"
        class="form-group row"
      >
        <!-- text -->
        <label
          class="col-form-label col-2"
          :for="item"
        >{{ y18n('text') }}</label>
        <div class="col-5">
          <input
            :id="item"
            v-model="items[i]"
            class="form-control"
            type="text"
          >
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
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addItem('')"
          >
            <i class="fas fa-plus"></i>{{ y18n('layaLaFeedback.edit.addQuestion') }}
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
  name: 'LayaLaFeedbackEdit',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    if (Object.entries(this.$attrs).length > 0) {
      return {
        ...this.$attrs,
        tooltipOn: false
      }
    }
    return {
      title: '',
      task: '',
      taskAudio: '',
      items: [],
      categories: []

    }
  },

  computed: {
    ...mapGetters(['content'])
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
    _delItem (idx) {
      this.items.splice(idx, 1)
    },

    /**
     * Function _addItem: Add new item to items
     *
     * Author: core
     *
     * Last Updated: unknown
     *
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
      this.categories.push('')
    },

    /**
     * Function fetchData: Fill in localized sample input
     *
     * Author: cmc
     *
     * Last Updated: August 15, 2021
     */
    /* fetchData() {
      if (this.title === '') { //prefetch Data at creation
        this.title = this.y18n('layaLaFeedback.name')
        this.task = this.y18n('layaLaFeedback.prefetch.task')
        this.items = this.y18n('layaLaFeedback.prefetch.items').split(',')
        this.categories = this.y18n('layaLaFeedback.prefetch.categories').split(',')
      }
    } */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
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
