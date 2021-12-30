/**
 * Filename: users.ts
 * Use: user management for admin and editors
 * Creator: cmc
 * Date: November 11, 2021
 * Dependencies:
 *  axios,
 *  @/misc/roles.ts
 */

import http from 'axios'
export default {
  state: {
    users: []
  },
  getters: {
    users(state: {users: Array<object>}) {
      return state.users
    }
  },
  mutations: {
    /**
     * addUser: add single User
     *
     * Author: cmc
     *
     * Last Updated: November 11, 2021
     * @param state state variables
     * @param user user variables
     */
    addUser(state: { users: Array<object>}, user: object) {
      state.users.push(user)
    },

    /**
     * function changeUserEmail: change user's email in state
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state state variables
     * @param user reference to user in state
     * @param role new email
     */
    changeUserEmail(state, { user, email }) {
      user.email = email
    },

    /**
     * function changeUserRole: change user's role in state
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state state variables
     * @param user reference to user in state
     * @param role new role
     */
    changeUserRole(state, { user, role }) {
      user.role = role
    },

    /**
     * function removeUser: remove user id from state.users
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state state variables
     * @param id user id to delete
     */
    removeUser(state: {users: Array<{ id: number}>}, id: number) {
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i].id === id) {
          state.users.splice(i, 1)
          break
        }
      }
    },

    /**
     * function setUsersList: set list of users in state
     *
     * Author: cmc
     *
     * Last Updated: November 11, 2021
     * @param state state variables
     * @param list list of users
     */
    setUsersList(state: { users: Array<object> }, list) {
      state.users = list
    }
  },
  actions: {
    /**
     * function changeEmail: change user's email
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     * @param {string} email new email address
     */
    changeEmail({ commit, state }, { id, email }) {
      for (const user of state.users) {
        if (user.id === id) {
          // console.log(email)
          commit('changeUserEmail', { user, email })
          http.patch(`accounts/${id}`, { email: email })
            .then(() => console.log('user role changed!'))
            .catch(err => console.error(err))
          break
        }
      }
    },

    /**
     * function changeRole: change user's role
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     * @param {string} role new role
     */
    changeRole({ commit, state }, { id, role }) {
      for (const user of state.users) {
        if (user.id === id) {
          // console.log(role)
          commit('changeUserRole', { user, role })
          http.post('accounts/change-role', {
            userId: id,role: role
          })
          .then(() => console.log('user role changed!'))
          .catch(err => console.error(err))
          break
        }
      }
    },

    /**
     * function createUser: create new user, then update
     *  store
     *
     * Author: cmc
     *
     * Last Updated: November 23, 2021
     * @param state store variables
     * @param commit commit function
     * @param username new user's name
     * @param email new user's email
     * @param role new user's role
     */
    createUser({state, commit}, {username, email, role}) {
      http.post(`accounts/create`, {
        username: username,
        email: email,
        role: role
      })
        .then(resp => {
          console.log(resp)
          commit('addUser', {
            ...resp.data,
            role: role
          })
        })
        .catch(err => console.error(err))
    },


    /**
     * function deleteUser: delete user from database, then update
     *  store
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param state store variables
     * @param commit commit function
     * @param id userId to delete
     */
    deleteUser({state, commit}, id) {
      for (const user of state.users) {
        if (user.id === id) {
          http.delete(`accounts/${id}`)
            .then(resp => {
              console.log(resp)
              console.log('deleted user: ', id)
              commit('removeUser', id)
            })
            .catch(err => console.error(err))
          break
        }
      }
    },

    /**
     * function fetchUserList: get Users from Backend
     *
     * Author cmc
     *
     * Last Updated: November 11, 2021
     * @param commit commit function
     * @param state state variables
     */
    fetchUserList({commit, state}){
      http.get('/accounts')
        .then(resp => {
          // commit('setUsersList', resp.data)
          for (const entry of resp.data) {
            // console.log(entry)
            const user = {...entry}
            http.get(`accounts/${entry.id}/role`)
              .then(resp => {
                // console.log(resp.data.role)
                user.role = resp.data.role
                commit('addUser', user)
              })
            // console.log('new user ', user)

          }
        })
        .catch(err => console.error(err))
    },

    /**
     * function fetchUserList: get Users from Backend
     *
     * Author cmc
     *
     * Last Updated: November 11, 2021
     * @param commit commit function
     * @param state state variables
     */
    // this is an approach that uses two "big" requests rather than
    // one big and many small - we might need to switch depending on
    // the performance with the initial setup of the live system
    // fetchUserList({commit, state}){
    //   let users = []
    //   let roles = []
    //   http.get('/accounts')
    //     .then(resp => {
    //       console.log('resp get/accounts: ', resp)
    //       users = [...resp.data]
    //       http.get('/RoleMappings')
    //         .then(resp => {
    //           console.log('resp get/RoleMappings: ', resp)
    //           roles = [...resp.data]
    //           const rolePrototypes = roles.filter(el => el.principalType === 'ROLE')
    //           console.log(users)
    //           console.log(roles)
    //           console.log(rolePrototypes)
    //           for (const entry of users) {
    //             // console.log(entry)
    //             const userRole = roles.filter(elem => elem.principalId == entry.id)[0].roleId
    //             console.log(userRole)
    //             // [0].roleId
    //             const user = {
    //               username: entry.username,
    //               email: entry.email,
    //               emailVerified: entry.emailVerified,
    //               id: entry.id,
    //               role: rolePrototypes.filter(elem => elem.roleId === userRole)[0].principalId
    //             }
    //             console.log(user)
    //             commit('addUser', user)
    //           }
    //         })
    //         .catch(err => console.error(err))
    //     })
    //     .catch(err => console.error(err))
    //
    //
    //   // console.log('new user ', user)
    // },

    /**
     * function resetPassword: reset user's password
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param commit commit function
     * @param state state variables
     * @param {number} id user Id
     */
    resetPassword({ commit, state }, id) {
      for (const user of state.users) {
        if (user.id === id) {
          console.log('changing ', id, 's password')
          // http.patch(`accounts/${id}`, user) // TODO: create backend method for resetting password
          //   .then(() => console.log('user role changed!'))
          //   .catch(err => console.error(err))
          break
        }
      }
    },
  }
}