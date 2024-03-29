<!--
  Filename: course-create.vue
  Use: This file implements the form to add a new course
  Creator: core
  Since: v1.0.0
-->

<template>
  <div class="course-create">
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
      <!-- Category -->
      <div class="form-group row">
        <label
          for="new-course-category"
          class="col-3 col-form-label"
        >
          {{ y18n('cat') }}
        </label>
        <div class="col">
          <b-select
            id="new-course-category"
            v-model="newCourse.category"
            :aria-label="y18n('cat')"
          >
            <b-select-option
              value="null"
            >
              {{ y18n('cat') }}
            </b-select-option>
            <b-select-option
              v-for="opt in categoryChoose"
              :key="opt"
              :value="opt"
            >
              {{ y18n(`course.category.${opt}`) }}
            </b-select-option>
          </b-select>
          <!--
          <input
            id="new-course-category"
            v-model="newCourse.category"
            type="text"
            class="form-control"
            :placeholder="y18n('cat')"
            @blur="trimNames"
          >
          -->
        </div>
      </div>
      <!-- Keywords -->
      <div class="form-group row">
        <label
          for="new-course-keywords"
          class="col-3 col-form-label"
        >
          {{ y18n('keywords') }}
        </label>
        <div class="col">
          <input
            id="new-course-keywords"
            v-model="newCourse.keywords"
            type="text"
            class="form-control"
            :placeholder="y18n('keywords')"
          >
        </div>
      </div>
      <!-- Abstract -->
      <div class="form-group row">
        <label
          for="new-course-abstract"
          class="col-3 col-form-label"
        >
          {{ y18n('abstract') }}
        </label>
        <div class="col">
          <textarea
            id="new-course-abstract"
            v-model="newCourse.abstract"
            class="form-control"
            :placeholder="y18n('abstract')"
            rows="5"
          ></textarea>
        </div>
      </div>

      <div class="form-group row">
        <label
          for="new-course-language"
          class="col-3 col-form-label"
        >
          {{ y18n('courseLanguage') }}
        </label>
        <div class="col">
          <b-select
            v-model="newCourse.language"
            :aria-label="y18n('courseLanguage')"
          >
            <b-select-option
              value="null"
            >
              {{ y18n('courseLanguage') }}
            </b-select-option>
            <b-select-option
              v-for="opt in languageChoose"
              :key="opt"
              :value="opt"
            >
              {{ y18n(`profile.language.${opt}`) }}
            </b-select-option>
          </b-select>
        </div>
      </div>
      <div class="form-group row">
        <label
          for="new-course-enrollment"
          class="col-3 col-form-label"
        >
          {{ y18n('courseCreate.enrollment') }}
        </label>
        <div class="col">
          <input
            id="new-course-enrollment"
            ref="enrollmentRequired"
            type="checkbox"
            class="form-control"
          >
        </div>
      </div>
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
            class="btn btn-block btn-success"
            :disabled="!formValid"
            @click.prevent="duplicateCheck"
          >
            <i
              class="fas fa-save"
              aria-hidden="true"
            ></i>
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
import courseCategories from '@/options/course-categories.ts'
import languages from '@/options/languages.ts'
import { slugify } from '@/mixins/general/slugs'

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
        category: null,
        language: null,
        authorName: '',
        name: '',
        keywords: '',
        abstract: ''
      },
      newCourseNeedsEncoding: false
    }
  },
  computed: {
    ...mapGetters(['courseList', 'userId', 'profile', 'fullName']),

    /**
     * categoryChoose(): add categories
     * Author: nv
     * Since: v1.3.0
     */
    categoryChoose () {
      return [
        ...courseCategories
      ]
    },

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
     * languageChoose(): add languages
     * Author: nv
     * Since: v1.3.0
     */
    languageChoose () {
      return [
        ...languages
      ]
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
      this.newCourse.authorName = this.profile.fullName
      const { newCourse, userId } = this
      if (this.newCourseNeedsEncoding) {
        this.msg = this.y18n('courseList.needsEncoding')
      } else {
        this.msg = ''
        this.$store.dispatch('courseCreate', {
          ...newCourse,
          userId: userId,
          enrollment: this.needsEnrollment
        })
          .then(() => {
            const data = {
              lang: this.courseLanguage,
              cid: this.courseId
            }
            this.$store.dispatch('courseUpdateLanguage', data)
            if (this.needsEnrollment) {
              this.$store.dispatch('createAuthorEnrollment', {
                courseName: newCourse.name,
                userId: userId
              })
            }
            this.$router.push(`/courses/${slugify(newCourse.name)}`)
          })
          .catch(err => {
            console.log(err)
            this.msg = this.y18n('savingFailed')
          })
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
