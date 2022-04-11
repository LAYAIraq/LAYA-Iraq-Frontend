<!--
Filename: course-delete.vue
Use: Provide tool to delete whole course
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="row mt-3">
    <div class="col">
      <b-button
        id="delete-button"
        size="sm"
        variant="danger"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-delCourse-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i>
        {{ y18n('deleteCourse') }}
      </b-button>
    </div>

    <div
      class="col text-dark"
    >
      {{ y18n('deleteCourse.deleteCourseTip') }}
    </div>

    <b-modal
      id="author-delCourse-confirm"
      :title="y18n('deleteCourse')"
      header-bg-variant="danger"
      ok-variant="danger"
      :ok-title="y18n('delete')"
      :cancel-title="y18n('cancel')"
      centered
      @ok="delCourse"
    >
      <p>
        {{ y18n('deleteCourse.modal.text') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'CourseDelete',

  mixins: [
    locale
  ],

  computed: {
    ...mapGetters(['course'])
  },

  methods: {
    /**
     * Function delCourse: delete whole course from database
     *
     * Author: cmc
     *
     * Last Updated: April 9, 2021
     */
    delCourse () {
      this.$store.dispatch('deleteCourse')
        .then(() => {
          this.$store.commit('removeFromCourseList', this.course.courseId)
          this.$router.push('/courses')
        })
        .catch(err => console.error('ERROR:', err))
    }
  }
}
</script>
