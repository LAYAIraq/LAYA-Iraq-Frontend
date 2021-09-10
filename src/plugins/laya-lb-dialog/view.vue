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
    <img v-if="bg" class="bg" :src="bg" alt="">
    <div v-else class="bg-fallback"></div>
    <div class="dialog-text">
      <div
        v-if="question"
        class="question"
        :id="question.id"
      >
        {{ question.text }}
        <laya-flag :refData="question"></laya-flag>
      </div>
      <div class="answers-d-flex-justify-content-around"
           v-for="(answer,i) in answers"
           :key="i">
        <button
          type="button"
          class="btn btn-info btn-lg"
          @click="onFinish[i]()">
          {{ answers[i] }}
        </button>
      </div>

    </div>
  </div>

</template>

<script>

// import { checkFlags } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'laya-dialog',

  // mixins: [
  //     checkFlags
  // ],

  computed: {
    ...mapGetters(['content', 'courseFlags']),

    /**
     * idx: Return index of content block in course array
     *
     * Author: cmc
     *
     * Last Updated: January 16, 2021
     */
    idx() {
      //comply with array indexing in store
      return this.$route.params.step -1
    }
  },

  props: {
    onFinish: Array,
    previewData: Object
  },

  data() {
    if (this.previewData) { // for 'preview' feature
      return {...this.previewData}
    }
    return {
      question: '',
      answers: [],
      bg: '',
      title: '',
      numAnswersPerRow: 4
    }
  },

  created() {
    // fetch data from vuex if not preview
    if (!this.previewData) {
      // No attributed Data --> actual view
      this.refreshData()
    }
    this.checkFlags()
  },

  mounted() {
    this.checkFlags()
  },

  methods: {
    /**
     * function checkFlags: check if flaggable props have a flag, set
     *  flagged to true if yes
     * Author: cmc
     * Last Updated: July 7, 2021
     */
    checkFlags() {
      const flaggables = [ this.title, this.question ]
      console.log(flaggables)
      for (let elem of flaggables) {
        for (const flag of this.courseFlags) {
          console.log('checking ' + elem.id)
          if (flag.referenceId === elem.id) {
            console.log('match!')
            elem.flagged = true
            break
          }
        }
      }
    },

    /**
     * Function refreshData: make vuex store data mutable
     * Author: cmc
     * Last Updated: January 16, 2021
     */
    refreshData() {
      // dereference store data
      let preData = JSON.parse(JSON.stringify(this.content[this.idx].input))
      //replace data stubs with stored data
      this.question = preData.question
      this.answers = preData.answers
      this.bg = preData.bg
      this.title = preData.title
    }
  },
  watch: {
    content() {
      //FIXME doesn't actually watch the property
      this.refreshData()
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

  width: stretch;
  /* height: max-content; */
  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.dialog-text.absolute {
  position: absolute;
  bottom: 0px;
  left: 0px;
  top: 0px;
}

.question {
  position: relative;
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
  background-color: #ffffff78;
  border-radius: 3px;
  line-height: 1.5;
}
/*
.answers > button {
  border: 1px solid #222;
  margin-right: 1rem;
  font-size: 90%;
  line-height: 1.5;

}

.answers > button:last-child {
  margin-right: 0;
}*/


.answers-d-flex-justify-content-around{
  display: inline-block;
  flex-direction: row;
  border: 1px solid #222;
  margin-left: 1em;
  margin-bottom: 2em;
  font-size: 90%;
  flex-wrap: wrap;
}
</style>
