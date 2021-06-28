<!--
Filename: edit.vue
Use: Edit a Relate content block
Creator: core
Date: unknown
Dependencies: 
  @/mixins/locale.vue,
  vuex
-->

<template>
  <div 
    class="laya-la-relate-edit"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <label>
      <h4>
        {{ i18n['layaLaRelate.name'] }}
      </h4>
    </label>
    <i 
      id ="questionmark" 
      class="fas fa-question-circle" 
      @click="toggleTip" 
      :title="i18n['showTip']" 
      v-b-tooltip.left
    ></i>
    <b-jumbotron 
      v-if="tooltipOn"
      :header="i18n['layaLaRelate.name']" 
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span v-html="i18n['layaLaRelate.tooltip']"></span>

    </b-jumbotron>
    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <label 
          for="relate-title" 
          class="col-2 col-form-label"
        >
          {{ i18n['title'] }}
        </label>
        <div class="col-10">
          <input id="relate-title"
            type="text"
            v-model="title.text"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="relate-task" class="col-2 col-form-label">
          {{ i18n['task'] }}
        </label>
        <div class="col-10">
          <textarea id="relate-task"
            v-model="task.text"
            class="w-100"
            :placeholder="i18n['taskPlaceholder']"
          >
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="relate-task-audio" class="col-2 col-form-label">
          {{ i18n['taskAudio'] }}
        </label>
        <div class="col-10">
          <input id="relate-task-audio"
            type="text"
            v-model="taskAudio"
            class="form-control"
            :placeholder="i18n['taskAudioPlaceholder']">
        </div>
      </div>

      <p><b>{{ i18n['layaLaRelate.edit.solutions'] }}</b></p>
      <div 
        class="form-group row" 
        v-for="(rel, i) in relations" 
        :key="'rel-'+i"
      >
        <!-- text -->
        <label 
          class="col-form-label col-2" 
          :for="'rel-text-'+i"
        >
          {{ i18n['text'] }}
        </label>
        <div class="col-7">
          <input :id="'rel-text-'+i"
            class="form-control"
            type="text"
            v-model="relations[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button 
            type="button"
            class="btn btn-danger btn-sm"
            @click="_delRelation(i)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button 
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addRelation">
            <i class="fas fa-plus"></i>
            {{ i18n['layaLaRelate.edit.solutionAdd'] }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n['items'] }}</b></p>
      <div 
        class="form-group row" 
        v-for="(pair, i) in pairs" 
        :key="'pair-'+i"
      >

        <div 
          v-if="langIsAr" 
          class="col-2"
        ></div>

        <!-- image -->
        <div 
          class="col"
          :class="langIsAr? '' : 'offset-2'"
        >
          <input 
            :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].img"
            :placeholder="i18n['layaLaRelate.edit.imgPlaceholder']">
        </div>

        <!-- alt text -->
        <div 
          class="col"
        >
          <input 
            :id="'pair-label-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].label"
            :placeholder="i18n['layaLaRelate.edit.labelPlaceholder']">
        </div>

        <!-- audio -->
        <div class="col">
          <input :id="'pair-text-'+i"
            class="form-control"
            type="text"
            v-model="pairs[i].audio"
            :placeholder="i18n['layaLaRelate.edit.audioPlaceholder']">
        </div>

        <!-- relation -->
        <div class="col-auto">
          <select 
            class="custom-select" 
            v-model="pairs[i].relation"
          >
            <option 
              disabled 
              :value="-1"
            >
              {{ i18n['layaLaRelate.edit.solution'] }}
            </option>
            <option 
              v-for="(rel,j) in relations" 
              :key="rel+'-'+i+'-'+j"
            >
              {{ rel }}
            </option>
          </select>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button 
            type="button"
            class="btn btn-danger btn-sm"
            @click="_delPair(i)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button 
            type="button"
            class="btn btn-primary btn-sm"
            @click="_addPair"
          >
            <i class="fas fa-plus"></i>
            {{ i18n['itemAdd'] }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, tooltipIcon } from '@/mixins'

export default {
  name: 'laya-la-relate-edit',

  mixins: [
    locale,
    tooltipIcon
  ],

 computed: {
    ...mapGetters(['content']),
  },

  data() {
    return {
      title: {},
      task: {},
      taskAudio: '',
      pairs: [],
      relations: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {

    /**
     * Function _delItem: remove item at position idx
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param {*} idx index at which to remove
     */
    _delPair(idx) {
      this.pairs.splice(idx, 1)
    },

    /**
     * Function _addPair: add an empty pair
     * Author: core
     * Last Updated: June 28, 2021
     * 
     * @param {*} idx index at which to remove
     */
    _addPair() {
      this.pairs.push({img: '', audio: '', relation: -1, label: '', flagged: false, id: uuidv4()})
    },

    /**
     * Function _delRelation: remove a relation 
     * 
     * Author: core
     * 
     * Last Updated: unkown
     * 
     * @param {*} idx index of relation to remove
     */
    _delRelation(idx) {
      this.relations.splice(idx, 1)
    },

    /**
     * Function _addRelation: add an empty relation
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    _addRelation() {
      this.relations.push('')
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     * 
     * Author: cmc 
     * 
     * Last Updated: March 19, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
      this.relations = preData.relations
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

#questionmark {
  float: inline-end;
  cursor: pointer;
}
</style>
