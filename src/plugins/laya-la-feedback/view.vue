<template>
  <div class="laya-feedback">
    <div class="container">
    
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
                   :disabled="checked"
                   v-model.number="choice[i]">
          </div>
        </div>
      </div>

      <div class="row">
        <div class="column">
          <h4>Freitext hinzufügen</h4>
          <input type="text" class="idk" v-model="freetext">
        </div>
      </div>
      

      <div class="row">
       
        <button type="button"
                class="btn btn-primary mt-3 ml-auto"
                @click="done">
          Nächster Inhalt <i class="fas fa-arrow-right"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from "vuex";
import http from "axios";

//import layaWsyisyg from '../misc/laya-html'
export default {
  name: "laya-feedback",
  created () {
    const mid = Math.floor((this.categories.length)/2)
    let s = this.items.map(i => mid)
    this.choice = [...s]
  },
  beforeDestroy() {
    //add saving feedback data
    
  },
  data () {
    return {
      //checked: false,
      choice: [], // users choice as index
      freetext: ""
    }
  },
  props: {
    title: String,
    task: String,
    taskAudio: String,
    items: Array,
    categories: Array,
    onFinish: Array,
    //course: Object,
    //name: String
  },
  computed: {
  },
  methods: {
    done() {
      storeNewFeedback();
      this.onFinish[0]();
    },
    
    storeNewFeedback() {
      
    
      /* check if course exists */
      http.head(`courses/${newCourse.name}`)
        .then(function() {
          self.msg = "Ein Kurs mit diesem Namen existiert bereits"
        }).catch(function() {

          /* create course */
          http.post("courses", {
            ...newCourse,
            authorId: auth.userId,
          }).then(function() {
            self.$router.push(`/courses/${newCourse.name}/1`)
          }).catch((err) => {
            console.log(err)
            self.msg = "Beim Speichern ist ein Fehler aufgetreten"
          })

          /* create storage */
          http.post("storage", {
            name: newCourse.name,
          }).then(() => console.log(`New Storage: ${newCourse.name}`))
            .catch((err) => console.error(err));
        })
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
