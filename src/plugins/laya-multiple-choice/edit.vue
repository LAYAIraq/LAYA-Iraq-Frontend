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
      <p><b>Items</b></p>
      <div class="form-group row" v-for="(it, i) in items" :key="'item-'+i">

        <!-- caption -->
        <label class="col-form-label col-2" :for="'item-text-'+i">Text</label>
        <div class="col-7">
          <input :id="'item-text-'+i"
                 class="form-control"
                 type="text"
                 v-model="items[i].caption">
        </div>

        <!-- correct -->
        <div class="form-check form-check-inline">
          <input :id="'item-corr-'+i"
                 class="form-check-input"
                 type="checkbox"
                 v-model="items[i].correct">
          <label class="form-check-label" :for="'item-corr-'+i">
            richtig ?
          </label>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="delItem(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <button type="button"
              class="btn btn-primary btn-sm"
              @click="addItem">
        <i class="fas fa-plus"></i> Item hinzufügen
      </button>

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
    onedit: Function
  },
  computed: {
  },
  methods: {
    delItem(idx) {
      this.items.splice(idx, 1)
    },
    addItem() {
      this.items.push({ caption: "", correct: false });
    },
    save() {
      this.onedit({
        title: this.title, 
        task: this.task,
        items: [...this.items],
        isMultiple: this.isMultiple,
      })
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
</style>
