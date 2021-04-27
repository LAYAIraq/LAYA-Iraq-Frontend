<!--
Filename: view.vue
Use: Display Course Feedback content block
Creator: cmc
Date: unknown
Dependencies: @/i18n/plugins/laya-la-feedback
-->

<template>
  <div class="laya-feedback">

    <b-toast id="feedback-new"
            :title="i18n.bToast.title"
            static
            variant="success"
            auto-hide-delay="1500"
            class="feedback-toast">
      {{ i18n.bToast.successfulSave }}
    </b-toast>

    <b-toast id="feedback-updated"
            :title="i18n.bToast.title"
            static
            variant="success"
            auto-hide-delay="1500"
            class="feedback-toast">
      {{ i18n.bToast.feedbackUpdated }}
    </b-toast>

    <div class="feedback-container-main">
    
      <div class="row mb-3">
        <div class="col">
          <h4>
            {{title}}
          </h4>
          <p>{{task}}</p>
        </div>
      </div>
    
      <hr>

      <div class="row">
        <div class="col">
          <div v-for="(item, i) in items" :key="item" class="item">
            <h4 class="text-center item-label">
              {{ item }}
              
            </h4>

            <div class="d-flex justify-content-between">
              <b v-for="cat in categories" :key="cat">{{cat}}</b>
            </div>
            <input type="range"
                   class="custom-range"
                   min="0"
                   :max="categories.length-1"
                   v-model.number="choice[i]">
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h4>{{ i18n.addFreetext }}</h4>
          <textarea class="w-100 mt-1" rows="5" v-model="freetext">
          </textarea>
        </div>
      </div>
      <div class="row mt-1">
        <div class="col">
          <button type="button" class="btn btn-outline-success btn-block" @click="storeFeedback">
          <i class="fas fa-check"></i>{{ i18n.save }}
          </button>
        </div>
      </div>
      

      <div class="row">
       
        <button type="button"
                class="btn btn-primary mt-3 ml-auto"
                @click="done">
          {{ i18n.nextContent }}<i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import { BToast, BvToast } from 'bootstrap-vue';
import * as i18n from '@/i18n/plugins/laya-la-feedback';

//import layaWsyisyg from '../misc/laya-html'
export default {
  name: 'laya-feedback',
  created() {
    //console.log(Date.parse(this.feedback.created))
    const mid = Math.floor((this.categories.length-1)/2)
    let s = this.items.map(i => mid)
    this.choice = [...s]
    
    // this.getPreviousFeedback()
  },
  beforeDestroy() {
    //add saving feedback data
    
  },
  data () {
    return {
      choice: [], // users choice as index
      freetext: '',
      answered: false,
      step: this.init.fno
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
  props: {
    title: String,
    task: String,
    taskAudio: String,
    items: Array,
    categories: Array,
    init: Object,
    onFinish: Array,
    onSave: Function
  },
  methods: {

    /**
     * Function getPreviousFeedback: fetch eventual previous feedback
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     */
    getPreviousFeedback() { //unused b/c of different data model in development
      for (var i of this.init) {
        if(i.step === this.step) {
          this.answered = true
          let tmp = i
          this.freetext = tmp.freetext
          this.choice = tmp.choice
          this.created = tmp.created
          this.step = tmp.step
          return
        } 
      }
    },

    /**
     * Function done: execute function from onFinish[0]
     * 
     * Creator: cmc
     * 
     * LastUpdated: unknown
     */
    done() {
      this.onFinish[0]();
    },

    /**
     * function bundleFeedback: bundle input in Object to persist
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     */
    bundleFeedback() {
      let now = Date.now()
      const newFeedback = {
          step: this.step,
          created: Date.now(),
          choice: this.choice,
          freetext: this.freetext,
          options: {
            questions: this.items,
            answers: this.categories
          }
        }
        return newFeedback
    },

    /**
     * function storeFeedback: emit feedback to parent component, show toast
     * 
     * Author: cmc
     * 
     * Last Updated: March 12, 2021  
     */
    storeFeedback() {
      const newFeedback = this.bundleFeedback()
      this.onSave(newFeedback)
      this.$forceUpdate()
      !this.answered? 
        this.$bvToast.show('feedback-new') : 
        this.$bvToast.show('feedback-updated')
    }


  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

.item {
  margin-bottom: 2rem;
}
.item:last-child {
  margin-bottom: 0rem;
}

.feedback-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>
