<!--
Filename: edit.vue
Use: Edit Dialog content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue,
  @/mixins/tooltipIcon.vue
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="row">
      <h2 class="d-inline-block mr-auto">
        {{ i18n['layaLbDialog.name'] }}
      </h2>

      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :class="langIsAr? 'mr-auto' : 'ml-auto'"
        :title="i18n['showTip']"
        @click="toggleTip"
      ></i>
    </div>
    <hr>

    <b-jumbotron
      v-if="tooltipOn"
      :header="i18n['layaLbDialog.name']"
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span>
        {{ i18n['layaLbDialog.tooltip'] }}
      </span>
    </b-jumbotron>

    <form>
      <div class="form-group">
        <div class="row">
          <!-- title regular -->
          <label
            for="dialog-title"
            class="col-2 col-form-label"
          >
            {{ i18n['title'] }}
          </label>
          <div class="col-8">
            <input
              id="dialog-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="i18n['titlePlaceholder']"
              :aria-label="i18n['titlePlaceholder']"
            >
          </div>
          <div class="col">
            <label
              for="show-title-tick"
              class="col col-form-label"
            >
              {{ i18n['showTitle'] }}
              <input
                id="show-title-tick"
                v-model="title.show"
                type="checkbox"
              >
            </label>
          </div>
        </div>
        <!-- simple title -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="dialog-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ i18n['simpleAlt'] }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="dialog-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="i18n['simpleAlt']"
            >
          </div>
        </div>
      </div>
      <div class="form-group">
        <!-- task -->
        <div class="row">
          <label
            for="dialog-question"
            class="col-2 col-form-label"
          >
            {{ i18n['task'] }}
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question"
              v-model="question.text"
              class="w-100"
              :placeholder="i18n['layaLbDialog.optional']"
            ></textarea>
          </div>
        </div>
        <!-- task simple -->
        <div
          v-if="courseSimple"
          class="row"
        >
          <label
            for="dialog-question-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ i18n['task'] }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question-simple"
              v-model="question.simple"
              class="w-100"
              :placeholder="i18n['simpleAlt']"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label
          for="dialog-bg"
          class="col-2 col-form-label"
          style="word-wrap: anywhere"
        >
          {{ i18n['layaLbDialog.bgURL'] }}
        </label>
        <div class="col-10">
          <input
            id="dialog-bg"
            v-model="bg"
            type="text"
            class="form-control"
            :placeholder="i18n['layaLbDialog.bgPlaceholder']"
          >
        </div>
      </div>

      <p><b>{{ i18n['layaLbDialog.answers'] }}</b></p>
      <div
        v-for="(answer, i) in answers"
        :key="'answer-'+i"
        class="form-group"
      >
        <div class="row">
          <!-- text -->
          <label
            class="col-form-label col-2"
            :for="'answer-text-'+i"
          >
            {{ i18n['text'] }}
          </label>
          <div class="col-5">
            <textarea
              :id="'answer-text-'+i"
              v-model="answer.text"
              class="form-control"
              style="height: 6rem; font-size: 80%"
            ></textarea>
          </div>
          <!-- delete -->
          <div class="col-auto align-self-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :aria-label="i18n['deleteField']"
              @click="_delItem(i)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- item simple -->
          <label
            class="col-form-label col-2"
            :for="`answer-text-simple-${i}`"
          >
            <span class="sr-only">
              {{ i18n['text'] }}
            </span>
          </label>
          <div class="col-5">
            <textarea
              :id="`answer-text-simple-${i}`"
              v-model="answer.simple"
              class="form-control"
              style="height: 6rem; font-size: 80%"
              :placeholder="i18n['simpleAlt']"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="row">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="_addItem(i18n['layaLaScmc.edit.sampleOption'])"
        >
          <i class="fas fa-plus"></i>
          {{ i18n['layaLbDialog.addAnswer'] }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaLbDialogEdit',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      bg: '',
      question: {},
      answers: [],
      title: {}
    }
  },

  computed: {
    ...mapGetters(['content']),

    /**
     * step: return the step of the content block
     *
     * Author: cmc
     *
     * Last Updated: January 16, 2021
     */
    step () {
      return this.$route.params.step
    }
  },

  created () {
    this.fetchData()
  },

  methods: {
    /**
     * Function _delItem: delete item at given index
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index of item
     */
    _delItem (idx) {
      this.answers.splice(idx, 1)
    },

    /**
     * Function _addItem: add item
     * Author: core
     * Last Updated: June 6, 2021
     */
    _addItem (str) {
      const newItem = {
        text: str,
        flagged: false,
        id: uuidv4()
      }
      this.answers.push(newItem)
    },

    /**
     * Function fetchData: Fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1 // comply with array indexing in store
      // create deep copy of store object to manipulate in vue instance
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.bg = preData.bg
      this.question = preData.question
      this.answers = preData.answers
      this.title = preData.title
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
  bottom: 0;
  left: 0;

  /* height: 50%; */
  width: fit-content;

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
  float: end;
  position: relative;
  cursor: pointer;
}

.helptext {
  border: 1px green;
  padding: 5px;
}
.helptext i {
  float: start;
  margin-right: 10px;
}

</style>
