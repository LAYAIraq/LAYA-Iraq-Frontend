<!--
Filename: courses.vue
Use: Wrap course list and adding courses
Creator: core
Date: unknown
Dependencies:
  axios,
  vuex,
  @/components/authoring/course-update,
  @/components/ly-course-list,
  @/mixins/locale.vue
  @/misc/utils.js
-->

<template>
  <div class="courses-view">
    <div class="container">
      <div style="height: 2rem"></div>

      <div class="row">
        <img
          class="mx-auto"
          src="../assets/images/kurse.svg"
          :alt="y18n('courses.brain')"
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
          <div class="ly-search-bar">
            <input
              id="search-bar"
              v-model="search"
              type="text"
              :placeholder="y18n('searchPH')"
              :aria-label="y18n('searchPH.label')"
            >
            <i class="icon fas fa-search"></i>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"></div>

    <div class="ly-bg-grey py-5">
      <div class="container">
        <div class="row">
          <div class="col">
            <ly-course-list :filter="search">
            </ly-course-list>
          </div> <!-- col -->
        </div> <!-- row -->
      </div> <!-- container -->
    </div>

    <!-- author view -->
    <div
      v-if="isAuthor"
      class="ly-bg-author py-3 mt-5"
    >
      <div class="container">
        <div class="row">
          <div class="col">
            <lyCourseEdit></lyCourseEdit>
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
import lyCourseList from '@/components/ly-course-list'

import utils from '../misc/utils.js'

export default {
  name: 'CoursesView',

  components: {
    lyCourseEdit: () => import('@/components/authoring/course-create'),
    lyCourseList // not lazily loaded b/c always visible
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
      this.$store.dispatch('fetchCourseList')
    }

  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.ly-search-bar {
  width: 100%;
  padding: 5px 10px;
  border: 2px solid black;
}
.ly-search-bar input {
  width: 90%;
  font-size: 120%;
  border: none;
}
.ly-search-bar .icon {
  float: right;
  margin: 0.4em;
}

#search-bar:focus {
  outline-offset: 1rem;
}
</style>
