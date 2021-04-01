import http from 'axios'
import router from '../../router.js'
import { ids as supportedLangs } from '../../misc/langs.js'
import { courseCopy } from '@/views/course-edit-tools/index.js'
import store from '../index.js'

export default {
  state: {
    course: {},
    courseList: [],
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
     * Function content: returns content of given course
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course Object
     * @returns content Array
     */
    content(state: { course: { content: Array<object> } } ) {
      return state.course.content
    },

    /**
     * Function course: returns course Object
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course Object
     * @returns course Object
     */
    course(state: { course: object } ) {
      return state.course
    },

    /**
     * Function courseFiles: returns array of stored files
     * 
     * Author: cmc 
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @returns array of course files
     */
    courseFiles(state: { course: { files: Array<Object> } }) {
      return state.course.files
    },

    /**
     * Function courseList: returns list of courses
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList 
     * @returns array of courses
     */
    courseList(state: { courseList: Array<Object>}) {
      return state.courseList
    },

    /**
     * Function courseStorage: returns id of course storage
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @returns course storage id
     */
    courseStorage(state: { course: { storageId: string } }) {
      return state.course.storageId
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
    appendContent ( 
      state: { course: { content: Array<Object> } }, 
      data:{ name: String, nextStep: any, input: Object} 
      ) {
      state.course.content.push(data)
    },

    /**
     * Function appendToCourseList: add course object
     *  to courseList array
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList array
     * @param data course objecte to be added to list
     */
    appendToCourseList(
      state: { courseList: Array<Object> }, 
      data: Object ) {
      state.courseList.push(data)
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
     * Function setCourseList: set list of courses in store
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList array
     * @param data array of course objects
     */
    setCourseList(state: { courseList: Array<Object> }, data: Array<Object>) {
      console.log(data)
      state.courseList = data
    },

    /**
     * Function updateCourseFiles: updates list of course files
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @param data array of files
     */
    updateCourseFiles(state: { course: { files: Array<Object> } }, data: Array<Object>) {
      // state.course.files = [...state.course.files, ...data]
      /** 
       * TODO: 
       * find duplicates (filename, type, size)
       * remove files that are no longer in the list
       * 
       */

      //sort data and state alphabetically

      // let mySort = (a: { name: string},b: { name: string }) => {
      //   if(a.name < b.name) return -1
      //   if(a.name > b.name) return 1
      //   return 0
      // }

      // const sortedFiles = state.course.files.sort((a: { name:string },b: { name:string }) => mySort(a,b))
      // const sortedData = data.sort((a: { name:string },b: { name: string }) => mySort(a,b))

      // console.log(sortedFiles)
      // console.log(sortedData)

      // console.log('removing duplicates from state course files')
      // let mofo = state.course.files
      // let removed = 0
      // for (let i=0; i < state.course.files.length; i++) {
      //   if (i == mofo.length - 1) break
      //   for (let j=i+1; j<state.course.files.length; j++) {
      //     //@ts-ignore
      //     if (mofo[i].name === mofo[j].name) {
      //       mofo.splice(j, 1)
      //       removed++
      //       j--
      //     }
      //   }
      // }
      // console.log(`removed ${removed} duplicate elements!`)
      console.log('Start updating Course Files in Store')
      // 
      let ids = new Set(state.course.files.map((d: {name: string}) => d.name))
      let merged = [...state.course.files, ...data.filter( (d: {name: string}) => !ids.has(d.name) )]

      // console.log(merged)
      state.course.files = merged

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
     fetchCourse ({ commit, state, rootState}, name: String) {
      //can you return router function? //TODO direkt hier 
      return new Promise( (resolve, reject) => {
        commit('setBusy', true)

        //get course ID from name
        http.get(`courses/getCourseId?courseName=${name}`)
          .then( ({ data }) => {
            /* fetch course */
            http.get(`courses/${data.courseId}`)
            .then(({ data }) => {
              // console.log(data)
              commit('setCourse', data)
              resolve('Course loaded')
            })
            .catch( err => {
              /*
              * redirect off invalid course */
              console.error(err);
              reject(err)
            })
          })
          .catch( err => {
            console.log(err)
          })
          .finally( () => commit('setBusy', false))
        })
    },

    /**
     * Function fetchCourseList: get list of courses
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     */
    fetchCourseList({commit, state, rootState}) {
      commit('setBusy', true)
      http.get('courses?filter[include]=author')
        .then( ({data}) => {
          for(let courseObject of data) {
            const listData = { 
              category: courseObject.category, 
              name: courseObject.name, 
              needsEnrollment: courseObject.needsEnrollment, 
              courseId: courseObject.courseId 
            }
            state.courseList.some((e: { courseId: String }) => 
              e.courseId === listData.courseId)? '' : commit('appendToCourseList', listData)
          }
        })
        .catch(err => console.error(err))
        .finally( () => { commit('setBusy', false) })
    },

    /**
     * Function fetchEnrollment: fetch enrollment created at given date
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param courseId identifier for enrollment
     */
     fetchEnrollment({ commit, state, rootState }, courseId: String) {
      const self = this
      let uid = rootState.auth.userId
      let cid = courseId
      commit('setBusy', true)
      http.get('enrollments/findOne', { params: 
          { filter:
            { where: 
              { studentId: uid, courseId: cid } 
            }
          }
        })
        .then(({data}) => {
          console.log('Enrollment exists!')
          commit('setEnrollment', data)
        })
        .catch(err => {
          console.log('No enrollment found!')
          console.error(err)
        })
        .finally( () => { commit('setBusy', false) })
    },

    /**
     * Function storeCourse: persist changes to store in database
     * 
     * Author: core
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     * @returns Promise to save changes
     */
     storeCourse({ commit, state, rootState}) {
      let updated = Date.now()
      let cId = state.course.courseId
      let cContent = state.course.content

      return new Promise( (resolve, reject) => { 
        http.patch(`courses/${cId}`, {content: cContent, lastChanged: updated})
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
     * Function storeCourseFiles: persist list of course files 
     *  into database
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     * 
     * @param param0 state variables
     */
    storeCourseFiles({ state }) {
      const newFileData = {
        files: state.course.files,
        lastChanged: Date.now()
      }
      // console.log(newFileData)
      return new Promise( (resolve, reject) => {
        http.patch(`courses/${state.course.courseId}`, newFileData)
          .then( (resp) => {
            // console.log(resp)
            resolve(resp)
          })
          .catch( err => {
            console.error(err)
            reject(err)
          })
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
     * Function updateRenamedCourse: rename old course
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     * @returns Promise to update renamed course
     */
    updateRenamedCourse({ commit, state, rootState}) {   

      const newName = {
        lastChanged: Date.now(),
        name: state.course.name
      }

      return new Promise( (resolve, reject) => {
        http.patch(`courses/${state.course.courseId}`, newName)
          .then( () => {
            resolve('Updated Course name!')
          })
          .catch( (err) => {
            reject(err)
          })
      }) 
    }      
  }
}