<!--
Filename: edit.vue
Use: Edit a Course Feedback content block
Creator: cmc
Date: unknown
Dependencies: @/i18n/plugins/laya-la-feedback
-->

<template>
  <div class="laya-la-feedback-edit">

     <label><h4>{{ i18n.title }}</h4></label><i id ="questionmark" class="fas fa-question-circle" @click="toggleTip" 
          :title="i18n.showTip" v-b-tooltip.left></i>
    <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.title" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <span v-html="i18n.tooltip"></span>

    </b-jumbotron>
    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="feedback-title" class="col-2 col-form-label">{{ i18n.edit.title }}</label>
        <div class="col-10">
          <input id="feedback-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="feedback-task" class="col-2 col-form-label">
          {{ i18n.edit.desc }}
        </label>
        <div class="col-10">
          <textarea id="feedback-task"
                    v-model="task"
                    class="w-100">
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

      <p><b>{{ i18n.edit.answers }}</b></p>
      <div class="form-group row" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'cat-text-'+i">{{ i18n.edit.text }}</label>
        <div class="col-7">
          <input :id="'cat-text-'+i"
            class="form-control"
            type="text"
            v-model="categories[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delCategory(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addCategory">
            <i class="fas fa-plus"></i>{{ i18n.edit.addAnswer }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n.edit.questions }}</b></p>
      <div class="form-group row" v-for="(item, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">{{ i18n.edit.text }}</label>
        <div class="col-5">
          <input :id="item"
            class="form-control"
            type="text"
            v-model="items[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delItem(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addItem">
            <i class="fas fa-plus"></i>{{ i18n.edit.addQuestion }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import * as i18n from '@/i18n/plugins/laya-la-feedback'

export default {
  name: 'laya-la-feedback-edit',
  created () {
    this.fetchData()
  },
  data () {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs, 
        tooltipOn: false}
    return {
      title: '',
      task: '',
      taskAudio: '',
      items: [],
      categories: [],
      tooltipOn: false
    }
  },
  
  computed: {

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 12, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
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
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     */
    _addItem() {
      this.items.push('')
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
     * Function fetchData: Fill in localized sample input
     * 
     * Author: cmc
     * 
     * Last Updated: March 12, 2021
     */
    fetchData() {
      if (this.title === '') { //prefetch Data at creation
        const prefData = this.i18n.prefetch
        this.title = prefData.title
        this.task = prefData.task
        this.items = prefData.items
        this.categories = prefData.categories
      }
    },

    /**
     * Function toggleTip: toggle tooltipOn boolean
     * 
     * Author: cmc
     * 
     * Last updated: unknown
     */
    toggleTip() {
      this.tooltipOn = !this.tooltipOn
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
  float: inline-end;
  cursor: pointer;
}
</style>
