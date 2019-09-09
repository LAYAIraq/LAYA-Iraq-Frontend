<template>
  <div class="laya-lb-dialog-edit">

    <h4>Dialog mit Sprungmarken</h4>
    <hr>
    <form>

      <div class="form-group row">
        <label for="smcs-question" class="col-2 col-form-label">
          Frage / Aufgabe
        </label>
        <div class="col-10">
          <textarea id="scms-question"
                    v-model="question"
                    class="w-100"
                    placeholder="Optional">
          </textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for="dialog-bg" class="col-2 col-form-label"
          style="word-wrap: anywhere">
          Hintergrundbild URL
        </label>
        <div class="col-10">
          <input id="dialog-bg"
                 type="text"
                 class="form-control"
                 v-model="bg"
                 placeholder="z.B. https://www.laya.de/bild.jpg">
        </div>
      </div>

      <p><b>Antworten</b></p>
      <div class="form-group row" v-for="(it, i) in answers" :key="'answer-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'answer-text-'+i">Text</label>
        <div class="col-5">
          <textarea :id="'answer-text-'+i"
            class="form-control"
            style="height: 6rem; font-size: 80%"
            v-model="answers[i]">
          </textarea>
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
        <i class="fas fa-plus"></i> Antwort hinzufügen
      </button>

    </form>

  </div>
</template>

<script>
export default {
  name: "laya-lb-dialog-edit",
  data() {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      bg: "",
      question: "",
      answers: [],
    }
  },
  methods: {
    _delItem(idx) {
      this.answers.splice(idx, 1)
    },
    _addItem() {
      this.answers.push("")
    },
  },
}
</script>

<style scoped>
.laya-dialog {
  position: relative;
}

.bg {
  width: 100%;
}

.dialog-text {
  position: absolute;
  bottom: 0px;
  left: 0px;
  
  /* height: 50%; */
  width: stretch;

  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.question {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
}

.answers > button {
  border: 1px solid #222;
  margin-right: 1rem;
  font-size: 90%;
  /* background-color: white; */
}
.answers > button:last-child {
  margin-right: 0;
}

</style>
