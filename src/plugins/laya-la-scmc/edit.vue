<template>
  <div class="laya-la-scms-edit ly-bg-author p-3">

    <label><h4>{{ i18n.edit.scmc }}</h4></label><i class="far fa-questionmark"></i>
    <b-jumbotron>

    </b-jumbotron>
    <hr>
    <form>

      <!-- type -->
      <div class="form-group row">
        <label for="smcs-type" class="col-2 col-form-label">Art</label>
        <div class="col-10">
          <div class="form-check form-check-inline align-text-top">
            <input id="scms-sc"
                   class="form-check-input"
                   type="radio"
                   :value="false"
                   v-model="multiple">
            <label for="scms-sc" class="form-check-label">{{ i18n.edit.sc }}</label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input id="scms-mc"
                   class="form-check-input"
                   type="radio"
                   name="multiple"
                   :value="true"
                   v-model="multiple">
            <label for="scms-mc" class="form-check-label">{{ i18n.edit.mc }}</label>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="form-group row">
        <label for="scms-title" class="col-2 col-form-label">{{ i18n.edit.title }}</label>
        <div class="col-10">
          <input id="scms-title"
                 type="text"
                 v-model="title"
                 class="form-control"
                 :placeholder="i18n.edit.titlePlaceholder">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="smcs-task" class="col-2 col-form-label">
          {{ i18n.edit.task }}
        </label>
        <div class="col-10">
          <textarea id="scms-task"
                    v-model="task"
                    class="w-100"
                    :placeholder="i18n.edit.taskPlaceholder">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="smcs-task-audio" class="col-2 col-form-label">
          {{ i18n.edit.taskAudio }}
        </label>
        <div class="col-10">
          <input id="scms-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 :placeholder="i18n.edit.taskAudioPlaceholder">
        </div>
      </div>

      <p><b>{{ i18n.edit.items }}</b></p>
      <div class="form-group row" v-for="(option, i) in options" :key="'item-'+i">

        <!-- caption -->
        <label class="col-form-label col-2" :for="'option-text-'+i">{{ i18n.edit.text }}</label>
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
            {{ i18n.edit.correct }}
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
        <i class="fas fa-plus"></i>{{ i18n.edit.itemAdd }}
      </button>

    </form>

  </div>
</template>

<script>
import * as i18n from "@/i18n/plugins/laya-la-scmc"

export default {
  name: 'laya-la-scmc-edit',
  created () {
    if (this.options.length == 0) this.options.push(this.i18n.edit.sampleOption)
  },
  data () {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    else return {
      title: "",
      task: "",
      taskAudio: "",
      options: [],
      solutions: [],
      maxTries: 1,
      multiple: false,
    }
  },
  props: {
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    _delItem(idx) {
      this.options.splice(idx, 1)
    },
    _addItem() {
      this.options.push("");
    },
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
</style>
