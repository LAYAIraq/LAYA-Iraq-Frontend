<template>
  <div class="laya-la-relate-edit">

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="relate-title" class="col-2 col-form-label">Titel</label>
        <div class="col-10">
          <input id="relate-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="relate-task" class="col-2 col-form-label">
          Frage / Aufgabe
        </label>
        <div class="col-10">
          <textarea id="relate-task"
                    v-model="task"
                    class="w-100">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="relate-task-audio" class="col-2 col-form-label">
          Offstimme
        </label>
        <div class="col-10">
          <input id="relate-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 placeholder="z.B. https://www.laya.de/offstimme.mp3">
        </div>
      </div>

      <p><b>Lösungen / Relationen</b></p>
      <div class="form-group row" v-for="(rel, i) in relations" :key="'rel-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'rel-text-'+i">Text</label>
        <div class="col-7">
          <input :id="'rel-text-'+i"
            class="form-control"
            type="text"
            v-model="relations[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delRelation(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addRelation">
            <i class="fas fa-plus"></i> Lösung hinzufügen
          </button>
        </div>
      </div>

      <p><b>Items</b></p>
      <div class="form-group row" v-for="(pair, i) in pairs" :key="'pair-'+i">

        <!-- image -->
        <div class="col-3 offset-2">
          <input :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].img"
            placeholder="Bild URL">
        </div>

        <!-- audio -->
        <div class="col-3">
          <input :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].audio"
            placeholder="Audio URL">
        </div>

        <!-- relation -->
        <div class="col-auto">
          <select class="custom-select" v-model="pairs[i].relation">
            <option disabled :value="-1">Lösung</option>
            <option v-for="(rel,j) in relations" :key="rel+'-'+i+'-'+j">
            {{ rel }}
            </option>
          </select>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delPair(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addPair">
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
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      title: "::Übung 1::",
      task: "::Aufgabe::",
      taskAudio: "",
      pairs: [
        {
          img: "",
          audio: "",
          relation: -1
        }
      ],
      relations: ["Relation 1", "Relation 2"],
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    _delPair(idx) {
      this.pairs.splice(idx, 1)
    },
    _addPair() {
      this.pairs.push({img: "", audio: "", relation: -1})
    },
    _delRelation(idx) {
      this.relations.splice(idx, 1)
    },
    _addRelation() {
      this.relations.push("")
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
