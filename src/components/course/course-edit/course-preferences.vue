<!--
  Filename: course-preferences.vue
  Use: Show preferences in Course Tools (e.g. enrollment requirements)
  Creator: cmc
  Date: September 24, 2021
  Dependencies: vuex
-->
<template>
  <div id="course-settings">
    <div class="row mt-5">
      <!-- booleans -->
      <div class="col-4 text-dark">
        <strong>{{ y18n('coursePreferences.title') }}</strong>
      </div>
      <div class="col text-dark">
        <label
          for="course-enrollment"
          class="col-form-label"
        >
          {{ i18n['coursePreferences.enrollment' ] }}
        </label>
        <input
          id="course-enrollment"
          v-model="enrollment"
          class="mr-2 ml-2"
          type="checkbox"
          @click="toggleEnrollment"
        >
        <i
          v-b-tooltip.bottom
          class="fas fa-question-circle"
          :title="y18n('coursePreferences.enrollment.hint')"
        ></i>
      </div>

      <div class="col text-dark form-check">
        <label
          for="course-simple-language"
          class="col-form-label"
        >
          {{ i18n['coursePreferences.simpleLanguage' ] }}
        </label>
        <input
          id="course-simple-language"
          v-model="simpleLanguage"
          type="checkbox"
          class="ml-2 mr-2"
          @click="toggleSimpleLang"
        >
        <a
          v-b-tooltip.bottom
          href="#"
          target="_blank"
          :title="y18n('coursePreferences.simpleLanguage.hint')"
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
    <!--          {{ y18n('coursePreferences.startDate') }}-->
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
    <!--          {{ y18n('coursePreferences.endDate') }}-->
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
        v-if="simpleLanguage && !simple"
        class="col"
      >
        <i class="fas fa-exclamation-triangle"></i>
        {{ y18n('coursePreferences.notAllSimple') }}
      </div>
    </div>
    <div class="row mt-3">
      <b-button
        variant="success"
        @click="changeSettings"
      >
        {{ y18n('coursePreferences.save') }}
      </b-button>
    </div>
    <b-toast
      id="save-success"
      :title="y18n('save')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="save-toast"
    >
      {{ y18n('successfulSave') }}
    </b-toast>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'CoursePreferences',
  mixins: [
    locale
  ],

  data () {
    return {
      enrollment: false,
      simple: false,
      simpleLanguage: false
      // startDate: null,
      // endDate: null
    }
  },

  computed: {
    ...mapGetters(['course', 'courseList'])
  },

  watch: {
    simpleLanguage (val) {
      if (val) {
        this.checkForSimpleLanguage()
      }
    }
  },

  created () {
    // deep copy course preferences from vuex
    const prefs = JSON.parse(JSON.stringify(this.course.properties))
    // console.log('settings: ', prefs)
    this.enrollment = prefs.enrollment
    this.simpleLanguage = prefs.simpleLanguage
    this.checkForSimpleLanguage()
    // this.changeSettings() TODO: why run this onCreated?
    // console.log(JSON.stringify(this.course))
  },

  methods: {
    /**
     * function changeSettings: call store to persist preferences
     *
     * Author: cmc
     *
     * Last Updated: Feburary 08, 2022
     */
    changeSettings () {
      // this.simple = true TODO: why set this true w/o any checks?
      const { course } = this
      // eslint-disable-next-line
      const prefs = (({$laya, ...o}) => o) (this.$data) // strip $laya from data property
      this.$store.commit('coursePropertiesChange', prefs)
      this.$store.commit('courseListPropertiesUpdate', { course, prefs })
      this.$bvToast.show('save-success')
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
    checkForSimpleLanguage () {
      /* helper function to check if object has simple prop
        that is not an empty string */
      const hasSimple = (elem) => {
        return Object.prototype.hasOwnProperty.call(elem, 'simple')
          ? elem.simple !== ''
          : false
      }
      if (this.simpleLanguage) {
        this.simple = true
        // traverse content to children objects and check if they have
        // a simple prop
        for (const content of this.course.content) {
          const iterInput = Object.values(content.input)
          for (const elem of iterInput) {
            if (typeof (elem) === 'object') {
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
              } else if (elem) {
                if (!hasSimple(elem) && !Object.prototype.hasOwnProperty.call(elem, 'ops')) { // has no simple prop and is not a quill object
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
    toggleEnrollment () {
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
    toggleSimpleLang () {
      this.simpleLanguage = !this.simpleLanguage
      // this.changeSettings()
    }

  }

}
</script>
