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
import * as i18n from "@/i18n/plugins/laya-la-drag-drop";

export default {
  name: "laya-quiz-drag-drop",
  created () {
    const mid = Math.floor((this.categories.length+1)/2)
    let s = this.items.map(i => mid)
    this.solution = [...s]
  },
  data () {
    return {
      checked: false,
      solution: [], // users solution as index
      eval: [], // list of booleans
    }
  },
  props: {
    title: String,
    task: String,
    taskAudio: String,
    items: Array,
    categories: Array,
    onFinish: Array
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    done() {
      this.onFinish[0]()
    },
    check() {
      if (this.eval.length == 0) {
        for(let i=0; i<this.solution.length; i++) {
          let solution = this.solution[i]
          this.eval[i] = (solution == this.items[i].category)
        }
      }
      
      this.checked = !this.checked
      //this.$forceUpdate()
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
