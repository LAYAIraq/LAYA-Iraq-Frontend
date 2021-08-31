<!--
Filename: view.vue
Use: View a Relate content block
Creator: core
Date: unknown
Dependencies: 
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div 
    class="laya-quiz-relate"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">

      <div class="flaggable row mb-3" :id="title.id">
        <div class="col">
          <h4>
            {{ title.text }}
            <laya-audio-inline v-if="taskAudio" :src="taskAudio">
            </laya-audio-inline>
          </h4>
        </div>
        <laya-flag
            :refData="title"
            :isOpen="flagOpen"
            @flagged="title.flagged = true"
            @flagOpen="toggleFlagOpen"
        ></laya-flag>
      </div>

      <div class="flaggable row" :id="task.id">
        <div class="col">
          <p>{{ task.text }}</p>
        </div>
        <laya-flag
            :refData="task"
            :isOpen="flagOpen"
            @flagged="task.flagged = true"
            @flagOpen="toggleFlagOpen"
        ></laya-flag>
      </div>

      <hr>

      <div class="row">
        <div class="col">
          
          <form>
            <div 
              v-for="(pair,i) in pairs" 
              :key="pair.id"
              :id="pair.id" 
              class="form-group row flaggable"
              :class="{'flat': flagOpen}"
            >
              <label 
                :for="pair.label+i" 
                class="col-sm-6 col-form-label"
              >
                <img 
                  v-if="pair.img" 
                  :src="pair.img" 
                  :alt="pair.label"
                >
                <laya-audio-inline 
                  :class="langIsAr? 'mr-2' : 'ml-2'" 
                  v-if="pair.audio" 
                  :src="pair.audio"
                >
                </laya-audio-inline>
                {{ pair.label }}
              </label>
              <div class="col-sm-6">
                <select :id="pair.label+i"
                  v-model="solution[i]"
                  :disabled="freeze"
                  class="custom-select">
                  <option disabled>
                    {{ defaultOption }}
                  </option>
                  <option 
                    v-for="opt in options" 
                    :key="opt" 
                    :disabled="solution.includes(opt)"
                  >
                  {{ opt }}
                  </option>
                </select>
                <div class="d-inline-block pt-3 w-100 text-center">
                  <i :class="eval[i]"></i>
                </div>
              </div>
              <laya-flag
                  :refData="pair"
                  :isOpen="flagOpen"
                  :interactive="true"
                  @flagged="pair.flagged = true"
                  @flagOpen="toggleFlagOpen"
              ></laya-flag>
            </div>
          </form>
          
        </div>
      </div>

      <div class="row pt-3">
        
        <button 
          type="button" 
          class="btn btn-warning" 
          @click="reset"
        >
          {{ i18n['layaLaRelate.removeInput']}}
        </button>
       
        <button 
          type="button" 
          class="btn btn-link"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="check" 
          :disabled="freeze">
          {{ i18n['check'] }}
        </button>
          
        <button 
          type="button" 
          class="btn btn-primary"
          :class="langIsAr? 'mr-auto': 'ml-auto'"
          @click="done"
        >
          {{ i18n['nextContent'] }}
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { flagHandling, locale } from '@/mixins'
import '@/styles/flaggables.css'

export default {
  name: 'laya-quiz-relate',

  mixins: [
    flagHandling,
    locale
  ],
  
  data () {
    if (this.previewData) //preview
      return {
        ...this.previewData,
        defaultOption: '',
        solution: [],
        eval: [],
        freeze: false
      }
    return {
      title: {},
      task: {},
      taskAudio: '',
      pairs: [],
      defaultOption: '',
      solution: [],
      eval: [],
      freeze: false
    }
  },
  created () {
    this.defaultOption = this.i18n['layaLaRelate.defaultOption']
    if (!this.previewData) { // no preview 
      this.fetchData()
    }
  },
  props: {
    onFinish: Array,
    previewData: Object
  },
  computed: {
    ...mapGetters(['content']),

    /**
     * options: map pairs to their relation
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    options() {
      return this.pairs.map(p => p.relation)
    }
  },
  watch: {
    content() {
      this.fetchData
      this.$forceUpdate
    }
  },
  methods: {

    /**
     * Function reset: reset relations to default
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    reset() {
      this.solution = this.pairs.map(() => this.defaultOption)
    },

    /**
     * Function done: execute first function from onFinish
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    done() {
      this.onFinish[0]()
    },

    /**
     * Function check: Check if User's solution is correct
     * 
     * Author: core
     * 
     * Last Updated: March 19, 2021
     */
    check() {
      for(let i=0; i<this.pairs.length; ++i) {
        if(this.pairs[i].relation === this.solution[i]) {
          this.eval[i] = {'fa fa-check fa-2x text-success': true}
        } else {
          this.solution[i] = this.pairs[i].relation 
          this.eval[i] = {'fa fa-times fa-2x text-danger': true}
        }
      }
      this.freeze = true
      this.$forceUpdate()
    },

    /**
     * Function fetchData: fethc data from vuex and create data property
     * 
     * Author: cmc
     * 
     * Last Updated: March 19, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
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

img {
  height: 8rem;
}

.form-group.row {
  padding: 15px;
  margin-bottom: 0;
}
.form-group.row:nth-child(2) {
  background-color: #ebece7;
}

</style>
