import http from 'axios'
import router from '../../router.js'
import { ids as supportedLangs } from '../../misc/langs.js'

export default {
  state: {
    course: {},
    courseList: [],
    enrollment: {},
    userEnrolled: false
  },

  getters: {
    isUserEnrolled (state: { userEnrolled: Boolean }) {
      return state.userEnrolled
    },
    content(state: { course: { content: Object } } ) {
      return state.course.content
    },
    course(state: { course: Object } ) {
      return state.course
    },
    courseFiles(state: { course: { files: Array<Object> } }) {
      return state.course.files
    },
    courseList(state: { courseList: Array<Object>}) {
      return state.courseList
    },
    courseStorage(state: { course: { storageId: String } }) {
      return state.course.storageId
    }
  },

  mutations: {
    appendContent ( 
      state: {course: {content: Array<Object>}}, 
      data:{ name: String, nextStep: any, input: Object} 
      ) {
      state.course.content.push(data)
    },
    appendToCourseList(state: {courseList: Array<Object>}, data: Object){
      state.courseList.push(data)
    },
    delContent( state: {course: {content: Array<Object>}}, step: number ) {
      state.course.content.splice(step, 1)
    },
    renameCourse( state: {course: {name: String}}, newName: String) {
      state.course.name = newName
    },
    setEnrollment(state: {enrollment: Object, userEnrolled: Boolean }, data: Object) {
      state.enrollment = data
      state.userEnrolled = true
    },
    setCourse(state: { course: Object}, data: Object) {
      state.course = data
    },
    setCourseList(state: { courseList: Array<Object>}, data: Array<Object>) {
      state.courseList = data
    },
    updateCourseFiles(state: {course: {files: Array<Object>}}, data: Array<Object>) {
      state.course.files = [...state.course.files, ...data]
      /** 
       * TODO: 
       * find duplicates (filename, type, size)
       * remove files that are no longer in the list
       * 
       */
    },
    updateCourseNav( state: {course: {content: Array<Object>}}, data: Array<Object>) {
      state.course.content = data
    },
    updateStep( state: {course: {content: Array<Object>}} , data: { step: number, updatedStep: Object } ) {
      state.course.content[data.step] = {
        ...state.course.content[data.step], ...data.updatedStep
      }
    }
  },

  actions: {
    fetchEnrollment({ commit, state, rootState }, courseId: String) {
      const self = this
      let uid = rootState.auth.userId
      let cid = courseId
      commit('setBusy', true)
      http.get('enrollments/findOne', {params: {filter:{where: {studentId: uid, courseId: cid}}}})
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
        .finally( () => {commit('setBusy', false)})
    },

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

    async fetchCourse ({ commit, state, rootState}, name: String) {
      //can you return router function? //TODO direkt hier 
      return new Promise((resolve, reject) => {
        commit('setBusy', true)

        //get course ID
        http.get(`courses/getCourseId?courseName=${name}`)
          .then( ({data}) => {
            /* fetch course */
            http.get(`courses/${data.courseId}`)
            .then(({ data }) => {
              // console.log(data)
              commit('setCourse', data)
              resolve('Course loaded')
            })
            .catch(err => {
              /*
              * redirect off invalid course */
              console.error(err);
              reject(err)
            })
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => commit('setBusy', false))
        })
    },

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

    updateRenamedCourse( { commit, state, rootState}, oldId: String ) {   
      http.patch(`courses/${oldId}`, state.course)
        .then( () => {
          console.log('Updated Course name!')
        })
        .catch( (err) => {
          console.error(err)
        })
    }      
  }
}