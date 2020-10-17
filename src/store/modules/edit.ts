import http from "axios";
import { ids as supportedLangs } from "../../misc/langs.js";

export default {
    state: {
        course: {},
        i18n: {},
        enrollment: {},
        userEnrolled: false
    },
    getters: {
        isUserEnrolled() {
            return true || false
        }
    },
    mutations: {
        setEnrollment(state, data) {
            state.enrollment = data
            state.userEnrolled = true
        },
        setCourse(state, data) {
            state.course = data
        }
        

    },
    actions: {
        fetchEnrollment({ commit, state, rootState }, name: String) {
            console.log("Getting Enrollment status...")
            const self = this
            let uid = rootState.auth.userId
            let cid = name
            console.log(cid)
            // const params = http.paramsSerializer({filter:{where: {studentId: uid, courseId: self.course.name}}})
            // console.log(params)
            http.get("enrollments/findOne", {params: {filter:{where: {studentId: uid, courseId: cid}}}})
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
          updateEnrollment({ commit, state, rootState }, ) {
            const enrol = state.enrollment
      
            http.patch(`enrollments/${enrol.id}`, enrol)
                .then(resp => {
                  console.log("Enrollment updated!")
                })
                .catch(err => {
                  console.error(err)
                })
          },

          fetchCourse ({ commit, state, rootState}, name) {
            console.log("FETCHING COURSE")
            commit("setBusy", true);
            /*
            * fetch course */
            http.get(`courses/${name}`)
              .then(({ data }) => {
                console.log(data)
                commit("setCourse", data)
              })
              .catch(err => {
                /*
                * redirect off invalid course */
                console.error(err);
                this.$router.push("/courses");
              })
              .then(() => commit("setBusy", false));
          }
        
    }
}