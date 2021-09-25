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
      <div class="col text-dark">
        <strong>{{ i18n['coursePreferences.title']}}</strong>
      </div>

      <div class="col text-dark">
        <label for="course-enrollment">
          {{ i18n['coursePreferences.enrollment' ]}}
        </label>
        <input
          id="course-enrollment"
          class="ml-auto"
          type="checkbox"
          v-model="enrollment"
          @click="toggleEnrollment"
        >
      </div>

      <div class="col text-dark form-check">
        <label for="course-simple-language">
          {{ i18n['coursePreferences.simpleLanguage' ]}}
        </label>
        <input
            id="course-simple-language"
            type="checkbox"
            v-model="simpleLanguage"
            @click="toggleSimpleLang"
        >
      </div>
    </div>
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
    ...mapGetters(['course'])
  },
  data() {
    return {
      enrollment: false,
      simpleLanguage: false,
      // startDate: null,
      // endDate: null
    }
  },

  created() {
    // deep copy course preferences from vuex
    const prefs = JSON.parse(JSON.stringify(this.course.settings))
    // console.log('settings: ', prefs)
    this.enrollment = prefs.enrollment
    this.simpleLanguage = prefs.simpleLanguage
  },


  methods: {
    changeSettings() {
      //eslint-disable-next-line
      const prefs = (({$laya, ...o}) => o) (this.$data) // strip $laya from data property
      // console.log(prefs)
      this.$store.commit('changeCourseSettings', prefs)
      this.$emit('settingsChanged')
    },
    toggleEnrollment()
    {
      this.enrollment = !this.enrollment
      // this.changeSettings()
    },
    toggleSimpleLang() {
      this.simpleLanguage = !this.simpleLanguage
      // this.changeSettings()
    }

  }

}
</script>