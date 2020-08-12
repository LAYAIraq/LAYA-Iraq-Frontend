<template>
  <div class="laya-quiz-sort">
    <div class="container">
      <div class="row mb-3">
        <div>
          <h4>{{ i18n.task }}</h4>
          <p>{{task}}</p>
        </div>
      </div>
      <div class="row py-2 ly-bg-grey">
        <div class="col-5">
          <h4>{{ i18n.unsorted }}</h4>
          <div class="d-flex flex-column">
            <button
              v-for="(us,i) in unsorted"
              :key="i"
              class="btn btn-outline-dark mb-2"
              @click="moveToSorted(i)">
              {{us.label}}
            </button>
          </div>
        </div>
        <div class="col-5">
          <h4>{{ i18n.sortHere }}</h4>
          <div class="d-flex flex-column">
            <button
              v-for="(s,i) in solution"
              :key="i"
              class="btn btn-outline-dark mb-2"
              @click="moveToUnsorted(i)">
              {{s.label}}
            </button>
          </div>
        </div>
        <div class="col-2">
          <h4 style="color: transparent">{{ i18n.e }}</h4>
          <div class="d-flex flex-column">
            <i v-for="(r,i) in result"
               :key="i"
               class="fas fa-2x text-center result-icon"
               :class="{'fa-check text-success': r, 'fa-times text-danger': !r}">
            </i>
          </div>
        </div>
      </div>
      <div class="row mt-3 justify-content-end">
        <button type="button"
                class="btn btn-primary btn-lg"
                :disabled="unsorted.length !== 0"
                @click="check">
          {{ i18n.done }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import * as i18n from "@/i18n/plugins/laya-la-sort";

export default Vue.extend({
  name: "laya-quiz-sort",
  created () {
    const shuffle = function shuffle(arr) {
      for (let i = arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    this.unsorted = shuffle([...this.sorted])
  },
  data () {
    return {
      unsorted: [], // the shuffled options from this.sorted
      solution: [], // the solution of the user
      result: [], // list of booleans 
    }
  },
  props: {
    task: String,
    sorted: Array,
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    moveToSorted: function(i) {
      this.solution.push(this.unsorted.splice(i,1)[0])
    },
    moveToUnsorted: function(i) {
      this.unsorted.push(this.solution.splice(i,1)[0])
    },
    check: function () {
      for(let i=0; i<this.sorted.length; i++) {
        this.result[i] = (this.sorted[i].order === this.solution[i].order)
      }
      this.$forceUpdate()
    }
  }
})
</script>

<style scoped>
.result-icon {
  padding-bottom: 0.879rem;
}
</style>
