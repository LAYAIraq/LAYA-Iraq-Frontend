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
      v-if="title.show"
      :id="title.id"
      class="row flaggable "
    >
      <div class="col">
        <h2>
          {{ courseSimple? title.simple: title.text }}
        </h2>
      </div>
    </div>
    <!-- TODO: dynamic CSS for background image -->
    <div class="button-navigation-text">
      <div
        v-if="task"
        :id="task.id"
        class="flaggable question"
      >
        {{ courseSimple? task.simple: task.text }}
        <flag-icon
          v-if="!editPreview"
          :ref-data="task"
          @flagged="task.flagged = true"
        ></flag-icon>
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
          <flag-icon
            v-if="!editPreview"
            :ref-data="answer"
            :interactive="true"
            @flagged="answer.flagged = true"
          ></flag-icon>
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
      ...this.viewData
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
