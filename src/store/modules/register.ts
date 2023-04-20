/**
 * Filename: register.ts
 * Use: organize registration for users
 * Creator: cmc
 * Since: v1.3.0
 */

import http from 'axios'

export default {
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
     * function checkNameTaken: check if given string already exists as username
     *
     * Author: cmc
     *
     * Last Updated: April 12, 2022
     * @param state store variables
     * @param username username to check
     */
    checkNameTaken ({ state }, username: string) {
      return new Promise((resolve, reject) => {
        http.get(`accounts/name/${username}`)
          .then(({ data }) => { resolve(data) })
          .catch((err) => { reject(err) })
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
          language: data.lang
        })
          .then(({ data }) => resolve(data))
          .catch(err => reject(err))
      })
    }
  }
}
