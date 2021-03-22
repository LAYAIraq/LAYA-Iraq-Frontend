import http from 'axios'
import router from '../../router.js'
import { ids as supportedLangs } from '../../misc/langs.js'

export default {
  state: {
    course: {},
    enrollment: {},
    userEnrolled: false
  },
  getters: {

    /**
     * Function isUserEnrolled: returns if user is enrolled
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains userEnrolled boolean 
     * @returns true if user is enrolled
     */
    isUserEnrolled (state: { userEnrolled: boolean}) {
      return state.userEnrolled
    },

    /**
     * Function hasContent: returns content of given course
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains course Object
     * @returns content Array
     */
    hasContent(state: { course: { content: Array<object> } } ) {
      return state.course.content
    },

    /**
     * Function hasCourse: returns course Object
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains course Object
     * @returns course Object
     */
    hasCourse(state: { course: object } ) {
      return state.course
    }
  },
  mutations: {

    /**
     * Function appendContent: add a content block to content array
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course containing content array
     * @param data content to add
     */
    appendContent ( state: { course: { content: Array<object> } }, 
      data: { name: string, nextStep: string, input: object } ) {
      state.course.content.push(data)
    },

    /**
     * Function delContent: remove Content at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course object
     * @param step index of content to remove
     */
    delContent( state: 
        { course: { content: object[] } }, 
        step: number ) {
      state.course.content.splice(step, 1)
    },

    /**
     * Function renameCourse: rename a Course
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course 
     * @param newName string for new name
     */
    renameCourse( state: {course: {name: string}}, newName: string) {
      state.course.name = newName
    },

    /**
     * Function setEnrollment: set an enrollment for current user
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains enrollment, userEnrolled
     * @param data enrollment object
     */
    setEnrollment(state: {enrollment: object, userEnrolled: boolean }, data: object) {
      state.enrollment = data
      state.userEnrolled = true
    },

    /**
     * Function setCourse: set state to given course
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course
     * @param data course object
     */
    setCourse(state: { course: object}, data: object) {
      state.course = data
    },

    /**
     * Function updateCourseNav: replace content with input content array
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course, content
     * @param data new content array
     */
    updateCourseNav( state: {course: {content: Array<object>}}, data: Array<object>) {
      state.course.content = data
    },

    /**
     * Function updateStep: update content block at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course, content
     * @param data contains step index, new content object 
     */
    updateStep( state: {course: {content: Array<object>}} , 
        data: { step: number, updatedStep: object } ) {
      state.course.content[data.step] = {
        ...state.course.content[data.step], 
        ...data.updatedStep
      }
    }

  },
  actions: {

    /**
     * Function fetchEnrollment: fetch enrollment created at given date
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param createdDate identifier for enrollment
     */
    fetchEnrollment({ commit, state, rootState }, createdDate: string) {
      const self = this
      let uid = rootState.auth.userId
      let cid = createdDate
      console.log(cid)
      http.get('enrollments/findOne', {params: {filter:{where: {studentId: uid, createDate: cid}}}})
          .then(({data}) => {
            console.log('Enrollment exists!')
            commit('setEnrollment', data)
          })
          .catch(err => {
            console.log('No enrollment found!')
            console.error(err)
          })
    },

    /**
     * function updateEnrollment: update enrollment object
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables 
     */
    updateEnrollment({ commit, state, rootState } ) {
      const enrol = state.enrollment

      http.patch(`enrollments/${enrol.id}`, enrol)
          .then(resp => {
            console.log('Enrollment updated!')
          })
          .catch(err => {
            console.error(err)
          })
    },

    /**
     * Function fetchCourse: load course into store
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param name course identifier
     * @returns Promise to load course object
     */
    fetchCourse ({ commit, state, rootState}, name: string) {
      //can you return router function? //TODO direkt hier 
      return new Promise((resolve, reject) => {
        commit('setBusy', true)
        /*
        * fetch course */
        http.get(`courses/${name}`)
          .then(({ data }) => {
            // console.log(data)
            commit('setCourse', data)
            resolve('Course loaded')
          })
          .catch(err => {
            /*
            * redirect off invalid course */
            console.error(err)
            reject(err)
          })
          .finally(() => commit('setBusy', false))
        })
      
    },

    /**
     * Function storeCourse: persist changes to store in database
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @returns Promise to save changes
     */
    storeCourse({ commit, state, rootState}) {
      let updated = Date.now()
      let cName = state.course.name
      let cContent = state.course.content

      return new Promise( (resolve, reject) => { 
        http.patch(`courses/${cName}`, {content: cContent, lastChanged: updated})
          .catch(err => {
            console.error('Failed storing course content:', err)
            reject(err)
          })
          .finally(()  => {
            resolve('Course updated successfully')
          })
        })
      
    },

    /**
     * Function updateRenamedCourse: delete old course, replace with one in store
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param oldName old name of course to update
     */
    updateRenamedCourse( { commit, state, rootState}, oldName: string ) {
      
      http.delete(`courses/${oldName}`)
          .then(function() {
          let renamed_course = state.course
          http.post(`courses`, renamed_course)
              .catch(err => {
                console.error('Failed course rename:', err)
                return false
              })
              .finally(() => {
                return true
              })
          })
          .catch( () => {
          })
    }      
  }
}