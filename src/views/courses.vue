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
  @/i18n/courses,
  @/misc/utils.js
-->

<template>
  <div class="courses-view">
    <div class="container">

      <div style="height: 2rem"></div>

      <div class="row">
        <img class="mx-auto" src="../assets/kurse.svg" :alt="i18n.brain">
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <h1 class="text-center">
            <strong>{{ i18n.title }}</strong>
          </h1>
        </div>
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <div class="ly-search-bar">
            <input id="search-bar"
                   type="text"
                   v-model="search"
                   :placeholder="i18n.searchPH">
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
    <div class="ly-bg-author py-3 mt-5" v-if="isAuthor">
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
import { mapState, mapGetters } from 'vuex'
import http from 'axios'

import lyCourseEdit from '@/components/authoring/course-update'
import lyCourseList from '@/components/ly-course-list'

import * as i18n from '@/i18n/courses'
import utils from '../misc/utils.js'

export default {
  name: 'courses-view',
  mounted() {
    document.querySelector('#search-bar').focus()
    this.fetchCourses()
  },
  data() {
    return {
      courses: [],
      search: '',
    }
  },
  computed: {
    ...mapState(['note', 'auth']),
    ...mapGetters(['courseList', 'isAuthor', 'profileLang']),

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
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
    fetchCourses() {
      this.$store.dispatch('fetchCourseList')
    },

    /**
     * Function delCourse: remove course
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     * 
     * @param {string} name name of course to delete
     */
    delCourse(name) { //FIXME never called
      const { fetchCourses } = this
      http.delete(`courses/${name}`)
        .catch(err => console.error(err))
        .then(fetchCourses)
    },

  },
  components: {
    lyCourseEdit,
    lyCourseList
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
