<!--
Filename: ly-course-list.vue
Use: List all available courses, users can start or enroll
Creator: core
Date: unknown
Dependencies: 
  @/mixins/locale.vue,
  axios,
  vuex
-->

<template>
  <div 
    class="laya-course-list"
    :class="langIsAr? 'text-right' : 'text-left'"
  >

    <div class="container-fluid">

      <div class="row">
        <div class="col">
          <h3
            v-show="filtered.length === 0"
            class="text-center text-muted"
          >
            {{ i18n['noCourses'] }}
          </h3>
        </div>
      </div>

      <div class="row header" v-if="filtered.length > 0">
        <div class="col">
          <h4>{{ i18n['namePH'] }}</h4>
        </div>
        <div class="col">
          <h4>{{ i18n['cat'] }}</h4>
        </div>
        <div class="col-2">
          <h4 class="sr-only">{{ i18n['courseList.properties'] }}</h4>
        </div>
        <div class="col-3">
        </div>
      </div>

      <div v-for="course in filtered"
           :key="course.category+'-'+course.name"
           class="row py-3 course">

        <div class="col">
          {{ course.name }}
        </div>

        <div class="col">
          {{ course.category }}
        </div>

        <div class="col-2">
          <ul class="course-props">
            <li
              v-for="set in Object.entries(course.properties)"
              :key="`setting-${set[0]}`"
              v-show="set[1]"
            >
              <span
                :title="i18n[`courseList.properties.${set[0]}`]"
                v-b-tooltip.top
              >
                <b-icon
                  :icon="getIcon(set[0])"
                  :aria-describedby="`label-desc-${set[0]}`"
                  :animation="compliesWithUserPrefs(set[0])? '' : 'fade'"
                ></b-icon>
                <span
                  class="sr-only"
                  :id="`label-desc-${set[0]}`"
                >
                  {{ i18n[`courseList.properties.${set[0]}`] }}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div class="col-3">
          <router-link
            :to="'/courses/'+course.name+'/1'"
            class="btn text-dark px-2 py-1 d-inline-block text-center w-100"
            v-if="!enrollmentNeeded(course)" >
            {{ i18n['courseList.start'] }}
            <i class="fas fa-arrow-right"></i>
          </router-link>
          <a
            class="btn text-dark px-2 py-1 d-inline-block text-center w-100 text-break"
            v-else
            @click="subscribe(course)"
          >
            {{ i18n['courseList.subscribe'] }}
            <i class="fas fa-file-signature"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import http from 'axios'
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'laya-course-list',

  mixins: [
    locale
  ],

  data() {
    return {
      filteredList: [],
      enrolledIn: []
    }
  },

  props: {
    filter: String,
  },

  computed: {
    ...mapGetters([
      'courseList',
      'mediaPrefs',
      'userId'
    ]),

     /**
     * filtered: filter course list depending on user input
     *
     * Author: core
     *
     * Last updated: March 24, 2021
     */
    filtered() {
      if (!this.filter) return this.courseList

      const filterByCourseName = new RegExp(this.filter, 'i');
      return this.filteredList.filter(course => filterByCourseName.test(course.name))
    }
  },

  created() {
    this.getSubs()
    this.filteredList = [...this.courseList]
  },

  methods: {

    compliesWithUserPrefs(prop) {
      return Object.prototype.hasOwnProperty.call(this.mediaPrefs, prop)?
        this.mediaPrefs[prop] : true
    },

    /**
     * function getIcon: return string for icon corresponding to setting prop
     *
     * Author: cmc
     *
     * Last Updated: October 26, 2021
     * @param {string} setting prop that need icon
     * @returns {string} icon name
     */
    getIcon(setting) {
      switch (setting) {
        case 'enrollment':
          return 'key'
        case 'simpleLanguage':
          return 'check2-circle'
        case 'text':
          return 'textarea-t'
        case 'video':
          return 'play-btn'
        default:
          return ''
      }
    },

    /**
     * Function getSubs: get a list of all courses the user enrolled in
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     */
    getSubs() {
      let self = this
      let studentId = this.userId
     
      http
        .get(`enrollments/getAllByStudentId/?uid=${studentId}`)
        .then(({ data }) => {
          const list = data.sublist
          for(let item of list) {
            self.enrolledIn.push(item.courseId)
          }
        })
        .catch(err => {
          // console.log(`No enrollments for ${studentId} found`)
          console.error(err)
        })
      
    },

    /**
     * Function enrollmentNeeded: return true if course needs and enrollment, false if not
     * 
     * Author: cmc
     * 
     * Last Updated: October 26, 2021
     * @param course the Course object for which it's checked
     * @returns true if course needs enrollment, false if not
     */
    enrollmentNeeded(course) {
      return course.properties.enrollment?
       this.enrolledIn.find(x => x === course.courseId) :
       false
    },

    /**
     * Function subscribe: Lets user enroll in a course
     * 
     * @param course the course the user wants to enroll in
     * 
     * Author: cmc
     * 
     * Last Updated: March 12, 2021
     * 
     */
    subscribe(course) {
      const self = this
      const newEnrollment = {
        courseId: course.courseId,
        studentId: this.userId
      }

      /* create enrollment */
      http.post('enrollments/create', newEnrollment)
        .then((resp) => {
          self.enrolledIn.push(resp.data.enrol.courseId)
        })
        .catch((err) => console.error(err))

    }
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.header {
  border-bottom: 2px solid black;
}

.course {
  border-bottom: 1px dashed black;
}

.course-props {
  list-style-type: none;
  padding: 0;
}

.course-props li {
  display: inline-block;
  margin-right: 1rem;
}

.course > div {
  font-size: 120%;
}

.col-3 > a {
  border: 2px solid black
}
</style>
