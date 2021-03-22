<!--
Filename: view.vue
Use: Display Drag & Drop content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/i18n/plugins/laya-la-drag-drop
-->

<template>
  <div class="laya-quiz-drag-drop">
    <div class="container">

      <div class="row mb-3">
        <div class="col">
          <h4>
            {{title}}
            <laya-audio-inline v-if="taskAudio" :src="taskAudio">
            </laya-audio-inline>
          </h4>
          <p>{{task}}</p>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="col">
          <div v-for="(item,i) in items" :key="item.label" class="item mb-5">
            <h4 class="text-center item-label">
              {{ item.label }}
              <i v-if="checked"
                 class="fas"
                 :class="{
                 'fa-check text-success': eval[i],
                 'fa-times text-danger': !eval[i]}">
              </i>
            </h4>

            <div class="d-flex justify-content-between">
              <b v-for="cat in categories" :key="cat">{{cat}}</b>
            </div>
            <input type="range"
                   class="custom-range"
                   min="0"
                   :max="categories.length-1"
                   :disabled="checked"
                   v-model.number="solution[i]">
          </div>
        </div>
      </div>

      <div class="row">
        <button type="button"
                class="btn btn-link mt-3"
                :disabled="checked"
                @click="check">
          {{ i18n.check }}
        </button>
        <button type="button"
                class="btn btn-primary mt-3 ml-auto"
                @click="done">
          {{ i18n.nextContent }} <i class="fas fa-arrow-right"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/plugins/laya-la-drag-drop';

export default {
  name: 'laya-quiz-drag-drop',
  created () {
    this.mapSolutions()
    this.fetchData()
  },
  data () {
    if (Object.entries(this.$attrs).length === 5) //for showing preview
      return {
        ...this.$attrs,
        checked: false,
        solution: [], // users solution as index
        eval: []
      }
    return {
      checked: false,
      solution: [], // users solution as index
      eval: [], // list of booleans
      title: '',
      task: '',
      taskAudio: '',
      items: [],
      categories: [],
    }
  },
  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters(['hasContent', 'profileLang']),

     /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 12, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function done: execute function from onFinish[0]
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    done() {
      this.onFinish[0]()
    },

    /**
     * Function check: check if given answers are correct
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    check() {
      if (this.eval.length == 0) {
        for(let i=0; i<this.solution.length; i++) {
          let solution = this.solution[i]
          this.eval[i] = (solution == this.items[i].category)
        }
      }
      
      this.checked = !this.checked
      //this.$forceUpdate()
    },

    /**
     * Function mapSolutions: initialize rendered ranges to the middle
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    mapSolutions() {
      const mid = Math.floor((this.categories.length)/2)
      let s = this.items.map(i => mid)
      this.solution = [...s]
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
      const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
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
.item {
  margin-bottom: 2rem;
}
.item:last-child {
  margin-bottom: 0rem;
}
</style>
