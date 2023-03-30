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
      v-auth-image="bg"
      class="bg"
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
          v-if="!editPreview"
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
            v-if="!editPreview"
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

import { locale, viewPluginProps } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/assets/styles/flaggables.css'

export default {
  name: 'LayaDialog',

  mixins: [
    locale,
    viewPluginProps
  ],

  data () {
    return {
      ...this.viewData
    }
  },

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseSimple'
    ])
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
