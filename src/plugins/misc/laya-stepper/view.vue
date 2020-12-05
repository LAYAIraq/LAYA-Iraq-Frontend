<template>
  <div class="ly-stepper" :id="id">

    <div class="status text-center p-1 d-none">
      {{ stepOfSteps }}
    </div>

    <div class="content">
      <div v-for="c in comps" v-bind:key="c"> <!--was "(c,i) in comps" and key="step+20"-->
        <component :is="c.name"
          :key="step"
          v-bind="c.input"
          :onFinish="nextStep(c.nextStep)">
        </component>
      </div>
    </div>
    <div v-if="!components" class="dev-error">
      <h3>{{ i18n.noComps }}</h3>
    </div>

    <div class="controls d-none">
      <button type="button" @click="back" class="btn btn-outline-primary m-1">{{ i18n.back }}</button>
      <!--
      <button type="button" @click="next" class="btn btn-outline-primary m-1">
        {{ i18n.skipChap }}
      </button>
      -->
      <button type="button" @click="next" class="btn btn-outline-primary m-1">
        {{ i18n.skipStep }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import * as messages from "../../../i18n/plugins/misc/laya-stepper"
// import VueI18n from "vue-cli-plugin-i18n"

export default Vue.extend({
  name: 'laya-stepper',
  mounted () {
  },
  data () {
    return {
      step: 1
    }
  },
  props: {
    components: Array
  },
  computed: {
    id: function() {
      return `stepper-${Date.now()}`
    },
    comps: function() {
      return [this.components[this.step-1]]
    },
    i18n() {
      return messages[this.$store.state.profile.lang]
    }
  },
  methods: {
    stepOfSteps() {
      let str = this.i18n.step
      str.replace("{step}", this.step)
      str.replace("{steps}", this.components.length)
      return str
    },
    next() {
      this.step = (this.step === this.components.length) ? this.step : this.step+1
      this.$forceUpdate()
    },
    back() {
      this.step = (this.step === 1) ? this.step : this.step-1
      this.$forceUpdate()
    },
    nextStep(steps) {
      const vue = this
      return steps.map(step => function() {
        vue.step = step
        document.getElementById(vue.id).scrollIntoView()
      })
    }
  },
})
</script>

<style scoped>
.ly-stepper {
  border: 2px solid grey;
}

.content {
  padding: 1rem;
}

.stepper {
}

.controls {
  display: flex;
}
.controls button {
  flex: 1 1;
  font-size: 120%;
  padding: 5px 10px;
}

.dev-error {
}
</style>
