/**
 * Filename: auth.ts
 * Use: organize authentication for users
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  axios,
 *  @/misc/roles.ts
 */

import http from 'axios'
import roles from '../../misc/roles'
import { v4 as uuidv4 } from 'uuid'

export default {
  state: {
    userId: 0,
    online: false,
    role: roles.STUDENT
  },
  getters: {

    /**
     * getter isAdmin: return true if user is in admin role
     *
     * Author: cmc
     *
     * Last Updated: November 6, 2021
     * @param state holds role string
     * @returns {boolean} true if user is admin
     */
    isAdmin (state: { role: string }) {
      return state.role === roles.ADMIN
    },

    /**
     * Function isAuthor: return true if user can create courses
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains role string
     * @returns true if role is author or admin
     */
    isAuthor (state: { role: string }) {
      return state.role === roles.AUTHOR || state.role === roles.EDITOR || state.role === roles.ADMIN
    },

    /**
     * getter isEditor: return true if user is in admin role
     *
     * Author: cmc
     *
     * Last Updated: April 19, 2022
     * @param state holds role string
     * @returns {boolean} true if user is admin
     */
    isEditor (state: { role: string }) {
      return state.role === roles.EDITOR
    },

    /**
     * getter userId: return userId
     * Author: cmc
     * Last Updated: June 20, 2021
     * @param state: state variables
     */
    userId (state: { userId: number }) {
      return state.userId
    }
  },
  mutations: {

    /**
     * Function setRole: set role of logged user
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains role string
     * @param role new role
     */
    setRole (state: { role: any }, role: any) {
      state.role = role
    },

    /**
     * Function login: log user into laya and place auth token in axios instance
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains online and userId
     * @param data response from post request to backend, contains token and userId
     */
    login (state: { online: boolean, userId: any }, { id, userId }: any) {
      state.online = true
      state.userId = userId
      // place token ID in axios for all future http requests
      http.defaults.headers.common.Authorization = id
    },

    /**
     * Function logout: log user out of laya, remove auth token
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains boolean online, userId, role string
     */
    logout (state: { online: boolean, userId: number, role: string }) {
      state.online = false
      state.userId = -1
      state.role = roles.STUDENT
      // remove auth token from axios
      delete http.defaults.headers.common.Authorization
    }
  },
  actions: {
    /**
     * checkEmailTaken: check if email is already taken by another user
     *
     * Author: cmc
     *
     * Last Updated: April 12, 2022
     * @param state store variables
     * @param email the email address to check
     */
    checkEmailTaken ({ state }, email: string) {
      return new Promise((resolve, reject) => {
        http.get(`accounts/email/${email}`)
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => { reject(err) })
      })
    },

    /**
     * function checkNameTaken: check if given string already exists as name
     *
     * Author: cmc
     *
     * Last Updated: April 12, 2022
     * @param state store variables
     * @param name name to check
     */
    checkNameTaken ({ state }, name: string) {
      return new Promise((resolve, reject) => {
        http.get(`accounts/name/${name}`)
          .then(({ data }) => { resolve(data) })
          .catch((err) => { reject(err) })
      })
    },

    /**
     * function createCourse: create storage and course in backend
     *
     * Author: cmc
     *
     * Last Updated: April 14, 2022
     * @param state state variables
     * @param data course properties
     */
    createCourse (state, data: {
      name: string,
      category: string,
      userId: number,
      enrollment?: boolean
    }) {
      const storageId = uuidv4()
      return new Promise((resolve, reject) => {
        /* create storage */
        http.post('storage', {
          name: storageId
        })
          .then(() => {
          /* storage created, create course */
            http.post('courses', {
              name: data.name,
              category: data.category,
              authorId: data.userId,
              storageId: storageId,
              properties: { enrollment: data.enrollment }
            })
              .then(() => {
                resolve('Course successfully created')
              })
              .catch((err) => {
                reject(new Error(err)) // error creating course
              })
          })
          .catch((err) => {
            reject(new Error(err)) // error creating storage
          })
      })
    },

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
       * fetchSingleEnrollment
       *
       * Author: pj
       *
       * Last updated: May 24, 2022
       * @param state
       */
    fetchSingleEnrollment ({ state }
    ) {
      return new Promise((resolve, reject) => {
        http
          .get(`enrollments/getAllByStudentId/?uid=${state.userId}`)
          .then(data => {
            resolve(data)
          })
          .catch(error => { reject(error) })
      })
    },

    /**
     * Function fetchRole: fetch role of logged user
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param data vuex state and commit handles
     */
    fetchRole ({ commit, state }) {
      http
        .get(`accounts/${state.userId}/role`)
        .then(({ data }) => commit('setRole', data.role))
        .catch((err) => console.error(err))
    },

    /**
     * function getBrowserLocale: return promise of 2-digit language code
     *
     * Author: cmc
     *
     * Last Updated: April 14, 2022
     * @param state state varaibles
     */
    getBrowserLocale (state) {
      return new Promise((resolve, reject) => {
        http.get('lang')
          .then(({ data }) => {
            resolve(data.substring(0, data.indexOf('-')))
          })
          .catch((err) => {
            reject(new Error(err))
          })
      })
    },

    /**
    * function registerUser: create new user
    *
    * Author: cmc
    *
    * Last Updated: April 12, 2022
    * @param state store variables
    * @param data user variables
      */
    registerUser ({ state }, data: {
      email: string,
      username: string,
      password: string,
      lang: string
    }) {
      return new Promise((resolve, reject) => {
        http.post('accounts/student', {
          email: data.email,
          username: data.username,
          password: data.password,
          lang: data.lang
        })
          .then(({ data }) => resolve(data))
          .catch(err => reject(err))
      })
    },

    /**
     * function sendCredentials: fire login request
     *
     * Author: cmc
     *
     * Last Updated: March 16, 2022
     * @param {state, commit, dispatch} any store variables
     * @param {object} data email, password
     */
    sendCredentials (
      { state, commit, dispatch },
      data: {
        email: string,
        password: string
      }
    ) {
      return new Promise((resolve, reject) => {
        http.post('accounts/login', {
          email: data.email,
          password: data.password
        })
          .then(({ data }) => {
            /* set login state */
            commit('login', data)

            /* load profile */
            dispatch('fetchProfile')
            dispatch('fetchRole')

            /* return data for local storage */

            resolve({
              id: data.id,
              userId: data.userId,
              created: data.created
            })
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
