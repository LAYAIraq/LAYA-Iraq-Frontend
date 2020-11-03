import http from "axios"
import router from "../../router.js"
import { ids as supportedLangs } from "../../misc/langs.js"

export default {
    state: {
        course: {},
        enrollment: {},
        userEnrolled: false
    },
    getters: {
        isUserEnrolled (state: { userEnrolled: Boolean}) {
          return state.userEnrolled
        },
        hasContent(state: { course: { content: Object } } ) {
          return state.course.content
        },
        hasCourse(state: { course: Object } ) {
          return state.course
        }
    },
    mutations: {
      appendContent ( state, data:{ name: String, nextStep, input: Object} ) {
        console.log("adding: ", data)
        state.course.content.push(data)
      },
      delContent( state, step ) {
        let cnt = state.course.content
        console.log(cnt)
        state.course.content.splice(step, 1)
        console.log(cnt)
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
      updateStep( state , { step, updatedStep } ) {
        state.course.content[step] = {
          ...state.course.content[step], ...updatedStep
        }
        console.log(`New Step #${step}`, state.course.content[step])
      }

    },
    actions: {
      fetchEnrollment({ commit, state, rootState }, createdDate: String) {
        console.log("Getting Enrollment status...")
        const self = this
        let uid = rootState.auth.userId
        let cid = createdDate
        console.log(cid)
        // const params = http.paramsSerializer({filter:{where: {studentId: uid, courseId: self.course.name}}})
        // console.log(params)
        http.get("enrollments/findOne", {params: {filter:{where: {studentId: uid, createDate: cid}}}})
            .then(({data}) => {
              console.log("Enrollment exists!")
              console.log(data)
              commit("setEnrollment", data)
            })
            .catch(err => {
              console.log('No enrollment found!')
              console.error(err)
            })
      },

      updateEnrollment({ commit, state, rootState } ) {
        const enrol = state.enrollment
  
        http.patch(`enrollments/${enrol.id}`, enrol)
            .then(resp => {
              console.log("Enrollment updated!")
            })
            .catch(err => {
              console.error(err)
            })
      },

      fetchCourse ({ commit, state, rootState}, name: String) {
        //can you return router function? //TODO direkt hier 
        return new Promise((resolve, reject) => {
          // console.log("FETCHING COURSE")
          commit("setBusy", true);
          /*
          * fetch course */
          http.get(`courses/${name}`)
            .then(({ data }) => {
              console.log(data)
              commit("setCourse", data)
              resolve("Course loaded")
            })
            .catch(err => {
              /*
              * redirect off invalid course */
              console.error(err);
              reject(err)
            })
            .finally(() => commit("setBusy", false));
          })
        
      },

      storeCourse({ commit, state, rootState}) {
        let updated = Date.now()
        let cName = state.course.name
        let cContent = state.course.content

        return new Promise( (resolve, reject) => { 
          http.patch(`courses/${cName}`, {content: cContent, lastChanged: updated})
            .catch(err => {
              console.error("Failed storing course content:", err)
              reject(err)
            })
            .finally(()  => {
              resolve("Course updated successfully")
            })
          })
        
      },

      updateRenamedCourse( { commit, state, rootState}, oldName: String ) {
        
        http.delete(`courses/${oldName}`)
            .then(function() {
            let renamed_course = state.course
            http.post(`courses`, renamed_course)
                .catch(err => {
                  console.error("Failed course rename:", err)
                  return false
                })
                .finally(() => {
                  return true
                })
            })
            .catch(function() {
            })
        
      },

      fetchTranslation() {

      }
      
  }
}