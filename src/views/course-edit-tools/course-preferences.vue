<!--
  Filename: course-preferences.vue
  Use: Show preferences in Course Tools (e.g. enrollment requirements)
  Creator: cmc
  Date: September 24, 2021
  Dependencies: vuex
-->
<template>
  <div id="laya-course-settings">
    <div class="row mt-5">
      <!-- booleans -->
      <div class="col-4 text-dark">
        <strong>{{ i18n['coursePreferences.title']}}</strong>
      </div>

<!--      COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)  -->
<!--      <div class="col text-dark">-->
<!--        <label-->
<!--          for="course-enrollment"-->
<!--          class="col-form-label"-->
<!--        >-->
<!--          {{ i18n['coursePreferences.enrollment' ]}}-->
<!--        </label>-->
<!--        <input-->
<!--          id="course-enrollment"-->
<!--          class="mr-2 ml-2"-->
<!--          type="checkbox"-->
<!--          v-model="enrollment"-->
<!--          @click="toggleEnrollment"-->
<!--        >-->
<!--        <i-->
<!--          class="fas fa-question-circle"-->
<!--          :title="i18n['coursePreferences.enrollment.hint']"-->
<!--          v-b-tooltip.bottom-->
<!--        ></i>-->
<!--      </div>-->


      <div class="col text-dark form-check">
        <label
          for="course-simple-language"
          class="col-form-label"
        >
          {{ i18n['coursePreferences.simpleLanguage' ]}}
        </label>
        <input
            id="course-simple-language"
            type="checkbox"
            class="ml-2 mr-2"
            v-model="simpleLanguage"
            @click="toggleSimpleLang"
        >
        <a
          href="#"
          target="_blank"
          :title="i18n['coursePreferences.simpleLanguage.hint']"
          v-b-tooltip.bottom
        >
          <i class="fas fa-question-circle"></i>
        </a>
      </div>
    </div>
    <!-- course dates unused as of 2021 -->
<!--    <div class="row mt-3">-->
<!--      <div class="col">-->
<!--      </div>-->
<!--      <div class="col">-->
<!--        <label-->
<!--          for="course-start-date">-->
<!--          {{ i18n['coursePreferences.startDate'] }}-->
<!--        </label>-->
<!--        <input-->
<!--          id="course-start-date"-->
<!--          type="date"-->
<!--          v-model="startDate"-->
<!--        >-->
<!--      </div>-->
<!--      <div class="col">-->
<!--        <label-->
<!--            for="course-end-date">-->
<!--          {{ i18n['coursePreferences.endDate'] }}-->
<!--        </label>-->
<!--        <input-->
<!--          id="course-end-date"-->
<!--          type="date"-->
<!--          v-model="endDate"-->
<!--        >-->
<!--      </div>-->
<!--    </div>-->
    <div
      class="row"
    >
      <!-- warnings -->
      <div
        class="col"
        v-if="simpleLanguage && !simple"
      >
        <i class="fas fa-exclamation-triangle"></i>
        {{ i18n['coursePreferences.notAllSimple']}}
      </div>
    </div>
    <div class="row mt-3">
      <b-button
        variant="success"
        @click="changeSettings"
      >
        {{ i18n['coursePreferences.save'] }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  mixins: [
    locale
  ],
  computed: {
    ...mapGetters(['course', 'courseList'])
  },
  data() {
    return {
      enrollment: false,
      simple: false,
      simpleLanguage: false,
      // startDate: null,
      // endDate: null
    }
  },
  watch: {
    simpleLanguage (val) {
      if(val) {
        this.checkForSimpleLanguage()
      }
    }
  },

  created() {
    // deep copy course preferences from vuex
    const prefs = JSON.parse(JSON.stringify(this.course.properties))
    // console.log('settings: ', prefs)
    this.enrollment = prefs.enrollment
    this.simpleLanguage = prefs.simpleLanguage
    this.checkForSimpleLanguage()
    this.changeSettings()
    //console.log(JSON.stringify(this.course))
  },


  methods: {
    /**
     * function changeSettings: call store to persist preferences
     *
     * Author: cmc
     *
     * Last Updated: Feburary 08, 2022
     */
    changeSettings() {
      this.simple = true
      const {course } = this
      //eslint-disable-next-line
      const prefs = (({$laya, ...o}) => o) (this.$data) // strip $laya from data property
      this.$store.commit('changeCourseProperties', prefs)
      this.$store.commit('setPropertyToCourseInCourseList', {course, prefs})
      this.$emit('settingsChanged')
    },

    /**
     * function checkForSimpleLanguage: check if children have simple
     *  language property that is not empty, set simple property
     *  accordingly
     *
     *  Author: cmc
     *
     *  Last Updated: October 31, 2021
     * @returns {null} when simple prop is not set everywhere
     */
    checkForSimpleLanguage() {
      /* helper function to check if object has simple prop
        that is not an empty string */
      const hasSimple = (elem) => {
         return Object.prototype.hasOwnProperty.call(elem, 'simple')?
           elem.simple !== '' : false
      }
      if (this.simpleLanguage) {
        this.simple = true
        // traverse content to children objects and check if they have
        // a simple prop
        for (const content of this.course.content) {
          const iterInput = Object.values(content.input)
          for (const elem of iterInput) {
            if (typeof(elem) === 'object') {
              if (Array.isArray(elem)) {
                for (const iter of elem) {
                  if (iter) {
                    if (!hasSimple(iter)) {
                      // console.log(iter)
                      // console.log(' doesnt have simple')
                      this.simple = false
                      return null
                    }
                  }
                }
              } else if (elem){
                if (!hasSimple(elem)) {
                  if (Object.prototype.hasOwnProperty.call(elem, 'ops')) { // object is squill input
                    return null
                  }
                  // console.log(elem)
                  // console.log(' doesnt have simple')
                  this.simple = false
                  return null
                }
              }
            }
          }
        }
      }
    },

    /**
     * function toggleEnrollment: toggle enrollment boolean
     *
     * Author: cmc
     *
     * Last Updated: October 31, 2021
     */
    toggleEnrollment()
    {
      this.enrollment = !this.enrollment
      // this.changeSettings()
    },

    /**
     * function toggleSimpleLang: toggle simpleLanguage boolen
     *
     * Author: cmc
     *
     * Last Updated: October 31, 2021
     */
    toggleSimpleLang() {
      this.simpleLanguage = !this.simpleLanguage
      // this.changeSettings()
    }

  }

}
</script>