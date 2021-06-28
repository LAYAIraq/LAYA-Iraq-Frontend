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
        <laya-flag v-if="question.flagged"></laya-flag>
      </div>
      <div class="answers d-flex justify-content-around">
        <button 
          v-for="(answer,i) in answers"
          :key="i"
          type="button"
          class="btn btn-info btn-lg"
          @click="onFinish[i]()">
          {{ answer }}
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'laya-dialog',
  data() {
    if (this.previewData) { // for 'preview' feature
      return {...this.previewData}
    }
    return {
      question: '',
      answers: [],
      bg: '',
      title: ''
    }
  },
  beforeMount() {
    // fetch data from vuex if not preview
    if (!this.previewData) {
      // No attributed Data --> actual view
      this.refreshData()
    }
  },
  computed: {
    ...mapGetters(['content']),

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
  methods: {

    /**
     * Function refreshData: make vuex store data mutable
     * 
     * Author: cmc
     * 
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
      this.showTitle = preData.showTitle
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
  position: relative;
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
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
  background-color: #ffffff78;
  border-radius: 3px;
  line-height: 1.5;
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

</style>
