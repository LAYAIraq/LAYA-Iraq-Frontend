<!--
  Filename: image-matching-view.vue
  Use: View a Image Matching assessment block
  Creator: core
  Since: v1.0.0
-->

<template>
  <div
    class="image-matching-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">
      <div
        :id="title.id"
        :class="courseLangIsAr? 'flaggable-ar row' : 'flaggable-en row'"
      >
        <div
          :class="courseLangIsAr? 'text-right' : 'text-left'"
        >
          <h1 class="pb-3">
            {{ courseSimple? title.simple: title.text }}
            <!--
            <audio-button
              v-if="taskAudio"
              :src="courseSimple?
                taskAudio.regular:
                taskAudio.simple"
            >
            </audio-button>
            -->
          </h1>
        </div>
        <a>
          <flag-icon
            v-if="!editPreview"
            :ref-data="title"
            @flagged="title.flagged = true"
          ></flag-icon>
        </a>
      </div>
      <div
        :id="task.id"
        class="row task-label"
      >
        <div
          id="task"
          class="col"
        >
          <p>{{ courseSimple? task.simple: task.text }}</p>
        </div>
      </div>

      <hr>
      <div class="row">
        <div class="col">
          <form>
            <div
              v-for="(pair,i) in pairs"
              :id="pair.id"
              :key="pair.id"
              class="form-group row"
            >
              <label
                :for="'item-'+i"
                class="col-sm-6 col-form-label answer-text"
              >
                <img
                  v-if="pair.img"
                  v-auth-image="pair.img"
                  :alt="courseSimple? pair.labelSimple: pair.label"
                >
                <!--
                <audio-button
                  v-if="pair.audio"
                  :class="courseLangIsAr? 'mr-2' : 'ml-2'"
                  :src="pair.audio"
                >
                </audio-button>
                -->
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
                    {{ courseSimple? opt.simple: opt.text }}
                  </option>
                </select>
                <div class="d-inline-block pt-3 w-100 text-center">
                  <i :class="eval[i]"></i>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="langIsAr ? mr-3 : ml-3">
        <div class="row mb-3">
          <button
            type="button"
            class="btn btn-primary"
            :class="langIsAr? 'float-right': 'float-left'"
            :disabled="freeze"
            @click="check"
          >
            {{ y18n('check') }}
          </button>
        </div>
        <div class="mt-3">
          <div class="row">
            <div
              v-if="showSolutionsBool"
              id="solutions"
            >
              {{ i18n["choiceQuestion.showCorrect"] }}
              <div
                v-for="(pair, index) in pairs"
                :key="index"
              >
                {{ courseSimple? pair.labelSimple: pair.label }}:
                {{ courseSimple? relations[pair.relation].simple : relations[pair.relation].text }},
              </div>
            </div>
          </div>
          <div>
            <div v-if="allAnswersChosen">
              {{ y18n('imageMatching.missingAnswerWarning') }}
            </div>
            <b-modal
              id="missing-answer-warning"
              :title="y18n('password.error')"
              ok-variant="warning"
              header-bg-variant="warning"
              ok-only
              centered
              static
            >
              {{ y18n('imageMatching.missingAnswerWarning') }}
            </b-modal>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <navigation-buttons
          :cid="id"
        ></navigation-buttons>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
// import AudioButton from '@/components/helpers/audio-button.vue'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import { stripKey } from '@/mixins/general/helpers'
import NavigationButtons from '@/components/helpers/navigation-buttons.vue'

export default {
  name: 'ImageMatchingView',
  components: { NavigationButtons, FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData,
      allAnswersChosen: false,
      defaultOption: '',
      solution: [],
      eval: [],
      freeze: false,
      showSolutionsBool: false
    }
  },

  computed: {
    ...mapGetters(['courseSimple']),

    /**
     * options: map pairs to their relation
     *
     * Author: pj
     *
     * Last Updated: 03.03.2022
     */
    options () {
      return this.relations.map(value => ({ ...value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(val => stripKey('sort', val))
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
    this.defaultOption = this.y18n('imageMatching.defaultOption')
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
     * Function check: Check if User's solution is correct
     *
     * Author: core
     *
     * Last Updated: March 19, 2021
     */
    check () {
      // map shuffled answers to their actual equivalents by comparing the text of the options
      const realAnswer = this.solution.map(idx => this.relations.findIndex(val => val.text === this.options[idx]?.text))

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
        for (let i = 0; i < this.pairs.length; ++i) {
          this.eval[i] = { 'fa fa-times fa-2x text-danger': true }
        }
        this.showSolutionsBool = true
      }
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

.task-label {
  font-size: 18pt;
}

</style>
