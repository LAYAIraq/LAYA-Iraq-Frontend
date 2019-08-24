<template>
  <div class="laya-la-scms-edit ly-bg-author p-3">

    <h4>Single Choice / Multiple Choice</h4>
    <hr>
    <form>

      <div class="form-group row">
        <label for="scms-title" class="col-2 col-form-label">Titel</label>
        <div class="col-10">
          <input id="scms-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>

      <div class="form-group row">
        <label for="smcs-type" class="col-2 col-form-label">Art</label>
        <div class="col-10">
          <div class="form-check form-check-inline">
            <input id="scms-sc"
                   class="form-check-input"
                   type="radio"
                   name="isMultiple"
                   :value="false"
                   v-model="isMultiple">
            <label for="scms-sc" class="form-check-label">Single Choice</label>
          </div>
          <div class="form-check form-check-inline">
            <input id="scms-mc"
                   class="form-check-input"
                   type="radio"
                   name="isMultiple"
                   :value="true"
                   v-model="isMultiple">
            <label for="scms-mc" class="form-check-label">Multiple Choice</label>
          </div>
        </div>
      </div>

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

      <hr>
      <div class="form-group">
        <p><b>Items</b></p>
        <div class="form-check" v-for="(it, i) in items" :key="'item-'+i">
            <input id="'item-text-'+i"
                   class="form-check-input"
                   type="text"
                   v-model="items[i].caption">
            <input id="'item-corr-'+i"
                   class="form-check-input"
                   type="checkbox"
                   v-model="items[i].correct">
            <span>richtig ?</span>
            <button type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeItem(i)">
              <i class="fas fa-times"></i>
            </button>
        </div>
        <button type="button"
                class="btn btn-primary btn-sm"
                @click="addItem">
          <i class="fas fa-plus"></i> Item hinzufügen
        </button>
      </div>

      <hr>
      <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-secondary">
          Vorschau
        </button>
        <button type="button" class="btn btn-primary" @click="save">
          <i class="fas fa-check"></i> Speichern
        </button>
      </div>

    </form>

  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'laya-la-scmc-edit',
  created () {
  },
  data () {
    return {
      title: "",
      task: "",
      items: [],
      isMultiple: false
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    addItem() {},
    save() {}
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
