import http from 'axios'

/**
 * Filename: enrollment.ts
 * Use: organize enrollment for users
 * Creator: cmc
 * Date: September 8, 2022
 * Dependencies:
 *   axios
 */

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
     * addFeedback: Add new Feedback to feedback object or update existing feedback
     *
     * Author: cmc
     *
     * Last Updated: September 8, 2022
     *
     * @param state contains feedback
     * @param feedbackData contains feedbackData to be stored in feedback
     */
    addFeedback (
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
      state.enrollment.feedback[id] = (({ id, ...o }) => o)(feedbackData)
    },

    /**
     * Function setEnrollment: set an enrollment for current user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains enrollment, userEnrolled
     * @param enrollmentData enrollment object
     */
    setEnrollment (
      state: {
        enrollment: object,
        userEnrolled: boolean
      },
      enrollmentData: object
    ) {
      state.enrollment = enrollmentData
      state.userEnrolled = true
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
    createAuthorEnrollment (state, data: {
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
     * createEnrollment
     *
     * Author: cmc
     *
     * Last updated: September 8, 2022
     * @param state
     * @param data
     */
    createEnrollment ({ state },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        http.post('enrollments/create', data)
          .then(resp => resolve(resp.data.enrol.courseId))
          .catch(err => reject(err))
      })
    },

    /**
     * Function fetchEnrollment: fetch user's enrollment associated with courseId
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     * @param courseId identifier for enrollment
     */
    fetchEnrollment (
      { commit, rootState },
      courseId: string
    ) {
      const studentId = rootState.auth.userId
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
              commit('setEnrollment', data)
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
     * fetchUserEnrollments
     *
     * Author: cmc
     *
     * Last updated: September 10, 2022
     * @param state
     */
    fetchUserEnrollments ({ rootState }) {
      return new Promise((resolve, reject) => {
        http
          .get(`enrollments/getAllByStudentId/?uid=${rootState.auth.userId}`)
          .then(data => {
            resolve(data)
          })
          .catch(error => reject(error))
      })
    },

    /**
     * function updateEnrollment: update enrollment object
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     */
    updateEnrollment ({ state }) {
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
     * function fetchEnrollmentData: fetches enrollment data including feedback
     *
     * Author: nv
     *
     * Last Updated: October 12, 2022
     *
     * @param state state variables
     * @param data courseId
     */
    fetchEnrollmentData (state, data: {
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
    }
  }
}
