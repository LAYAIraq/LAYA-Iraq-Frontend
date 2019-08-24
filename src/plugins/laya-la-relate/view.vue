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
                  class="custom-select">
                  <option disabled>{{default_option}}</option>
                  <option v-for="opt in options"
                          :disabled="solution.includes(opt)">
                  {{opt}}
                  </option>
                </select>
              </div>
            </div>
          </form>

        </div>
      </div>

      <div class="row pt-3">
        <button type="button" class="btn btn-link" @click="reset">
          <u>Eingabe löschen</u>
        </button>
          
        <button type="button"
                class="btn btn-primary btn-lg ml-auto"
                @click="check">
          Fertig!
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

const default_option = "Wähle aus"
export default Vue.extend({
  name: "laya-quiz-relate",
  created () {
    this.reset()
  },
  data () {
    return {
      default_option,
      solution: []
    }
  },
  props: {
    title: String,
    task: String,
    taskAudio: String,
    pairs: Array,
    onFinish: Array
  },
  computed: {
    uid: function() {
      return Date.now()
    },
    options: function() {
      return this.pairs.map(p => p.relation)
    }
  },
  methods: {
    reset: function() {
      this.solution = this.pairs.map(p => default_option)
    },
    check: function () {
      this.onFinish[0]()
    }
  }
})
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
