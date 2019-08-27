<template>
  <div class="laya-la-drag-drop-edit">

    <form>

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

      <p><b>Kategorien</b></p>
      <div class="form-group row" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'cat-text-'+i">Text</label>
        <div class="col-7">
          <input :id="'cat-text-'+i"
            class="form-control"
            type="text"
            v-model="categories[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delCategory(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addCategory">
            <i class="fas fa-plus"></i> Kategorie hinzufügen
          </button>
        </div>
      </div>

      <p><b>Items</b></p>
      <div class="form-group row" v-for="(it, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">Text</label>
        <div class="col-5">
          <input :id="'item-text-'+i"
            class="form-control"
            type="text"
            v-model="items[i].label">
        </div>

        <!-- category -->
        <div class="col-3">
          <select class="custom-select" v-model="items[i].category">
            <option disabled :value="-1">Kategorie</option>
            <option v-for="(cat,j) in categories" :value="j">
            {{ cat }}
            </option>
          </select>
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
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addItem">
            <i class="fas fa-plus"></i> Item hinzufügen
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
export default {
  name: 'laya-la-drag-drop-edit',
  created () {
  },
  data () {
    return {
      title: "::Übung 1::",
      task: "::Aufgabe::",
      taskAudio: "",
      items: [
        {label: "Antwort 1", category: -1}
      ],
      categories: ["Kategorie 1", "Kategorie 2"],
      onFinish: []
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    _delItem(idx) {
      this.items.splice(idx, 1)
    },
    _addItem() {
      this.items.push({label: "", category: -1})
    },
    _delCategory(idx) {
      this.categories.splice(idx, 1)
    },
    _addCategory() {
      this.categories.push("")
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
