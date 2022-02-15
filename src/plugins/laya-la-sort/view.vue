<!--
Filename: view.vue
Use: view a Sort content block
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="laya-quiz-sort">
    <div class="container">
      <div class="row mb-3">
        <div>
          <h4>{{ i18n['task'] }}</h4>
          <p>{{ task }}</p>
        </div>
      </div>
      <div class="row py-2 ly-bg-grey">
        <div class="col-5">
          <h4>{{ i18n['layaLaSort.unsorted'] }}</h4>
          <div class="d-flex flex-column">
            <button
              v-for="(us,i) in unsorted"
              :key="i"
              class="btn btn-outline-dark mb-2"
              @click="moveToSorted(i)"
            >
              {{ us.label }}
            </button>
          </div>
        </div>
        <div class="col-5">
          <h4>{{ i18n['layaLaSort.sortHere'] }}</h4>
          <div class="d-flex flex-column">
            <button
              v-for="(s,i) in solution"
              :key="i"
              class="btn btn-outline-dark mb-2"
              @click="moveToUnsorted(i)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
        <div class="col-2">
          <h4 style="color: transparent">
            {{ i18n['layaLaSort.e'] }}
          </h4>
          <div class="d-flex flex-column">
            <i
              v-for="(r,i) in result"
              :key="i"
              class="fas fa-2x text-center result-icon"
              :class="{'fa-check text-success': r, 'fa-times text-danger': !r}"
            >
            </i>
          </div>
        </div>
      </div>
      <div class="row mt-3 justify-content-end">
        <button
          type="button"
          class="btn btn-primary btn-lg"
          :disabled="unsorted.length !== 0"
          @click="check"
        >
          {{ i18n['layaLaSort.done'] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { locale, watchContent } from '@/mixins'

export default {
  name: 'LayaQuizSort',

  mixins: [
    locale,
    watchContent
  ],

  props: {
    task: {
      type: String,
      default () { return '' }
    },
    sorted: {
      type: Array,
      default () { return [] }
    }
  },

  data () {
    return {
      unsorted: [], // the shuffled options from this.sorted
      solution: [], // the solution of the user
      result: [] // list of booleans
    }
  },

  created () {
    this.unsorted = this.shuffle([...this.sorted])
  },

  methods: {

    /**
     * Function moveToSorted: remove an item from unsorted and push to solutions
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     *
     * @param {*} i index of item
     */
    moveToSorted (i) {
      this.solution.push(this.unsorted.splice(i, 1)[0])
    },

    /**
     * Function moveToUnsorted: remove an item from solution and push to unsorted
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     *
     * @param {*} i index of item
     */
    moveToUnsorted (i) {
      this.unsorted.push(this.solution.splice(i, 1)[0])
    },

    /**
     * Function check: check if the solution order is correct
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     */
    check () {
      for (let i = 0; i < this.sorted.length; i++) {
        this.result[i] = (this.sorted[i].order === this.solution[i].order)
      }
      this.$forceUpdate()
    },

    /**
     * Function shuffle: shuffle any array
     *
     * Creator: core
     *
     * Last Updated: May 6, 2021
     *
     * @param {Array} arr array to be shuffled
     */
    shuffle (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = arr[j]
        arr[j] = arr[i]
        arr[i] = tmp
      }
      return arr
    }
  }
}
</script>

<style scoped>
.result-icon {
  padding-bottom: 0.879rem;
}
</style>
