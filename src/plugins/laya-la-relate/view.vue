<template>
  <div class="laya-quiz-relate">
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
          
          <form>
            <div v-for="(pair,i) in pairs" :key="i+'-'+uid" class="form-group row">
              <label :for="pair.label+uid" class="col-sm-6 col-form-label">
                <img v-if="pair.img" :src="pair.img" :alt="pair.label">
                <laya-audio-inline class="ml-2" v-if="pair.audio" :src="pair.audio">
                </laya-audio-inline>
                {{ pair.label }}
              </label>
              <div class="col-sm-6">
                <select :id="pair.label+uid"
                  v-model="solution[i]"
                  :disabled="freeze"
                  class="custom-select">
                  <option disabled>{{ defaultOption }}</option>
                  <option v-for="opt in options" :key="opt" :disabled="solution.includes(opt)">
                  {{opt}}
                  </option>
                </select>
                <div class="d-inline-block pt-3 w-100 text-center">
                  <i :class="eval[i]"></i>
                </div>
              </div>
            </div>
          </form>
          
        </div>
      </div>

      <div class="row pt-3">
        <!--
        <button type="button" class="btn btn-link" @click="reset">
          <u>Eingabe löschen</u>
        </button>
        -->
        <button type="button" class="btn btn-link" @click="check" 
          :disabled="freeze">
          {{ i18n.check }}
        </button>
          
        <button type="button" class="btn btn-primary ml-auto" @click="done">
          {{ i18n.nextContent }}<i class="fas fa-arrow-right"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import * as i18n from "@/i18n/plugins/laya-la-relate"

export default {
  name: "laya-quiz-relate",
  
  data () {
    if (Object.entries(this.$attrs).length === 4) //preview
      return {
        ...this.$attrs,
        default_option: "",
        solution: [],
        eval: [],
        freeze: false
      }
    return {
      title: "",
      task: "",
      taskAudio: "",
      pairs: [],
      default_option: "",
      solution: [],
      eval: [],
      freeze: false
    }
  },
  created () {
    this.default_option = this.i18n.defaultOption
    if (Object.entries(this.$attrs).length != 4) { // no preview 
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
    }
  },
  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters(["hasContent"]),
    i18n() {
      return i18n[this.$store.state.profile.lang]
    },
    uid() {
      return Date.now()
    },
    options() {
      return this.pairs.map(p => p.relation)
    }
  },
  methods: {
    reset() {
      this.solution = this.pairs.map(p => this.defaultOption)
    },
    done() {
      this.onFinish[0]()
    },
    check() {
      for(let i=0; i<this.pairs.length; ++i) {
        if(this.pairs[i].relation === this.solution[i]) {
          this.eval[i] = {"fa fa-check fa-2x text-success": true}
        } else {
          this.solution[i] = this.pairs[i].relation 
          this.eval[i] = {"fa fa-times fa-2x text-danger": true}
        }
      }
      this.freeze = true
      this.$forceUpdate()
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
