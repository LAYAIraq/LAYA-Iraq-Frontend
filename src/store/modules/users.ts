/**
 * Filename: users.ts
 * Use: user management for admin and editors
 * Creator: cmc
 * Since: v1.2.0
 */

import http from 'axios'
export default {
  state: {
    users: []
  },
  getters: {
    users: (state: { users: object[] }) => state.users
  },
  mutations: {
    /**
     * userAdd: add single User
     *
     * Author: cmc
     *
     * Last Updated: November 11, 2021
     * @param state state variables
     * @param user user variables
     */
    userAdd (
      state: { users: Array<object> },
      user: object
    ) {
      state.users.push(user)
    },

    /**
     * function userEmailChange: change user's email in state
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param user reference to user in state
     * @param role new email
     */
    userEmailChange (
      state,
      { user, email }: {
        user: {
          email: string
        },
        email: string
      }) {
      user.email = email
    },

    /**
     * function userRoleChange: change user's role in state
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state state variables
     * @param user reference to user in state
     * @param role new role
     */
    userRoleChange (
      state,
      { user, role }: {
        user: {
          role: string
        },
        role: string
      }) {
      user.role = role
    },

    /**
     * function userRemove: remove user id from state.users
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state state variables
     * @param id user id to delete
     */
    userRemove (
      state: {
        users: Array<{
          id: number
        }>
      },
      id: number
    ) {
      const idx = state.users.findIndex(el => el.id === id)
      if (idx !== -1) { // element with id exists
        state.users.splice(idx, 1)
      }
    }
  },
  actions: {
    /**
     * function userUpdateEmail: change user's email
     *
     * Author: cmc
     *
     * Last Updated: February 5, 2022
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     * @param {string} email new email address
     */
    userUpdateEmail (
      { commit, state }: {
        commit: Function,
        state: {
          users: Array<{
            id: number
          }>
        }
      },
      { id, email }: {
        id: number,
        email: string
      }) {
      const user = state.users.find(el => el.id === id)
      if (user) {
        commit('userEmailChange', { user, email })
        http.patch(
          `accounts/${id}`,
          { email: email }
        )
          // .then(() => console.log('user email changed!'))
          .catch(err => console.error(err))
      }
    },

    /**
     * function userUpdateRole: change user's role
     *
     * Author: cmc
     *
     * Last Updated: March 15, 2022
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     * @param {string} role new role
     */
    userUpdateRole (
      { commit, state }: {
        commit: Function,
        state: {
          users: Array<{
            id: number
          }>
        }
      },
      { id, role }: {
        id: number,
        role: string
      }) {
      const user = state.users.find(el => el.id === id)
      if (user) {
        commit('userRoleChange', { user, role })
        http.post(
          'accounts/change-role', // TODO: change to patch in new backend
          {
            role: role,
            userId: id
          }
        )
          .then(() => console.log('user role changed!'))
          .catch(err => console.error(err))
      }
    },

    /**
     * function userCreate: check for duplicate name or email, if none,
     * create new user, then update store
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state store variables
     * @param commit commit function
     * @param username new user's name
     * @param email new user's email
     * @param role new user's role
     */
    userCreate (
      { commit }: {
        commit: Function,
      },
      { username, email, role }: {
        username: string,
        email: string,
        role: string
      }) {
      http.post('accounts/create', {
        username: username,
        email: email,
        role: role
      })
        .then(resp => {
          // console.log(resp)
          commit('userAdd', {
            ...resp.data,
            role: role
          })
        })
        .catch(err => console.error(err))
    },

    /**
     * function userDelete: delete user from database, then update
     *  store
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state store variables
     * @param commit commit function
     * @param id userId to delete
     */
    userDelete (
      { state, commit }: {
        state: {
          users: Array<{
            id: number
          }>
        },
        commit: Function
      },
      id: number
    ) {
      const user = state.users.find(el => el.id === id)
      if (user) {
        http.delete(`accounts/${id}/full`)
          .then(() => {
            // console.log(resp)
            // console.log('deleted user: ', id)
            commit('userRemove', id)
          })
          .catch(err => console.error(err))
      }
    },

    /**
     * function userListFetch: get Users from Backend
     *
     * Author cmc
     *
     * Last Updated: November 11, 2021
     * @param commit commit function
     * @param state state variables
     */
    userListFetch (
      { commit }: {commit: Function}
    ) {
      http.get('/accounts')
        .then(resp => {
          for (const entry of resp.data) {
            // console.log(entry)
            const user = { ...entry }
            http.get(`accounts/${entry.id}/role`)
              .then(resp => {
                // console.log(resp.data.role)
                user.role = resp.data.role
                commit('userAdd', user)
              })
              .catch(err => console.error(err))
            // console.log('new user ', user)
          }
        })
        .catch(err => console.error(err))
    },

    /**
     * function passwordResetAdmin: reset user's password
     *   name follows same scheme as dispatch 'passwordReset' in password.ts
     *
     * Author: cmc
     *
     * Last Updated: January 13, 2022
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     */
    passwordResetAdmin (
      { commit, state }: {
        commit: Function,
        state: {
          users: Array<{
            id: string
          }>
        }
      },
      id: string
    ) {
      if (state.users.some(x => x.id === id)) {
        // console.log('changing ', id, 's password')
        http.post(`accounts/pwd-reset/${id}`)
          .catch(err => console.error(err))
      }
      // else statement omitted b/c only called for existing ids
    }
  }
}
