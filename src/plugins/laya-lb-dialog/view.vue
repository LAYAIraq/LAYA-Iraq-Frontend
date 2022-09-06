<!--
Filename: view.vue
Use: View Dialog content block
Author: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div class="laya-dialog">
    <!--    <div-->
    <!--      class="row"-->
    <!--      :id="title.id"-->
    <!--      v-if="title.show"-->
    <!--    >-->
    <!--      {{ title.text }}-->
    <!--    </div>-->
    <img
      v-if="bg"
      class="bg"
      v-auth-image="bg"
      alt=""
    >
    <div
      v-else
      class="bg-fallback"
    ></div>
    <div class="dialog-text">
      <div
        v-if="question"
        :id="question.id"
        class="flaggable question"
      >
        {{ courseSimple? question.simple: question.text }}
        <laya-flag-icon
          v-if="!previewData"
          :ref-data="question"
          @flagged="question.flagged = true"
        ></laya-flag-icon>
      </div>
      <div class="answers d-flex flex-wrap justify-content-around">
        <div
          v-for="(answer,i) in answers"
          :key="answer.id"
          class="flaggable answer-item"
        >
          <button
            type="button"
            class="btn btn-info btn-lg"
            @click="onFinish[i]()"
          >
            {{ courseSimple? answer.simple : answer.text }}
          </button>
          <laya-flag-icon
            v-if="!previewData"
            :ref-data="answer"
            :interactive="true"
            @flagged="answer.flagged = true"
          ></laya-flag-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { locale, viewPluginProps, watchContent } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/styles/flaggables.css'

export default {
  name: 'LayaDialog',

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.previewData) { // for 'preview' feature
      return { ...this.previewData }
    }
    return {
      question: '',
      answers: [],
      bg: '',
      title: '',
      unwatch: null
    }
  },

  computed: {
    ...mapGetters([
      'content',
      'courseFlags',
      'courseSimple'
    ]),

    /**
     * idx: Return index of content block in course array
     * Author: cmc
     * Last Updated: January 16, 2021
     */
    idx () {
      // comply with array indexing in store
      return this.$route.params.step - 1
    }
  },

  created () {
    if (!this.previewData) this.fetchData()
  },

  methods: {
    /**
     * function checkFlags: check if flaggable props have a flag, set
     *  flagged to true if yes, not used
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    checkFlags () {
      const flaggables = [this.title, this.question]
      // console.log(flaggables)
      for (const elem of flaggables) {
        for (const flag of this.courseFlags) {
          // console.log('checking ' + elem.id)
          if (flag.referenceId === elem.id) {
            // console.log('match!')
            elem.flagged = true
            break
          }
        }
      }
    },

    /**
     * Function fetchData: make vuex store data mutable
     *
     * Author: cmc
     *
     * Last Updated: January 16, 2021
     */
    fetchData () {
      // dereference store data
      const preData = JSON.parse(JSON.stringify(this.content[this.idx].input))
      // replace data stubs with stored data
      this.question = preData.question
      this.answers = preData.answers
      this.bg = preData.bg
      this.title = preData.title
    }

  }
}
</script>

<style scoped>
.laya-dialog {
  /*position: relative;*/
  /* min-height: 20rem; */
  border: 1px solid grey;
}

.bg {
  width: 100%;
}
.bg-fallback {
  /* min-height: 10em; */
  text-align: center;
  padding-top: 1rem;
  /* background: linear-gradient(#e66465, #9198e5); */
}

.dialog-text {
  width: auto;
/*   height: max-content; */
  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.dialog-text.absolute {
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
}

.question {
  position: relative;
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 3px;
  line-height: 1.5;
}

.answer-item {
  display: block;
  position: relative;
}

.answers > button {
  border: 1px solid #222;
  margin-right: 1rem;
  font-size: 90%;
  line-height: 1.5;
  /* background-color: white; */
}
.answers > button:last-child {
  margin-right: 0;
}
</style>
