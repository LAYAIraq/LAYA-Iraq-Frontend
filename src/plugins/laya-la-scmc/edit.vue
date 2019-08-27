<template>
  <div class="laya-la-scms-edit ly-bg-author p-3">

    <h4>Single Choice / Multiple Choice</h4>
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
            <label for="scms-sc" class="form-check-label">Single Choice</label>
          </div>
          <div class="form-check form-check-inline align-text-top">
            <input id="scms-mc"
                   class="form-check-input"
                   type="radio"
                   name="multiple"
                   :value="true"
                   v-model="multiple">
            <label for="scms-mc" class="form-check-label">Multiple Choice</label>
          </div>
        </div>
      </div>

      <!-- title -->
      <div class="form-group row">
        <label for="scms-title" class="col-2 col-form-label">Titel</label>
        <div class="col-10">
          <input id="scms-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="smcs-task" class="col-2 col-form-label">
          Frage / Aufgabe
        </label>
        <div class="col-10">
          <textarea id="scms-task"
                    v-model="task"
                    class="w-100">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="smcs-task-audio" class="col-2 col-form-label">
          Offstimme
        </label>
        <div class="col-10">
          <input id="scms-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 placeholder="z.B. https://www.laya.de/offstimme.mp3">
        </div>
      </div>

      <p><b>Items</b></p>
      <div class="form-group row" v-for="(option, i) in options" :key="'item-'+i">

        <!-- caption -->
        <label class="col-form-label col-2" :for="'option-text-'+i">Text</label>
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
            richtig ?
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
        <i class="fas fa-plus"></i> Item hinzufügen
      </button>

    </form>

  </div>
</template>

<script>
export default {
  name: 'laya-la-scmc-edit',
  created () {
  },
  data () {
    return {
      title: "::Übung 1::",
      task: "::Aufgabe::",
      taskAudio: "",
      options: ["Antwort 1"],
      solutions: [],
      maxTries: 1,
      multiple: false,
      onFinish: []
    }
  },
  props: {
  },
  computed: {
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
