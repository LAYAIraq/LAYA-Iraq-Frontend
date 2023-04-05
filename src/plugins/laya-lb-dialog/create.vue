<!--
Filename: create.vue
Use: Create a Dialog content block
Creator: core
Date: unknown
Dependencies:
  @/mixins/locale.vue,
  @/mixins/tooltipIcon.vue
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="row">
      <h4 class="d-inline-block mr-auto">
        {{ y18n('layaLbDialog.name') }}
      </h4>

      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :class="langIsAr? 'mr-auto' : 'ml-auto'"
        :title="y18n('showTip')"
        aria-labelledby="tooltipText"
        aria-live="polite"
        @click="toggleTip"
      ></i>
    </div>
    <hr>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('layaLbDialog.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('layaLbDialog.tooltip') }}
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
            {{ y18n('title') }}
          </label>
          <div class="col-8">
            <input
              id="dialog-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
            >
          </div>
          <div class="col">
            <label
              for="show-title-tick"
              class="col col-form-label"
            >
              {{ y18n('showTitle') }}
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
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="dialog-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
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
            {{ y18n('task') }}
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question"
              v-model="question.text"
              class="w-100"
              :placeholder="y18n('layaLbDialog.optional')"
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
              {{ y18n('task') }}
            </span>
          </label>
          <div class="col-10">
            <textarea
              id="dialog-question-simple"
              v-model="question.simple"
              class="w-100"
              :placeholder="y18n('simpleAlt')"
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
          {{ y18n('layaLbDialog.bgURL') }}
        </label>
        <div class="col-10">
          <input
            id="dialog-bg"
            v-model="bg"
            type="text"
            class="form-control"
            :placeholder="y18n('layaLbDialog.bgPlaceholder')"
          >
        </div>
      </div>

      <p><b>{{ y18n('layaLbDialog.answers') }}</b></p>
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
            {{ y18n('text') }}
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
              {{ y18n('text') }}
            </span>
          </label>
          <div class="col-5">
            <textarea
              :id="`answer-text-simple-${i}`"
              v-model="answer.simple"
              class="form-control"
              style="height: 6rem; font-size: 80%"
              :placeholder="y18n('simpleAlt')"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="row">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="_addItem(y18n('plugin.sampleOption'))"
        >
          <i class="fas fa-plus"></i>
          {{ y18n('layaLbDialog.addAnswer') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaLbDialogNew',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      bg: '',
      question: {
        text: '',
        flagged: false,
        id: ''
      },
      answers: [],
      title: {
        text: '',
        flagged: false,
        show: false,
        id: ''
      }
    }
  },

  created () {
    this.title.id = uuidv4()
    this.question.id = uuidv4()
  },

  beforeMount () {
    this._addItem(this.y18n('plugin.sampleOption'))
  },

  methods: {
    /**
     * Function _delItem: remove item at given index
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
     * Function _addItem: Add item
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
