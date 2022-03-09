<!--
Filename: create.vue
Use: Create a Relate content block
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    class="laya-la-relate-create"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <label>
      <h4>
        {{ i18n['layaLaRelate.name'] }}
      </h4>
    </label>
    <i
      id="questionmark"
      v-b-tooltip.left
      class="fas fa-question-circle"
      :title="i18n['showTip']"
      @click="toggleTip"
    ></i>
    <b-jumbotron
      v-if="tooltipOn"
      :header="i18n['layaLaRelate.name']"
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span>
        {{ i18n['layaLaRelate.tooltip'] }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <div class="form-group">
      <!-- title regular -->
      <div class="form-group row">
        <label
          for="relate-title"
          class="col-2 col-form-label"
        >
          {{ i18n['title'] }}
        </label>
        <div class="col-10">
          <input
            id="relate-title"
            v-model="title.text"
            type="text"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
      </div>
      <!-- title simple -->
      <div
        v-if="courseSimple"
        class="row"
      >
        <label
          for="relate-title-simple"
          class="col-2 col-form-label"
        >
            <span class="sr-only">
              {{ i18n['simpleAlt'] }}
            </span>
        </label>
        <div class="col-8">
          <input
            id="relate-title-simple"
            v-model="title.simple"
            type="text"
            class="form-control"
            :placeholder="i18n['simpleAlt']"
          >
        </div>
      </div>
      </div>

      <div class="form-group">
      <!-- task regular -->
      <div class="form-group row">
        <label
          for="relate-task"
          class="col-2 col-form-label"
        >
          {{ i18n['task'] }}
        </label>
        <div class="col-10">
          <textarea
            id="relate-task"
            v-model="task.text"
            class="w-100"
            :placeholder="i18n['taskPlaceholder']"
          >
          </textarea>
        </div>
      </div>
      <!-- task simple -->
      <div
        v-if="courseSimple"
        class="row"
      >
        <label
          for="relate-task-simple"
          class="col-2 col-form-label"
        >
            <span class="sr-only">
              {{ i18n['task'] }}
            </span>
        </label>
        <div class="col-10">
          <textarea
            id="relate-task-simple"
            v-model="task.simple"
            class="w-100"
            :placeholder="i18n['simpleAlt']"
          ></textarea>
          </div>
      </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label
          for="relate-task-audio"
          class="col-2 col-form-label"
        >
          {{ i18n['taskAudio'] }}
        </label>
        <div class="col-10">
          <input
            id="relate-task-audio"
            v-model="taskAudio"
            type="text"
            class="form-control"
            :placeholder="i18n['taskAudioPlaceholder']"
          >
        </div>
      </div>

      <p><b>{{ i18n['layaLaRelate.edit.solutions'] }}</b></p>

      <div
        v-for="(rel, i) in relations"
        :key="'rel-'+i"
        class="form-group row"
      >

        <!-- text regular -->
        <label
          class="col-form-label col-2"
          :for="'rel-text-'+i"
        >
          {{ i18n['text'] }}
        </label>
        <div class="col-7">
          <div class="col">
          <input
            :id="'rel-text-'+i"
            v-model="relations[i]"
            class="form-control"
            type="text"
          >
        </div>
        <!-- text simple -->
        <div
          v-if="courseSimple"
        >
          <div class="col">
            <input
              :id="'rel-text-simple-'+i"
              v-model="relationsSimple[i]"
              class="form-control"
              type="text"
              :placeholder="i18n['simpleAlt']"
            >
          </div>
        </div>
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
            @click="_addRelation"
          >
            <i class="fas fa-plus"></i>
            {{ i18n['layaLaRelate.edit.solutionAdd'] }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n['items'] }}</b></p>
      <div
        v-for="(pair, i) in pairs"
        :key="'pair-'+i"
        class="form-group row"
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
            v-model="pairs[i].img"
            class="form-control"
            type="text"
            :placeholder="i18n['layaLaRelate.edit.imgPlaceholder']"
          >
        </div>

        <!-- alt text -->
        <div class="col">
          <input
            :id="'pair-label-'+i"
            v-model="pairs[i].label"
            class="form-control"
            type="text"
            :placeholder="i18n['layaLaRelate.edit.labelPlaceholder']"
          >

          <!-- alt text simple -->
          <div
            v-if="courseSimple"
          >
            <input
              :id="'pair-labelSimple-'+i"
              v-model="pairs[i].labelSimple"
              class="form-control"
              type="text"
              :placeholder="i18n['simpleAlt']"
            >
            </div>
        </div>

        <!-- audio -->
        <div class="col">
          <input
            :id="'pair-text-'+i"
            v-model="pairs[i].audio"
            class="form-control"
            type="text"
            :placeholder="i18n['layaLaRelate.edit.audioPlaceholder']"
          >
        </div>

        <!-- relation -->
        <div class="col-auto">
          <select
            v-model="pairs[i].relation"
            class="custom-select"
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
            @click="_delItem(i)"
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
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaLaRelateCreate',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      title: {
        text: '',
        flagged: false,
        show: false,
        id: ''
      },
      task: {},
      taskAudio: '',
      pairs: [],
      relations: [],
      relationsSimple: []
    }
  },

  created () {
    this.populateData()
  },

  methods: {
    populateData () {
      for (let i = 1; i < 3; i++) {
        const tmp = this.i18n['layaLaRelate.edit.solution'] + ' ' + i
        this.relations.push(tmp)
        this.relationsSimple.push(tmp)
      }
      this.pairs.push({
        img: '',
        audio: '',
        label: '',
        labelSimple: '',
        relation: -1,
        id: uuidv4(),
        flagged: false
      })
      this.title = {
        text: '',
        id: uuidv4(),
        flagged: false
      }
      this.task = {
        text: '',
        id: uuidv4(),
        flagged: false
      }
    },
    /**
     * Function _delItem: remove item at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove
     */
    _delItem (idx) {
      this.items.splice(idx, 1)
    },

    /**
     * Function _addPair: add an empty pair
     *
     * Author: core
     *
     * Last Updated: June 28, 2021
     */
    _addPair () {
      this.pairs.push({ img: '', audio: '', relation: -1, label: '', labelSimple: '', flagged: false, id: uuidv4() })
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
    _delRelation (idx) {
      this.relations.splice(idx, 1)
      this.relationsSimple.splice(idx, 1)
    },

    /**
     * Function _addRelation: add an empty relation
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    _addRelation () {
      this.relations.push('')
      this.relationsSimple.push('')
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
  float: end;
}
</style>
