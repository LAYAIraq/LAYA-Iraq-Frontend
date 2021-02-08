<template>
  <div class="laya-lb-dialog-edit">
     
    <label><h4>{{ i18n.title }}</h4></label> <i id="questionmark" class="fas fa-question-circle" @click="toggleTip" 
          :title="i18n.showTip" v-b-tooltip.left></i>
    <hr>
    
    <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.title" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <span v-html="i18n.tooltip"></span>

    </b-jumbotron>

    <form>

      <div class="form-group row">
        <label for="smcs-question" class="col-2 col-form-label">
          {{ i18n.task }}
        </label>
        <div class="col-10">
          <textarea id="scms-question"
                    v-model="question"
                    class="w-100"
                    :placeholder="i18n.optional">
          </textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for="dialog-bg" class="col-2 col-form-label"
          style="word-wrap: anywhere">
          {{ i18n.bgURL }}
        </label>
        <div class="col-10">
          <input id="dialog-bg"
                 type="text"
                 class="form-control"
                 v-model="bg"
                 :placeholder="i18n.bgPlaceholder">
        </div>
      </div>

      <p><b>{{ i18n.answers }}</b></p>
      <div class="form-group row" v-for="(it, i) in answers" :key="'answer-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'answer-text-'+i">{{ i18n.text }}</label>
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
        <i class="fas fa-plus"></i>{{ i18n.addAnswer }}
      </button>

    </form>

  </div>
</template>

<script>
import * as i18n from "@/i18n/plugins/laya-lb-dialog"
import { mapGetters } from "vuex"

export default {
  name: "laya-lb-dialog-edit",
  created() {
    let idx = this.$route.params.step -1 //comply with array indexing in store
    //create deep copy of store object to manipulate in vue instance
    let preData = JSON.parse(JSON.stringify(this.content[idx].input))
    this.bg = preData.bg
    this.question = preData.question
    this.answers = preData.answers
  },
  data() {
    return {
      bg: "",
      question: "",
      answers: [],
      tooltipOn: false
    }
  },
  methods: {
    _delItem(idx) {
      this.answers.splice(idx, 1)
    },
    _addItem() {
      this.answers.push("")
    },
    toggleTip() {
      this.tooltipOn = !this.tooltipOn
    }
  },
  computed: {
    ...mapGetters(["content"]),
    i18n() {
      return i18n[this.$store.state.profile.lang]
    },
    step() {
      return this.$route.params.step
    }
  }
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

#questionmark {
  float: inline-end;
  cursor: pointer;
}

.helptext {
    border: 1px;
    border-color: green;
    padding: 5px;
  }
.helptext i {
    float: inline-start;
    margin-right: 10px;
  }

</style>
