/**
 * Filename: password.ts
 * Use: handle password related requests
 * Creator: cmc
 * Since: v1.1.0
 */

import http from 'axios'
export default {
  state:
    {
      password: '', // necessary for password component
      passwordRepeat: ''
    },
  getters: {
    password: (state: { password: string }) => state.password,
    passwordRepeat: (state: { passwordRepeat: string }) => state.passwordRepeat
  },
  mutations: {
    /**
     * function passwordSet: set password to input string
     *  exists to avoid passing props to deep nested component
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2022
     * @param state contains password string
     * @param input new string to set
     */
    passwordSet (
      state: { password: string },
      input: string
    ) {
      state.password = input
    },

    /**
     * function passwordRepeatSet: set passwordRepeat to input string
     *  exists to avoid passing props to deep nested component
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2022
     * @param state contains passwordRepeat string
     * @param input new string to set
     */
    passwordRepeatSet (
      state: { passwordRepeat: string},
      input: string
    ) {
      state.passwordRepeat = input
    }
  },
  actions: {
    /**
     * function passwordReset: fire reset password request when
     *  email for user exists
     *
     * Author: cmc
     *
     * Last Updated: March 16, 2022
     * @param state store variable
     * @param {string} email user emails
     */
    passwordReset (
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
    },

    /**
     * function passwordSetNew: fire request to change password
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @param state not used, but neccessary in signature
     * @param data contains userId, verificationToken, password
     */
    passwordSetNew ({ state }, data: {
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
     * function passwordUpdate: fire change-password request
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2021
     * @param state contains password
     * @param {string} oldPwd old password for user
     */
    passwordUpdate ({ state }, oldPwd: string) {
      if (state.password !== state.passwordRepeat) {
        return Promise.reject(new Error('passwords don\'t match!'))
      } else {
        return new Promise((resolve, reject) => {
          http
            .post('accounts/change-password', {
              oldPassword: oldPwd,
              newPassword: state.password
            })
            .then(() => {
              resolve(null)
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    }
  }
}
