<!--
  Filename: course-list.vue
  Use: Wrap course list and adding courses
  Creator: core
  Since: v1.0.0
-->

<template>
  <div class="course-list">
    <div class="container">
      <div style="height: 2rem"></div>

      <div class="row">
        <img
          class="mx-auto"
          src="../../../assets/images/kurse.svg"
        >
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <h1 class="text-center">
            <strong>{{ y18n('courses.title') }}</strong>
          </h1>
        </div>
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <div class="search-bar">
            <input
              id="search-bar"
              v-model="search"
              type="text"
              :placeholder="y18n('searchPH')"
              :aria-label="y18n('searchPH.label')"
            >
            <i
              class="icon fas fa-search"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"></div>

    <div class="bg-grey py-5">
      <div class="container">
        <div class="row">
          <div class="col">
            <course-list-details :filter="search">
            </course-list-details>
          </div> <!-- col -->
        </div> <!-- row -->
      </div> <!-- container -->
    </div>

    <!-- author view -->
    <div
      v-if="isAuthor"
      class="bg-author py-3 mt-5"
    >
      <div class="container">
        <div class="row">
          <div class="col">
            <course-create></course-create>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
// import http from 'axios'
import CourseListDetails from '@/components/course/course-list/course-list-details.vue'

import utils from '../../../mixins/general/helpers.ts'

export default {
  name: 'CourseList',

  components: {
    CourseCreate: () => import('@/components/course/course-list/course-create.vue'),
    CourseListDetails // not lazily loaded b/c always visible
  },

  mixins: [
    locale
  ],

  data () {
    return {
      courses: [],
      search: ''
    }
  },

  computed: {
    ...mapGetters([
      'courseList',
      'isAuthor'
    ])
  },

  created () {
    this.fetchCourses()
  },

  methods: {
    ...utils,

    /**
     * Function fetchCourses: fetch all courses from database
     *
     * Author: core
     *
     * Last Updated: January 20, 2021
     */
    fetchCourses () {
      this.$store.dispatch('courseListFetch')
    }

  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.search-bar {
  width: 100%;
  padding: 5px 10px;
  border: 2px solid black;
}
.search-bar input {
  width: 90%;
  font-size: 120%;
  border: none;
}
.search-bar .icon {
  float: right;
  margin: 0.4em;
}

#search-bar:focus {
  outline-offset: 1rem;
}
</style>
