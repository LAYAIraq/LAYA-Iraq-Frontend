<!--
Filename: course-create.vue
Use: This file implements the form to add a new course
Creator: core
Date: unknown
Dependencies:
  axios,
  vuex,
  @/i18n/course-update
-->

<template>
  <div class="laya-course-new-view">
    <h3 :class="langIsAr? 'text-right' : 'text-left'">
      {{ y18n('courseCreate.createCourse') }}
    </h3>
    <hr>
    <form class="mt-3">
      <div class="form-group row">
        <label
          for="new-course-name"
          class="col-3 col-form-label"
        >
          {{ y18n('courseCreate.courseName') }}
        </label>
        <div class="col">
          <input
            id="new-course-name"
            v-model="newCourse.name"
            type="text"
            class="form-control"
            :placeholder="y18n('courseCreate.courseName')"
            @blur="trimNames"
          >
        </div>
      </div>
      <div class="form-group row">
        <label
          for="new-course-category"
          class="col-3 col-form-label"
        >
          {{ y18n('cat') }}
        </label>
        <div class="col">
          <input
            id="new-course-category"
            v-model="newCourse.category"
            type="text"
            class="form-control"
            :placeholder="y18n('cat')"
            @blur="trimNames"
          >
        </div>
      </div>
      <!--        COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)-->
      <!--        <div class="form-group row">-->
      <!--          <label for="new-course-enrollment" class="col-3 col-form-label">-->
      <!--            {{ y18n('courseCreate.enrollment') }}-->
      <!--          </label>-->
      <!--          <div class="col">-->
      <!--            <input-->
      <!--              id="new-course-enrollment"-->
      <!--              type="checkbox"-->
      <!--              class="form-control"-->
      <!--              ref="enrollmentRequired"-->
      <!--            >-->
      <!--          </div>-->
      <!--        </div>-->
      <div class="form-group row">
        <div
          id="error-msg"
          class="col"
        >
          <span class="text-danger form-control-plaintext text-right">
            {{ msg }}
          </span>
        </div>
        <div class="col-4">
          <button
            type="submit"
            class="btn btn-block btn-primary"
            :disabled="!formValid"
            @click.prevent="duplicateCheck"
          >
            <i class="fas fa-check"></i>
            {{ y18n('save') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'CourseCreate',

  mixins: [
    locale
  ],

  data () {
    return {
      duplicateNameCategory: false,
      msg: '',
      newCourse: {
        category: '',
        name: ''
      },
      newCourseNeedsEncoding: false
    }
  },
  computed: {
    ...mapGetters(['courseList', 'userId']),

    /**
     * formValid: to test if both name and category are set
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    formValid () {
      return !!this.newCourse.name && !!this.newCourse.category
    },

    /**
     * needsEnrollment: Check if new course will need an enrollment
     *
     * Author: cmc
     *
     * Last updated: unknown
     */
    needsEnrollment () {
      return !!this.$refs.enrollmentRequired.checked
    }

  },

  methods: {

    /**
     * Function checkNames: check if name or category contain sensitive
     *  characters
     *
     *  Author: cmc
     *
     *  Last Updated: March 1, 2022
     **/
    checkNames () {
      const { newCourse } = this
      // regex for reserved URL encoding characters
      // eslint-disable-next-line
      const reserved = /[:/?#\[\]@!$%&'()*+,;=]+/
      this.newCourseNeedsEncoding = reserved.test(newCourse.name)
      if (!this.newCourseNeedsEncoding) {
        this.newCourseNeedsEncoding = reserved.test(newCourse.category)
      }
    },

    /**
     * Function duplicateCheck: check for duplicate keys before storing the course
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    duplicateCheck () {
      for (const entry of this.courseList) {
        if (this.newCourse.name === entry.name) {
          this.msg = this.y18n('courseCreate.courseExists')
          return
        }
      }
      this.storeNewCourse()
    },

    /**
     * Function storeNewCourse: check for duplicate name, persist new database entry,
     *  create a new storage
     *
     * Author: cmc
     *
     * last updated: March 24, 2021
     *  */
    storeNewCourse () {
      this.checkNames()
      const { newCourse, userId } = this
      if (this.newCourseNeedsEncoding) {
        this.msg = this.y18n('courseList.needsEncoding')
      } else {
        this.msg = ''
        // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
        // let enrBool = self.needsEnrollment
        this.$store.dispatch('createCourse', {
          ...newCourse,
          userId: userId
        })
          .then(() => {
            this.$router.push(`/courses/${newCourse.name}/1`)
          })
          .catch(err => {
            console.log(err)
            this.msg = this.y18n('savingFailed')
          })
        if (this.needsEnrollment) {
          this.$store.dispatch('createAuthorEnrollment', {
            name: newCourse.name,
            userId: userId
          })
        }
      }
    },

    /**
     * function trimNames: remove whitespace from beginning and end
     *  of newCourse properties
     *
     *  Author: cmc
     *
     *  Last Updated: October 31, 2021
     */
    trimNames () {
      this.newCourse.name = this.newCourse.name.trim()
      this.newCourse.category = this.newCourse.category.trim()
    }
  }
}
</script>
