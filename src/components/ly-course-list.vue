<!--
Filename: ly-course-list.vue
Use: List all available courses, users can start or enroll
Creator: core
Date: unknown
Dependencies: 
  @/i18n/course-list,
  axios,
  vuex
-->

<template>
  <div class="laya-course-list">

    <div class="container-fluid">

      <div class="row">
        <div class="col">
          <h3 v-show="filtered.length === 0" class="text-center text-muted">
            {{ i18n.noCourses }}
          </h3>
        </div>
      </div>

      <div class="row header" v-if="filtered.length > 0">
        <div class="col">
          <h4>{{ i18n.name }}</h4>
        </div>
        <div class="col">
          <h4>{{ i18n.category }}</h4>
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

        <div class="col-3">
          <router-link
            :to="'/courses/'+course.name+'/1'"
            class="text-dark px-2 py-1 d-inline-block text-center"
            v-if="!enrollmentNeeded(course)" >
            {{ i18n.start }} <i class="fas fa-arrow-right"></i>
          </router-link>
          <a class="text-dark px-2 py-1 d-inline-block text-center" 
            v-else @click="subscribe(course)" href="#">{{ i18n.subscribe }}</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/course-list'
import http from 'axios'
import { 
  mapState, 
  mapGetters 
} from 'vuex'

export default {
  name: 'laya-course-list',
  data() {
    return {
      enrolledIn: []
    }
  },
  props: {
    courses: Array,
    filter: String,
  },
  mounted() {
    this.getSubs()
  },
  updated(){
    // this.getSubs()
  },
  computed: {
    ...mapGetters(['profileLang']),
    ...mapState(['auth']),

    /**
     * filtered: filter course list depending on user input
     * 
     * Author: core
     * 
     * Last updated: unknown 
     */
    filtered() {
      if (!this.filter) return this.courses

      const filterByCourseName = new RegExp(this.filter, 'i')
      return this.courses.filter(course => filterByCourseName.test(course.name))
    },

     /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: unknown
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function getSubs: get a list of all courses the user enrolled in
     * 
     * Author: cmc
     * 
     * Last Updated: unkown
     */
    getSubs() {
      let self = this
      let studentId = this.auth.userId
     
      http
        .get(`enrollments/getAllByStudentId/?uid=${studentId}`)
        .then(({ data }) => {
          const list = data.sublist
          for(let item of list) {
            self.enrolledIn.push(item.createDate)
          }
        })
        .catch(err => {
          console.log(`No enrollments for ${studentId} found`)
          // console.error(err)
        })
      
    },

    /**
     * Function enrollmentNeeded: return true if course needs and enrollment, false if not
     * 
     * @param course the Course object for which it's checked
     * 
     * @returns true if course needs enrollment, false if not
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     */
    enrollmentNeeded(course) {
      if (course.needsEnrollment) {
        return this.enrolledIn.find(x => x == course.createDate)? false : true
      }
      else {
        return false
      }
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
        createDate: course.createDate,
        studentId: this.auth.userId
      }

      /* create enrollment */
      http.patch('enrollments', {
        ...newEnrollment
      }).then(() => {
        
      }).catch((err) => {
        console.log(err)
      })

      self.$nextTick( () => {
        self.getSubs()
      })

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

.course > div {
  font-size: 120%;
}

.col-3 > a {
  border: 2px solid black
}
</style>
