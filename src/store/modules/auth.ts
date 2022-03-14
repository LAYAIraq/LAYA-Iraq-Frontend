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
      return state.role === roles.AUTHOR || state.role === roles.ADMIN
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
     * function resetOwnPassword: fire request to change password
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @param state not used, but neccessary in signature
     * @param data contains userId, verificationToken, password
     */
    resetOwnPassword ({ state }, data: {
      userId: string,
      verificationToken: string,
      password: string
    }) {
      return new Promise((resolve, reject) => {
        http.post('/accounts/set-pwd/', data
        )
          .then(() => resolve(null))
          .catch(err => reject(err))
      })
    }
  }
}
