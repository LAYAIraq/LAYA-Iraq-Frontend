<!--
  Filename: image-matching-edit.vue
  Use: Create or Edit an Image Matching Assessment block
  Creator: core
  Since: v1.0.0
-->

<template>
  <div
    class="image-matching-edit"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="d-flex">
      <h2
        class="d-inline-block"
        :class="langIsAr? 'ml-auto' : 'mr-auto'"
      >
        {{ y18n('imageMatching.name') }}
      </h2>
      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :title="y18n('showTip')"
        aria-labelledby="tooltipText"
        aria-live="polite"
        @click="toggleTip"
      ></i>
    </div>
    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('imageMatching.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <p
        v-for="str in y18n('imageMatching.tooltip').split(';')"
        :key="str.length"
      >
        <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
        <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
      </p>
    </b-jumbotron>
    <hr>

    <form>
      <!-- title -->
      <content-title-edit
        :title="title"
        @set-title="title = $event"
      >
      </content-title-edit>

      <!-- task -->
      <content-task-edit
        :task="task"
        @set-task="task = $event"
      >
      </content-task-edit>

      <!-- task audio
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
      -->

      <p><b>{{ y18n('imageMatching.edit.solutions') }}</b></p>

      <div
        v-for="(rel, i) in relations"
        :key="'rel-'+i"
        class="form-group row"
      >
        <!-- text regular -->
        <label
          class="col-form-label col-1"
          :for="'rel-text-' + i"
        >
          {{ y18n('text') }}
        </label>
        <div class="col-7">
          <div class="col">
            <input
              :id="'rel-text-'+i"
              v-model="rel.text"
              class="form-control"
              type="text"
              :placeholder="y18n('plugin.sampleOption')"
            >
          </div>
          <!-- text simple -->
          <div
            v-if="courseSimple"
          >
            <div class="col">
              <input
                :id="'rel-text-simple-'+i"
                v-model="rel.simple"
                class="form-control"
                type="text"
                :placeholder="y18n('simpleAlt')"
              >
              <p
                v-if="isMissing(rel)"
                id="'missing-simple-language-rel-' + i"
              >
                {{ y18n('simpleAlt.missing') }}
              </p>
            </div>
          </div>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button
            type="button"
            class="btn btn-danger btn-sm"
            :aria-label="y18n('deleteField')"
            @click="_itemDelete(relations, i)"
          >
            <i
              class="fas fa-times"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-10 ">
          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="_itemAdd(relations, { text: '', simple: '' })"
          >
            <i
              class="fas fa-plus"
              aria-hidden="true"
            ></i>
            {{ y18n('imageMatching.edit.solutionAdd') }}
          </button>
        </div>
      </div>

      <p><b>{{ y18n('items') }}</b></p>
      <div
        v-for="(pair, i) in pairs"
        :key="'pair-' + i"
        class="form-group row"
      >
        <label
          class="col-form-label col-1"
          :for="'rel-text-' + i"
        >
          {{ y18n('image') }}
        </label>
        <!-- image -->
        <div
          class="col"
          :class="langIsAr? '' : 'offset-1'"
        >
          <input
            :id="'pair-text-'+i"
            v-model="pair.img"
            class="form-control"
            type="text"
            :placeholder="y18n('imageMatching.edit.imgPlaceholder')"
          >
        </div>

        <!-- alt text -->
        <div class="col">
          <input
            :id="'pair-label-'+i"
            v-model="pair.label"
            class="form-control"
            type="text"
            :placeholder="y18n('imageMatching.edit.labelPlaceholder')"
          >

          <!-- alt text simple -->
          <div
            v-if="courseSimple"
          >
            <input
              :id="'pair-label-simple-'+i"
              v-model="pair.simple"
              class="form-control"
              type="text"
              :placeholder="y18n('simpleAlt')"
            >
            <p
              v-if="isMissing(pair)"
              id="'missing-simple-language-alt-text-' + i"
            >
              {{ y18n('simpleAlt.missing') }}
            </p>
          </div>
        </div>

        <!-- audio -->
        <div class="col">
          <input
            :id="'pair-text-'+i"
            v-model="pair.audio"
            class="form-control"
            type="text"
            :placeholder="y18n('imageMatching.edit.audioPlaceholder')"
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
              {{ y18n('imageMatching.edit.solution') }}
            </option>
            <option
              v-for="(rel,j) in relations"
              :key="rel+'-'+i+'-'+j"
              :value="j"
            >
              {{ courseSimple? rel.simple : rel.text }}
            </option>
          </select>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button
            type="button"
            :aria-label="y18n('deleteField')"
            class="btn btn-danger btn-sm"
            @click="_itemDelete(pairs, i)"
          >
            <i
              class="fas fa-times"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10">
          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="_itemAdd(pairs, newPair())"
          >
            <i
              class="fas fa-plus"
              aria-hidden="true"
            ></i>
            {{ y18n('itemAdd') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { array, locale, pluginEdit, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'
import { deepCopy } from '@/mixins/general/helpers'
import routes from '@/mixins/vue/routes'
import ContentTitleEdit from '@/components/helpers/content-title-edit'
import ContentTaskEdit from '@/components/helpers/content-task-edit'

export default {
  name: 'ImageMatchingEdit',
  components: { ContentTitleEdit, ContentTaskEdit },

  mixins: [
    array,
    locale,
    pluginEdit,
    routes,
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
      relations: []
    }
  },

  created () {
    if (this.edit) {
      this.fetchData()
    } else {
      this.fillForm()
      this.taskTitlePopulate()
    }
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
      const preData = deepCopy(this.courseContent[this.pathId])
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
      this.relations = preData.relations
      this.id = preData.id
    },
    /**
     * @function fill form with default values
     */
    fillForm () {
      for (let i = 1; i < 3; i++) {
        const tmp = {
          text: '',
          simple: ''
        }
        this.relations.push(tmp)
      }
      this._itemAdd(this.pairs, this.newPair())
    },
    /**
     * @function return pair with new id
     * @return {{labelSimple: string, img: string, flagged: boolean, audio: string, label: string, id, relation: number}}
     */
    newPair () {
      return { img: '', audio: '', relation: -1, label: '', labelSimple: '', flagged: false, id: uuidv4() }
    },
    /**
     * Function isMissing: Checks if simple language is filled in
     * Author: nv
     * Since: v1.3.0
     */
    isMissing (option) {
      return !option.simple
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

legend {
  font-size: 1rem;
}
</style>
