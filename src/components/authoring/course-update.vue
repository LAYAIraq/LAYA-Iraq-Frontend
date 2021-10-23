<!-- 
Filename: course-update.vue
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
      {{ i18n['courseUpdate.createCourse'] }}
    </h3>
    <hr>
    <form class="mt-3">
      <div class="form-group row">
        <label for="new-course-name" class="col-3 col-form-label">
          {{ i18n['courseUpdate.courseName'] }}
        </label>
        <div class="col">
          <input id="new-course-name"
                 type="text"
                 class="form-control"
                 v-model="newCourse.name"
                 :placeholder="i18n['courseUpdate.courseName']">
        </div>
      </div>     
      <div class="form-group row">
        <label for="new-course-category" class="col-3 col-form-label">
          {{ i18n['cat'] }}
        </label>
        <div class="col">
          <input id="new-course-category"
                 type="text"
                 class="form-control"
                 v-model="newCourse.category"
                 :placeholder="i18n['cat']">
        </div>
      </div>
      <div class="form-group row">
        <label for="new-course-enrollment" class="col-3 col-form-label">
          {{ i18n['courseUpdate.enrollment'] }}
        </label>
        <div class="col">
          <input 
            id="new-course-enrollment"
            type="checkbox"
            class="form-control"
            ref="enrollmentRequired"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col">
          <span class="text-danger form-control-plaintext text-right">
            {{msg}}
          </span>
        </div>
        <div class="col-4">
          <button 
            type="submit"
            class="btn btn-block btn-primary"
            :disabled="!formValid"
            @click="duplicateCheck"
          >
            <i class="fas fa-check"></i> 
            {{ i18n['save'] }}
          </button>
        </div>
      </div>
    </form>


  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import http from 'axios'
import { locale } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'course-update',

  mixins: [
    locale
  ], 

  data() {
    return {
      msg: '',
      newCourse: {
        name: '',
        category: ''
      },
      duplicateNameCategory: false
    }
  },
  computed: {
    ...mapState(['note', 'auth']),
    ...mapGetters(['courseList']),

    /**
     * formValid: to test if both name and category are set
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    formValid() {
      return !!this.newCourse.name && !!this.newCourse.category
    },

    /**
     * needsEnrollment: Check if new course will need an enrollment
     * 
     * Author: cmc
     * 
     * Last updated: unknown
     */
    needsEnrollment() {
      return this.$refs.enrollmentRequired.checked
    }

  },
  methods: {


    /**
     * Function duplicateCheck: check for duplicate keys before storing the course
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     */
    duplicateCheck() {
      for(let entry of this.courseList) {
        if (this.newCourse.name == entry.name) {
          this.msg = this.i18n['courseUpdate.courseExists']
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
    storeNewCourse() {
      
      const self = this
      const { newCourse, auth } = this;

      let enrBool = self.needsEnrollment
      let newId = uuidv4()
      console.log(`New Id: ${newId}`)

      /* create storage */
      http.post('storage', {
        name: newId,
      }).then(() => console.log(`New Storage: ${newId}`))
        .catch((err) => console.error(err));

      /* create course */
      http.post('courses', {
        ...newCourse,
        authorId: auth.userId,
        storageId: newId,
        needsEnrollment: enrBool
        }).then( () => {
          // console.log(resp)
          self.$router.push(`/courses/${newCourse.name}/1`)

          /* create enrollment for creator */
          if (enrBool) {
              http.get(`courses/getCourseId?courseName=${newCourse.name}`).
                then( resp => {
                  const newEnrollment = {
                    courseId: resp.data.courseId,
                    studentId: self.auth.userId
                  }
                  http.patch('enrollments', {
                    ...newEnrollment
                  }).catch((err) => {console.log(err)})
                })
          }
        }).catch((err) => {
          console.log(err)
          self.msg = self.i18n['savingFailed']
      })

    }
  }
}
</script>
