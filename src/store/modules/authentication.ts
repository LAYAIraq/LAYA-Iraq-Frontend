/**
 * Filename: authentication.ts
 * Use: organize authentication for users
 * Creator: core
 * Since: v1.0.0
 */

import http from 'axios'

export default {
  state: {
    userId: 0,
    online: false
  },
  getters: {
    /**
     * getter userId: return userId
     * Author: cmc
     * Last Updated: June 20, 2021
     * @param state: state variables
     */
    userId (state: { userId: number }) {
      return state.userId
    },
    /**
     * getter userOnline: return true if user is logged in
     * Author: cmc
     * Since: v1.3.0
     */
    userOnline: (state: { online: boolean }) => state.online
  },
  mutations: {
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
    login (state: { online: boolean, userId: any }, { id, userId }) {
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
     * @param commit commit function to call roleSet mutation
     */
    logout (state: {
      online: boolean,
      userId: number
    }) {
      state.online = false
      state.userId = -1
      // remove auth token from axios
      delete http.defaults.headers.common.Authorization
    }
  },
  actions: {
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
            dispatch('profileFetch')
            dispatch('roleFetch')

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
