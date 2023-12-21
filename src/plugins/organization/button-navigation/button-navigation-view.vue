<!--
Filename: button-navigation-view.vue
Use: View Button Navigation content block
Author: core
Since v1.0.0
-->

<template>
  <div
    class="button-navigation-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div
      :id="title.id"
      :class="courseLangIsAr? 'flaggable-ar row' : 'flaggable-en row'"
    >
      <div
        class="col"
        :class="courseLangIsAr? 'text-right' : 'text-left'"
      >
        <h1 class="pb-3">
          {{ courseSimple? title.simple: title.text }}
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
    <!-- TODO: dynamic CSS for background image -->
    <div class="button-navigation-text">
      <div
        v-if="task"
        :id="task.id"
        class="question"
      >
        {{ courseSimple? task.simple: task.text }}
      </div>
      <div class="answers d-flex flex-wrap justify-content-around">
        <div
          v-for="(answer,i) in answers"
          ref="answerButton"
          :key="answer.id"
          class="answer-item"
        >
          <button
            type="button"
            class="btn btn-info btn-lg answer-item"
            @click="onFinish[i]()"
          >
            {{ courseSimple? answer.simple : answer.text }}
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <navigation-buttons
        :cid="id"
        :button-nav="true"
      ></navigation-buttons>
    </div>
  </div>
</template>

<script>

import { locale, pluginView } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import NavigationButtons from '@/components/helpers/navigation-buttons.vue'

export default {
  name: 'ButtonNavigationView',
  components: { NavigationButtons, FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData,
      newButtonHeight: ''
    }
  },

  computed: {
    ...mapGetters([
      'courseContentFollowMap',
      'courseFlags',
      'courseRoutes',
      'courseSimple'
    ]),
    /**
     * @description array of routing changes for buttons
     * @author cmc
     * @since v1.3.1
     * @returns {*[]} array of route change functions, one for each button
     */
    onFinish () {
      const routes = []
      this.courseContentFollowMap[this.viewData.id] // list of ids for following content
        .forEach(id => {
          routes.push(() => this.$router.push({ params: { coursePath: this.courseRoutes[id] } }))
        })
      return routes
    }
  }

}
</script>

<style scoped>
.button-navigation {
  position: relative;
   /*min-height: 20rem;*/

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

.button-navigation-text {
  width: auto;
/*   height: max-content; */
  /* background-color: #ffffffd9; */
  margin: 1rem;
  border: 1px solid grey;
  padding: 1rem;
}

.button-navigation-text.absolute {
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
}

.question {
  position: relative;
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;  word-wrap: break-word;

  padding: 5px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 3px;
  line-height: 1.5;
}

.answer-item {
  display: block;
  position: relative;
  width: 400px;
  height: auto;
  word-break: break-word;
}

@media (max-width: 768px) {
  .answer-item {
    display: block;
    position: relative;
    width: 200px;
    word-break: break-word;
  }
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
.centering {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
