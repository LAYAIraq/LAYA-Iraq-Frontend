<template>
  <div class="laya-la-relate-edit">
    <label><h4>{{ i18n.title }}</h4></label><i id ="questionmark" class="fas fa-question-circle" @click="toggleTip" 
          :title="i18n.showTip" v-b-tooltip.left></i>
    <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.title" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <span v-html="i18n.tooltip"></span>

    </b-jumbotron>
    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="relate-title" class="col-2 col-form-label">{{ i18n.edit.title }}</label>
        <div class="col-10">
          <input id="relate-title"
                 type="text"
                 v-model="title"
                 class="form-control"
                 :placeholder="i18n.edit.titlePlaceholder">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="relate-task" class="col-2 col-form-label">
          {{ i18n.edit.task }}
        </label>
        <div class="col-10">
          <textarea id="relate-task"
                    v-model="task"
                    class="w-100"
                    :placeholder="i18n.edit.taskPlaceholder">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="relate-task-audio" class="col-2 col-form-label">
          {{ i18n.edit.taskAudio }}
        </label>
        <div class="col-10">
          <input id="relate-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 :placeholder="i18n.edit.taskAudioPlaceholder">
        </div>
      </div>

      <p><b>{{ i18n.edit.solutions }}</b></p>
      <div class="form-group row" v-for="(rel, i) in relations" :key="'rel-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'rel-text-'+i">{{ i18n.edit.text }}</label>
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
            <i class="fas fa-plus"></i>{{ i18n.edit.solutionAdd }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n.edit.items }}</b></p>
      <div class="form-group row" v-for="(pair, i) in pairs" :key="'pair-'+i">

        <!-- image -->
        <div class="col-3 offset-2">
          <input :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].img"
            :placeholder="i18n.edit.imgPlaceholder">
        </div>

        <!-- audio -->
        <div class="col-3">
          <input :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].audio"
            :placeholder="i18n.edit.audioPlaceholder">
        </div>

        <!-- relation -->
        <div class="col-auto">
          <select class="custom-select" v-model="pairs[i].relation">
            <option disabled :value="-1">{{ i18n.edit.solution }}</option>
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
            <i class="fas fa-plus"></i>{{ i18n.edit.itemAdd }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import { mapGetters } from "vuex"
import * as i18n from "@/i18n/plugins/laya-la-relate";

export default {
  name: 'laya-la-drag-drop-edit',
  created() {
    let idx = this.$route.params.step - 1
    const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
    this.title = preData.title
    this.task = preData.task
    this.taskAudio = preData.taskAudio
    this.pairs = preData.pairs
    this.relations = preData.relations
  },
<<<<<<< HEAD
  data () {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs, 
        tooltipOn: false}
=======
  data() {
>>>>>>> refactor-course-edit
    return {
      title: "",
      task: "",
      taskAudio: "",
      pairs: [
        {
          img: "",
          audio: "",
          relation: -1
        }
      ],
      relations: [],
      tooltipOn: false
    }
  },
  computed: {
    ...mapGetters(["hasContent"]),
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
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
    toggleTip() {
      this.tooltipOn = !this.tooltipOn
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
<<<<<<< HEAD
  cursor: pointer;
=======
>>>>>>> refactor-course-edit
}
</style>
