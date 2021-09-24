<!--
  Filename: course-preferences.vue
  Use: Show preferences in Course Tools (e.g. enrollment requirements)
  Creator: cmc
  Date: September 24, 2021
  Dependencies: vuex
-->
<template>
  <div class="row mt-3">
    <div class="col text-dark">
      <strong>{{ i18n['coursePreferences.title']}}</strong>
    </div>

    <div class="col text-dark">
      <label for="course-enrollment">
        {{ i18n['coursePreferences.enrollment' ]}}
      </label>
      <input
        id="course-enrollment"
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
          v-model="simpleLang"
          @click="toggleSimpleLang"
      >
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
      simpleLang: false
    }
  },

  created() {
    // deep copy course preferences from vuex
  },


  methods: {
    toggleEnrollment()
    {
      this.enrollment = !this.enrollment
    },
    toggleSimpleLang() {
      this.simpleLang = !this.simpleLang
    }
  }

}
</script>