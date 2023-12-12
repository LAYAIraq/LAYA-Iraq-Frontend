/**
 * Filename: enrollment.ts
 * Use: organize enrollment for users
 * Creator: cmc
 * Since: v1.1.0
 */
import http from 'axios'
import { stripKey } from '@/mixins/general/helpers'

export default {
  state: {
    enrollment: {
      feedback: {}
    },
    userEnrolled: false
  },

  getters: {
    /** Function enrollment: returns enrollment object
     *
     * Created by: cmc
     *
     * Last Updated: September 8, 2022
     */
    enrollment (state: { enrollment: object }) {
      return state.enrollment
    },

    /**
     * Function enrollmentFeedback: returns the current feedback
     *
     * Author: cmc
     *
     * Last Updated: September 8, 2022
     * @param state contains feedback object
     * @returns feedback object
     */
    enrollmentFeedback (
      state: {
        enrollment: {
          feedback: object
        }
      }) {
      return state.enrollment.feedback
    },

    /**
     * Function userEnrolled: returns if user is enrolled
     *
     * Author: cmc
     *
     * Last Updated: September 8, 2022
     *
     * @param state contains userEnrolled boolean
     * @returns true if user is enrolled
     */
    userEnrolled (state: { userEnrolled: boolean }) {
      return state.userEnrolled
    }
  },

  mutations: {
    /**
     * Function enrollmentSet: set an enrollment for current user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains enrollment, userEnrolled
     * @param enrollmentData enrollment object
     */
    enrollmentSet (
      state: {
        enrollment: object,
        userEnrolled: boolean
      },
      enrollmentData: object
    ) {
      state.enrollment = enrollmentData
      state.userEnrolled = true
    },
    /**
     * feedbackAdd: Add new Feedback to feedback object or update existing feedback
     *
     * Author: cmc
     *
     * Last Updated: September 8, 2022
     *
     * @param state contains feedback
     * @param feedbackData contains feedbackData to be stored in feedback
     */
    feedbackAdd (
      state: {
        enrollment: {
          feedback: object
        }
      },
      feedbackData: {
        created: number,
        choice: number[],
        freetext: string,
        rating: number,
        id: string
        // options: object
      }
    ) {
      const { id } = feedbackData
      // if enrollment has feedback as array, reset to object
      if (Array.isArray(state.enrollment.feedback)) {
        state.enrollment.feedback = {}
      }
      state.enrollment.feedback[id] = stripKey('id', feedbackData)
    }
  },

  actions: {
    /**
     * function createAuthorEnrollment: create enrollment for course author
     *
     * Author: cmc
     *
     * Last Updated: April 14, 2022
     * @param state state variables
     * @param data course name, user ID
     */
    createAuthorEnrollment (state, data: { // TODO: move to back end
      courseName: string,
      userId: number
    }) {
      return new Promise((resolve, reject) => {
        http.get(`courses/getCourseId?courseName=${data.courseName}`)
          .then(resp => {
            http
              .post('enrollments', {
                courseId: resp.data.courseId,
                studentId: data.userId
              })
              .then(() => resolve('author enrollment created'))
              .catch(err => reject(new Error(err)))
          })
          .catch(err => reject(new Error(err)))
      })
    },

    /**
     * enrollmentCreate
     *
     * Author: cmc
     *
     * Last updated: September 8, 2022
     * @param state
     * @param data
     */
    enrollmentCreate ({ state },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        http.post('enrollments/create', data)
          .then(resp => resolve(resp.data.enrol.courseId))
          .catch(err => reject(err))
      })
    },

    /**
     * Function enrollmentFetch: fetch user's enrollment associated with courseId
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     * @param courseId identifier for enrollment
     */
    enrollmentFetch (
      { commit, rootState },
      courseId: string
    ) {
      const studentId = rootState.authentication.userId
      if (studentId && courseId) {
        commit('setBusy', true)
        return new Promise((resolve, reject) => {
          http.get('enrollments/findOne', {
            params: {
              filter: {
                where: {
                  studentId,
                  courseId
                }
              }
            }
          })
            .then(({ data }) => {
              // console.log('Enrollment exists!')
              commit('enrollmentSet', data)
              resolve('Enrollment exists!')
            })
            .catch(err => reject(err))
            .finally(() => commit('setBusy', false))
        })
      } else {
        commit('setBusy', false)
        return Promise.reject(new Error('No user or course id provided!'))
      }
    },

    /**
     * function enrollmentsCourseFetch: fetches enrollment data including feedback
     *
     * Author: nv
     *
     * Last Updated: October 12, 2022
     *
     * @param state state variables
     * @param data courseId
     */
    enrollmentsCourseFetch (state, data: {
      courseId: string
    }) {
      return new Promise((resolve, reject) => {
        http
          .get(`enrollments/getAllByCourseId?courseId=${data.courseId}`)
          .then(resp => {
            resolve(resp.data.subs)
          })
          .catch(error => reject(error))
      })
    },

    /**
     * enrollmentsUserFetch
     *
     * Author: cmc
     *
     * Last updated: September 10, 2022
     * @param state
     */
    enrollmentsUserFetch ({ rootState }) {
      return new Promise((resolve, reject) => {
        http
          .get(`enrollments/getAllByStudentId/?uid=${rootState.authentication.userId}`)
          .then(data => {
            resolve(data)
          })
          .catch(error => reject(error))
      })
    },

    /**
     * function enrollmentUpdate: update enrollment object
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     */
    enrollmentUpdate ({ state }) {
      const enrol = state.enrollment
      return enrol
        ? new Promise((resolve, reject) => {
          http.patch(
            `enrollments/${enrol.id}`,
            enrol
          )
            .then(() => resolve('Enrollment updated!'))
            .catch(err => reject(err))
        })
        : Promise.reject(new Error('No enrollment found!'))
    },

    /**
     */
    getCourseEnrollments (
      { commit, rootState },
      courseId: string
    ) {
      return new Promise((resolve, reject) => {
        http.get(`enrollments/getAllByCourseId?courseId=${courseId}`)
          .then(({ data }) => {
            console.log('Enrollment exists!')
            resolve(data)
          })
          .catch(err => reject(err))
          .finally(() => commit('setBusy', false))
      }
      )
    }
  }
}
