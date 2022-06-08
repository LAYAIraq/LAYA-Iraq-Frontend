<!--
Filename: view.vue
Use: View a Relate content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    class="laya-quiz-relate"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">
      <div
        :id="title.id"
        class="flaggable row mb-3"
      >
        <div
          id="title"
          class="col"
        >
          <h4>
            {{ courseSimple? title.simple: title.text }}
            <laya-audio-inline
              v-if="taskAudio"
              :src="taskAudio"
            >
            </laya-audio-inline>
          </h4>
        </div>
        <laya-flag-icon
          v-if="!previewData"
          :ref-data="title"
          @flagged="title.flagged = true"
        ></laya-flag-icon>
      </div>
      <div
        :id="task.id"
        class="flaggable row"
      >
        <div
          id="task"
          class="col"
        >
          <p>{{ courseSimple? task.simple: task.text }}</p>
        </div>
        <laya-flag-icon
          v-if="!previewData"
          :ref-data="task"
          @flagged="task.flagged = true"
        ></laya-flag-icon>
      </div>

      <hr>
      <div class="row">
        <div class="col">
          <form>
            <div
              v-for="(pair,i) in pairs"
              :id="pair.id"
              :key="pair.id"
              class="form-group row flaggable"
            >
              <label
                :for="pair.label+i"
                class="col-sm-6 col-form-label answer-text"
              >
                <img
                  v-if="pair.img"
                  :src="pair.img"
                  :alt="courseSimple? pair.labelSimple: pair.label"
                >
                <laya-audio-inline
                  v-if="pair.audio"
                  :class="langIsAr? 'mr-2' : 'ml-2'"
                  :src="pair.audio"
                >
                </laya-audio-inline>
                {{ courseSimple? pair.labelSimple: pair.label }}
              </label>
              <div class="col-sm-6">
                <select
                  :id="'item-' + i"
                  v-model="solution[i]"
                  :disabled="freeze"
                  class="custom-select"
                >
                  <option
                    disabled
                    value="-1"
                  >
                    {{ defaultOption }}
                  </option>
                  <option
                    v-for="(opt, j) in options"
                    :key="'option-' + j"
                    :value="j"
                  >
                    {{ opt }}
                  </option>
                </select>
                <div class="d-inline-block pt-3 w-100 text-center">
                  <i :class="eval[i]"></i>
                </div>
              </div>
              <laya-flag-icon
                v-if="!previewData"
                :ref-data="pair"
                :interactive="true"
                @flagged="pair.flagged = true"
              ></laya-flag-icon>
            </div>
          </form>
        </div>
      </div>

      <div class="row pt-3">
        <button
          type="button"
          class="btn btn-warning"
          :disabled="freeze"
          @click="reset"
        >
          {{ y18n('layaLaRelate.removeInput') }}
        </button>

        <button
          type="button"
          class="btn btn-link"
          :class="langIsAr? 'float-right': 'float-left'"
          :disabled="freeze"
          @click="check"
        >
          {{ y18n('check') }}
        </button>
      </div>

      <div>
        <div class="row">
          <div
            v-if="showSolutionsBool"
            id="solutions"
          >
            {{ i18n["layaLaScmc.showCorrect"] }}
            <div
              v-for="(pair, index) in pairs"
              :key="index"
            >
              {{ courseSimple? pair.labelSimple: pair.label }}:
              {{ courseSimple? relationsSimple[pair.relation] : relations[pair.relation] }},
            </div>
          </div>
        </div>
        <div>
          <div v-if="allAnswersChosen">
            {{ y18n('layaLaRelate.missingAnswerWarning') }}
          </div>
          <b-modal
            id="relate-missing-warning"
            :title="y18n('password.error')"
            ok-variant="warning"
            header-bg-variant="warning"
            ok-only
            centered
            static
          >
            {{ y18n('layaLaRelate.missingAnswerWarning') }}
          </b-modal>
        </div>
        <button
          type="button"
          class="btn btn-primary btn-lg mt-3 d-block"
          :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
          @click="done"
        >
          <span>
            {{ y18n('nextContent') }}
            <i
              :class="langIsAr?
                'fas fa-arrow-left' :
                'fas fa-arrow-right'"
            ></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, viewPluginProps, watchContent } from '@/mixins'
import '@/styles/flaggables.css'

export default {
  name: 'LayaQuizRelate',

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.previewData) { // preview
      return {
        ...this.previewData,
        defaultOption: '',
        solution: [],
        eval: [],
        freeze: false
      }
    }
    return {
      allAnswersChosen: false,
      defaultOption: '',
      eval: [],
      freeze: false,
      pairs: [],
      relations: [],
      relationsSimple: [],
      showSolutionsBool: false,
      solution: [],
      task: {},
      taskAudio: '',
      title: {}
    }
  },

  computed: {
    ...mapGetters(['content',
      'courseSimple']),

    /**
     * options: map pairs to their relation
     *
     * Author: pj
     *
     * Last Updated: 03.03.2022
     */
    options () {
      let shuffled = []
      if (this.courseSimple) {
        for (let i = 0; i < this.relations.length; i++) {
          if (!shuffled.includes(this.relationsSimple[i])) {
            shuffled.push(this.relationsSimple[i])
          }
        }
      } else {
        for (let i = 0; i < this.relations.length; i++) {
          if (!shuffled.includes(this.relations[i])) {
            shuffled.push(this.relations[i])
          }
        }
      }
      shuffled = shuffled.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      return shuffled
    }
  },

  watch: {
    content: {
      deep: true,
      handler () {
        this.fetchData()
      }
    }
  },

  created () {
    this.defaultOption = this.y18n('layaLaRelate.defaultOption')
    if (!this.previewData) { // no preview
      this.fetchData()
    }
    // eslint-disable-next-line no-unused-vars
    for (const i in this.pairs) {
      this.solution.push(-1)
    }
  },

  methods: {

    /**
     * Function reset: reset relations to default
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    reset () {
      this.solution = this.pairs.map(() => -1)
    },

    /**
     * Function done: execute first function from onFinish
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    done () {
      this.onFinish[0]()
    },

    /**
     * Function check: Check if User's solution is correct
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     */
    check () {
      // map shuffeled answers to their actual equivalents
      const realAnswer = this.solution.map(idx =>
        this.courseSimple
          ? this.relationsSimple.indexOf(this.options[idx])
          : this.relations.indexOf(this.options[idx])
      )
      // console.log(realAnswer)
      if (!this.solution.includes(-1)) {
        this.allAnswersChosen = false
        for (let i = 0; i < this.pairs.length; ++i) {
          if (this.pairs[i].relation === realAnswer[i]) {
            this.eval[i] = { 'fa fa-check fa-2x text-success': true }
          } else {
            // this.solution[i] = this.pairs[i].relation
            this.eval[i] = { 'fa fa-times fa-2x text-danger': true }
          }
        }
        this.freeze = true
        this.showSolutionsBool = true
        this.$forceUpdate()
      } else {
        this.allAnswersChosen = true
        this.$bvModal.show('relate-missing-warning')
      }
    },

    /**
     * Function fetchData: fetch data from vuex and create data property
     *
     * Author: cmc
     *
     * Last Updated: March 03, 2022
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.relations = preData.relations
      this.relationsSimple = preData.relationsSimple
      this.title = preData.title
      this.task = preData.task
      this.taskAudio = preData.taskAudio
      this.pairs = preData.pairs
    }
  }
}
</script>

<style scoped>
.item {
  margin-bottom: 2rem;
}
.item:last-child {
  margin-bottom: 0;
}

img {
  max-height: 20rem;
  max-width: 20rem;
}

.form-group.row {
  padding: 15px;
  margin-bottom: 0;
}
.form-group.row:nth-child(2) {
  background-color: #ebece7;
}

</style>
