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
    <div class="d-flex">
      <h4 class="mr-auto">
        {{ y18n('layaLaRelate.name') }}
      </h4>
      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :title="y18n('showTip')"
        @click="toggleTip"
      ></i>
    </div>
    <b-jumbotron
      v-if="tooltipOn"
      :header="y18n('layaLaRelate.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('layaLaRelate.tooltip') }}
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
            {{ y18n('title') }}
          </label>
          <div class="col-10">
            <input
              id="relate-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
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
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="relate-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
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
            {{ y18n('task') }}
          </label>
          <div class="col-10">
            <textarea
              id="relate-task"
              v-model="task.text"
              class="w-100"
              :placeholder="y18n('taskPlaceholder')"
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
              {{ y18n('task') }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="relate-task-simple"
              v-model="task.simple"
              class="w-100"
              :placeholder="y18n('simpleAlt')"
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
          {{ y18n('taskAudio') }}
        </label>
        <div class="col-10">
          <input
            id="relate-task-audio"
            v-model="taskAudio"
            type="text"
            class="form-control"
            :placeholder="y18n('taskAudioPlaceholder')"
          >
        </div>
      </div>

      <p><b>{{ y18n('layaLaRelate.edit.solutions') }}</b></p>

      <div
        v-for="(rel, i) in relations"
        :key="'rel-'+i"
        class="form-group row"
      >
        <!-- text regular -->
        <label
          class="col-form-label col-2"
          :for="'rel-text-' + i"
        >
          {{ y18n('text') }}
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
                :placeholder="y18n('simpleAlt')"
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
            {{ y18n('layaLaRelate.edit.solutionAdd') }}
          </button>
        </div>
      </div>

      <p><b>{{ y18n('items') }}</b></p>
      <div
        v-for="(pair, i) in pairs"
        :key="'pair-' + i"
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
            v-model="pair.img"
            class="form-control"
            type="text"
            :placeholder="y18n('layaLaRelate.edit.imgPlaceholder')"
          >
        </div>

        <!-- alt text -->
        <div class="col">
          <input
            :id="'pair-label-'+i"
            v-model="pair.label"
            class="form-control"
            type="text"
            :placeholder="y18n('layaLaRelate.edit.labelPlaceholder')"
          >

          <!-- alt text simple -->
          <div
            v-if="courseSimple"
          >
            <input
              :id="'pair-label-simple-'+i"
              v-model="pair.labelSimple"
              class="form-control"
              type="text"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>

        <!-- audio -->
        <div class="col">
          <input
            :id="'pair-text-'+i"
            v-model="pair.audio"
            class="form-control"
            type="text"
            :placeholder="y18n('layaLaRelate.edit.audioPlaceholder')"
          >
        </div>

        <!-- relation -->
        <div class="col-auto">
          <select
            id="rel-solution-dropdown"
            v-model="pair.relation"
            class="custom-select"
          >
            <option
              disabled
              :value="-1"
            >
              {{ y18n('layaLaRelate.edit.solution') }}
            </option>
            <option
              v-for="(rel,j) in courseSimple? relationsSimple: relations"
              :key="rel+'-'+i+'-'+j"
              :value="j"
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
            {{ y18n('itemAdd') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, tooltipIcon } from '@/mixins'
import commonMethods from '@/plugins/laya-la-relate/common-methods'

export default {
  name: 'LayaLaRelateEdit',

  mixins: [
    commonMethods,
    locale,
    tooltipIcon
  ],

  data () {
    return {
      title: {},
      task: {},
      taskAudio: '',
      pairs: [],
      relations: [],
      relationsSimple: []
    }
  },

  computed: {
    ...mapGetters(['content'])
  },

  created () {
    this.fetchData()
  },

  methods: {
    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
      this.relations = preData.relations
      this.relationsSimple = preData.relationsSimple
    }
  }
}
</script>

<style scoped>
#rel-solution-dropdown {
  max-width: 200px;
}

*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

#questionmark {
  float: end;
  cursor: pointer;
}
</style>
