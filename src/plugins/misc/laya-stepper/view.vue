<!--
Filename: view.vue 
Use: Show stepper component
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="ly-stepper" :id="id">

    <div class="status text-center p-1 d-none">
      {{ stepOfSteps }}
    </div>

    <div class="content">
      <div v-for="c in comps" v-bind:key="c"> <!--was "(c,i) in comps" and key="step+20"-->
        <component 
          :is="c.name"
          :key="step"
          v-bind="c.input"
          :onFinish="nextStep(c.nextStep)">
        </component>
      </div>
    </div>
    <div v-if="!components" class="dev-error">
      <h3>{{ i18n['layaStepper.noComps'] }}</h3>
    </div>

    <div class="controls d-none">
      <button 
        type="button" 
        @click="back" 
        class="btn btn-outline-primary m-1"
      >
        {{ i18n['layaStepper.back'] }}
      </button>
      <!--
      <button type="button" @click="next" class="btn btn-outline-primary m-1">
        {{ i18n['layaStepper.skipChap'] }}
      </button>
      -->
      <button type="button" @click="next" class="btn btn-outline-primary m-1">
        {{ i18n['layaStepper.skipStep'] }}
      </button>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'laya-stepper',

  mixins: [
    locale
  ],

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

    /**
     * id: return id for html element
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    id() {
      return `stepper-${Date.now()}`
    },

    /**
     * comps: return components of the course
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    comps() {
      return [this.components[this.step-1]]
    }
  },
  methods: {

    /**
     * Function stepOfSteps: replace variables in str with data
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     */
    stepOfSteps() {
      let str = this.i18n['layaStepper.step']
      str.replace('{step}', this.step)
      str.replace('{steps}', this.components.length)
      return str
    },

    /**
     * Function next: return next step 
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    next() {
      this.step = (this.step === this.components.length) ? this.step : this.step+1
      this.$forceUpdate()
    },

    /**
     * Function back: return last step
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    back() {
      this.step = (this.step === 1) ? this.step : this.step-1
      this.$forceUpdate()
    },

    /**
     * Function nextStep: map all steps to their content and scroll into view
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    nextStep(steps) {
      const vue = this
      return steps.map(step => function() {
        vue.step = step
        document.getElementById(vue.id).scrollIntoView()
      })
    }
  },
}
</script>

<style scoped>
.ly-stepper {
  border: 2px solid grey;
}

.content {
  padding: 1rem;
}

.controls {
  display: flex;
}
.controls button {
  flex: 1 1;
  font-size: 120%;
  padding: 5px 10px;
}

</style>
