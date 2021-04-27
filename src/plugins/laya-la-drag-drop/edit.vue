<!-- 
Filename: edit.vue
Use: Edit existing Drag & Drop content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/i18n/plugins/laya-la-drag-drop
-->

<template>
  <div class="laya-la-drag-drop-edit">

    <label><h4>{{ i18n.name }}</h4></label><i id ="questionmark" class="fas fa-question-circle" @click="toggleTip" 
          :title="i18n.showTip" v-b-tooltip.left></i>
    <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.name" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <span v-html="i18n.tooltip"></span>

    </b-jumbotron>
    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="scms-title" class="col-2 col-form-label">{{ i18n.title }}</label>
        <div class="col-10">
          <input id="scms-title"
                 type="text"
                 v-model="title"
                 class="form-control"
                 :placeholder="i18n.titlePlaceholder">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="smcs-task" class="col-2 col-form-label">
          {{ i18n.task }}
        </label>
        <div class="col-10">
          <textarea id="scms-task"
                    v-model="task"
                    class="w-100"
                    :placeholder="i18n.taskPlaceholder">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="smcs-task-audio" class="col-2 col-form-label">
          {{ i18n.taskAudio }}
        </label>
        <div class="col-10">
          <input id="scms-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 :placeholder="i18n.taskAudioPlaceholder">
        </div>
      </div>

      <p><b>{{ i18n.cats }}</b></p>
      <div class="form-group row" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'cat-text-'+i">{{ i18n.text }}</label>
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
            <i class="fas fa-plus"></i>{{ i18n.catAdd }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n.items }}</b></p>
      <div class="form-group row" v-for="(it, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">{{ i18n.text }}</label>
        <div class="col-5">
          <input :id="'item-text-'+i"
            class="form-control"
            type="text"
            v-model="items[i].label">
        </div>

        <!-- category -->
        <div class="col-3">
          <select class="custom-select" v-model="items[i].category">
            <option disabled :value="-1">{{ i18n.cat }}</option>
            <option v-for="(cat,j) in categories" :value="j" :key="cat">
            {{ cat }}
            </option>
          </select>
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
            <i class="fas fa-plus"></i>{{ i18n.itemAdd }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/plugins/laya-la-drag-drop';

export default {
  name: 'laya-la-drag-drop-edit',
  created () {
    this.fetchData()
  },
  data () {
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
    ...mapGetters(['content', 'profileLang']),

    /**
    * i18n: Load translation files depending on user language
    * 
    * Author: cmc
    * 
    * Last updated: March 12, 2021
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
      this.items.push({label: '', category: -1})
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
