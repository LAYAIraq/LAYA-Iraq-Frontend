<!--
Filename: course-delete.vue 
Use: Provide tool to delete whole course
Creator: cmc
Date: October 27, 2020
Dependencies: 
  axios,
  vuex,
  @/i18n/course-edit/delete-course
-->

<template>
  <div class="row mt-3">
    <div class="col">
      <b-button size="sm"
          variant="danger"
          class="float-right"
          @click="$bvModal.show('author-delCourse-confirm')">
        <i class="fas fa-exclamation-circle"></i> 
        {{ i18n.deleteCourse }}
      </b-button>
    </div>

    <div class="col text-dark" v-html="i18n.deleteCourseTip"></div>
            
    <b-modal id="author-delCourse-confirm"
        :title="i18n.modal.title"
        header-bg-variant="danger"
        ok-variant="danger"
        :ok-title="i18n.modal.ok"
        :cancel-title="i18n.modal.cancel"
        @ok="delCourse"
        centered>
      <p v-html="i18n.modal.text"></p>
    </b-modal>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/course-edit/delete-course'
import http from 'axios'

export default {
  name: 'course-delete',

  computed: {
    ...mapGetters(['profileLang', 'course']),

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },

  methods: {
    /**
     * Function delCourse: delete whole course from database
     * 
     * Author: cmc
     * 
     * Last Updated: April 9, 2021
     */
    delCourse() {
      this.$store.dispatch('deleteCourse')
        .then(() => {
          this.$store.dispatch('fetchCourseList')
          this.$router.push('/courses')
        })
        .catch( err => console.error('ERROR:', err))
    }
  }
}
</script>