<!--
Filename: create.vue
Use: Create a Multiple Choice/Response content block
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="laya-la-scms-edit ly-bg-author p-3">

    <label>
      <h4>
        {{ i18n['layaLaScmc.name'] }}
      </h4>
    </label>
    <i 
      id ="questionmark" 
      class="fas fa-question-circle" 
      @click="toggleTip" 
      :title="i18n['showTip']" 
      v-b-tooltip.left
    ></i>
    <b-jumbotron 
      v-if="tooltipOn"
      :header="i18n['layaLaScmc.name']" 
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span v-html="i18n['layaLaScmc.tooltip']"></span>

    </b-jumbotron>
    <hr>
    <form>

      <!-- type -->
      <div class="form-group row">
        <label 
          for="smcs-type" 
          class="col-2 col-form-label"
        >
          Art
        </label>
        <div class="col-10">
          <div class="form-check form-check-inline align-text-top">
            <input 
              id="scms-sc"
              class="form-check-input"
              type="radio"
              :value="false"
              v-model="multiple"
            >
            <label 
              for="scms-sc" 
              class="form-check-label"
            >
              {{ i18n['layaLaScmc.edit.sc'] }}
            </label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input id="scms-mc"
              class="form-check-input"
              type="radio"
              name="multiple"
              :value="true"
              v-model="multiple"
            >
            <label 
              for="scms-mc" 
              class="form-check-label"
            >
              {{ i18n['layaLaScmc.edit.mc'] }}
            </label>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="form-group row">
        <label 
          for="scms-title" 
          class="col-2 col-form-label"
        >
          {{ i18n['layaLaScmc.name'] }}
        </label>
        <div class="col-10">
          <input 
            id="scms-title"
            type="text"
            v-model="title"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label 
          for="smcs-task" 
          class="col-2 col-form-label"
        >
          {{ i18n['task'] }}
        </label>
        <div class="col-10">
          <textarea 
            id="scms-task"
            v-model="task"
            class="w-100"
            :placeholder="i18n['taskPlaceholder']">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label 
          for="smcs-task-audio" 
          class="col-2 col-form-label"
        >
          {{ i18n['taskAudio'] }}
        </label>
        <div class="col-10">
          <input 
            id="scms-task-audio"
            type="text"
            v-model="taskAudio"
            class="form-control"
            :placeholder="i18n['taskAudioPlaceholder']"
          >
        </div>
      </div>

      <p><b>{{ i18n['items'] }}</b></p>
      <div 
        class="form-group row" 
        v-for="(option, i) in options" 
        :key="'item-'+i"
      >
        <!-- caption -->
        <label 
          class="col-form-label col-2" 
          :for="'option-text-'+i"
        >
          {{ i18n['text'] }}
        </label>
        <div class="col-7">
          <input :id="'option-text-'+i"
            class="form-control"
            type="text"
            v-model="options[i]">
        </div>

        <!-- correct -->
        <div class="form-check form-check-inline">
          <input :id="'option-corr-'+i"
            class="form-check-input"
            type="checkbox"
            :true-value="i"
            v-model="solutions[i]">
          <label class="form-check-label" :for="'option-corr-'+i">
            {{ i18n['layaLaScmc.edit.correct'] }}
          </label>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delItem(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <button type="button"
              class="btn btn-primary btn-sm"
              @click="_addItem">
        <i class="fas fa-plus"></i>{{ i18n['itemAdd'] }}
      </button>

    </form>

  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'

export default {
  name: 'laya-la-scmc-edit',
  
  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      title: '',
      task: '',
      taskAudio: '',
      options: [],
      solutions: [],
      maxTries: 1,
      multiple: false
    }
  },

  created () {
    this.options.push(this.i18n['layaLaScmc.edit.sampleOption'])
  },
  
  methods: {

    /**
     * Function _delItem(idx): Remove an item at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param {*} idx index at which the item is to be removed
     */
    _delItem(idx) {
      this.options.splice(idx, 1)
    },

    /**
     * Function _addItem: add a new item to options
     * 
     * Author: core
     * 
     * Last Update: unknown
     */
    _addItem() {
      this.options.push('');
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

legend {
  font-size: 1rem;
}

#questionmark {
  float: inline-end;
  cursor: pointer;
}
</style>
