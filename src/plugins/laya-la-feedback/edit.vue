<template>
  <div class="laya-la-feedback-edit">

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="feedback-title" class="col-2 col-form-label">Titel</label>
        <div class="col-10">
          <input id="feedback-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="feedback-task" class="col-2 col-form-label">
          Beschreibung
        </label>
        <div class="col-10">
          <textarea id="feedback-task"
                    v-model="task"
                    class="w-100">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <!--
      <div class="form-group row">
        <label for="feedback-task-audio" class="col-2 col-form-label">
          Offstimme
        </label>
        <div class="col-10">
          <input id="feedback-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 placeholder="z.B. https://www.laya.de/offstimme.mp3">
        </div>
      </div>
      -->

      <p><b>Antwortmöglichkeiten</b></p>
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
            <i class="fas fa-plus"></i> Antwortmöglichkeit hinzufügen
          </button>
        </div>
      </div>

      <p><b>Fragen</b></p>
      <div class="form-group row" v-for="(item, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">Text</label>
        <div class="col-5">
          <input :id="item"
            class="form-control"
            type="text"
            v-model="items[i]">
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
            <i class="fas fa-plus"></i> Frage hinzufügen
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>

export default {
  name: 'laya-la-feedback-edit',
  created () {
  },
  data () {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      title: "Kurs-Rückmeldung",
      task: "Dieser Kursbaustein dient dazu, Ihre Rückmeldung einzuholen. Wir arbeiten daran, unsere Kurse \
      so verständlich und zugänglich wie möglich zu gestalten. Wir bitten Sie daher, Ihre Meinung zu unseren \
      Inhalten und der Vermittlung mitzuteilen. Das Feedback ist anonym. Wenn Sie einverstanden sind, Rückfragen\
      zu Ihrem Feedback zu erhalten, klicken Sie bitte den entsprechenden Button.",
      taskAudio: "",
      items: [
        "Der Kurs ist klar strukturiert",
        "Der Kurs ist inhaltlich interessant.",
        "Das Niveau des Kurses war angemessen.",
        "Ich fühlte mich an keiner Stelle unterfordert.",
        "Ich fühlte mich an keiner Stelle überfordert.",
        "Die Lernüberprüfungen haben zum Verständnis beigetragen.",
        "Ich würde den Kurs weiterempfehlen."
      ],
      categories: ["Stimme nicht zu", "Stimme eher nicht zu", "Neutral", "Stimme eher zu", "Stimme zu"],
      feedback: []
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
      this.items.push("")
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
