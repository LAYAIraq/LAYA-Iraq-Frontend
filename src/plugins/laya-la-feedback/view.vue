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

      <div class="row">
        <div class="column">
          <h4>{{ i18n.addFreetext }}</h4>
          <input type="text" class="idk" v-model="freetext">
        </div>
        <button type="button" class="btn btn-primary" @click="storeFeedback">
        <i class="fas fa-check"></i>{{ i18n.save }}
      </button>
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

import { BToast, BvToast } from "bootstrap-vue";
import { mapState, mapGetters } from "vuex";
import http from "axios";
import * as i18n from "@/i18n/plugins/laya-la-feedback";

//import layaWsyisyg from '../misc/laya-html'
export default {
  name: "laya-feedback",
  created () {
    // const ctx = this;

    // window.scrollTo(0,0)
    // document.title = `Laya - ${ctx.name}`

    // ctx.$store.commit("setBusy", true);
    // /*
    //  * fetch course */
    // http.get(`courses/${ctx.name}`)
    //   .then(function({ data }) {
    //     ctx.course = data;
    //   })
    //   .catch(err => {
    //     /*
    //      * redirect off invalid course */
    //     console.error(err);
    //     this.$router.push("/courses");
    //   })
    //   .then(() => ctx.$store.commit("setBusy", false));

    const mid = Math.floor((this.categories.length)/2)
    let s = this.items.map(i => mid)
    this.choice = [...s]

    this.getFeedback();
  },
  beforeDestroy() {
    //add saving feedback data
    
  },
  data () {
    return {
      //checked: false,
      choice: [], // users choice as index
      freetext: "",
      answered: false,
    }
  },
  computed: {
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
    feedback: Array,
    onFinish: Array,
    onupdate: Function,
  },
  methods: {
    done: function() {
      this.onupdate;
      this.onFinish[0]();
    },
    storeFeedback: function() {
      if(!this.answered) {
        let newFeedback = {
          id: this.feedback.length,
          choice: this.choice,
          freetext: this.freetext
        }
        this.feedback.push(newFeedback)
        this.answered = true;
        this.$forceUpdate();
        this.$bvToast.show("feedback-new")
      }
      else {
        let index = this.feedback.length-1;
        let updatedFeedback = this.feedback[index];
        updatedFeedback.choice = this.choice;
        updatedFeedback.freetext = this.freetext;
        this.$forceUpdate();
        this.$bvToast.show("feedback-updated")

      }
    },

    getFeedback: function() {
      
    },


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

.feedback-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>
