/**
 * Filename: password.ts
 * Use: handle password related requests
 * Creator: cmc
 * Date: March 18, 2022
 * Dependencies: axios
 */

import http from 'axios'
export default {
  state:
    {
      passwordSet: '', // necessary for password component
      passwordRepeat: ''
    },
  getters: {

    /**
     * Function passwordRepeat: return passwordRepeat
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2022
     *
     * @param0 contains passwordRepeat string
     * @returns password to set
     */
    passwordRepeat (state: { passwordRepeat: string }) {
      return state.passwordRepeat
    },

    /**
     * Function passwordSet: return passwordSet
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     *
     * @param0 contains passwordSet string
     * @returns password to set
     */
    passwordSet (state: { passwordSet: string }) {
      return state.passwordSet
    }
  },
  mutations: {
    /**
     * function setPwd: set passwordSet to input string
     *  exists to avoid passing props to deep nested component
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2022
     * @param state contains passwordSet string
     * @param input new string to set
     */
    setPwd (
      state: { passwordSet: string },
      input: string
    ) {
      state.passwordSet = input
    },

    /**
     * function setPwdRepeat: set passwordRepeat to input string
     *  exists to avoid passing props to deep nested component
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2022
     * @param state contains passwordRepeat string
     * @param input new string to set
     */
    setPwdRepeat (
      state: { passwordRepeat: string},
      input: string
    ) {
      state.passwordRepeat = input
    }
  },
  actions: {
    /**
     * function changePassword: fire change-password request
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2021
     * @param state contains passwordSet
     * @param {string} oldPwd old password for user
     */
    changePassword ({ state }, oldPwd: string) {
      if (state.passwordSet !== state.passwordRepeat) {
        return Promise.reject(new Error('passwords don\'t match!'))
      } else {
        return new Promise((resolve, reject) => {
          http
            .post('accounts/change-password', {
              oldPassword: oldPwd,
              newPassword: state.passwordSet
            })
            .then(() => {
              resolve(null)
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    },

    /**
     * function resetPassword: fire request to change password
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @param state not used, but neccessary in signature
     * @param data contains userId, verificationToken, password
     */
    resetPassword ({ state }, data: {
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
    },

    /**
     * function resetUserPassword: fire reset password request when
     *  email for user exists
     *
     * Author: cmc
     *
     * Last Updated: March 16, 2022
     * @param state store variable
     * @param {string} email user emails
     */
    resetUserPassword (
      { state },
      email: string
    ) {
      return new Promise((resolve, reject) => {
        http.get(`accounts/email/${email}`)
          .then(({ data }) => {
            http.post(`accounts/pwd-reset/${data}`)
              .then(() => resolve(null))
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      })
    }
  }
}
