/**
 * Filename: role.ts
 * Use: organize roles
 * Creator: cmc
 * Since: v1.3.0
 */

import http from 'axios'
import roles from '@/options/roles'

export default {
  state: {
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
      return state.role === roles.AUTHOR || state.role === roles.EDITOR || state.role === roles.ADMIN || state.role === roles.SUPERADMIN
    },

    /**
     * getter isEditor: return true if user is in editor role
     *
     * Author: cmc
     *
     * Last Updated: April 19, 2022
     * @param state holds role string
     * @returns {boolean} true if user is editor
     */
    isEditor (state: { role: string }) {
      return state.role === roles.EDITOR
    },

    /**
     * getter isSuperAdmin: return true if user is in super admin role
     *
     * Author: nv
     *Since: v1.3.0
     */
    isSuperAdmin (state: { role: string }) {
      return state.role === roles.SUPERADMIN
    }
  },

  mutations: {
    /**
     * Function roleSet: set role of logged user
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains role string
     * @param role new role
     */
    roleSet (state: { role: any }, role: string) {
      state.role = role
    }
  },

  actions: {
    /**
     * Function roleFetch: fetch role of logged user
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param data vuex state and commit handles
     */
    roleFetch ({ commit, getters }) {
      http
        .get(`accounts/${getters.userId}/role`)
        .then(({ data }) => commit('roleSet', data.role))
        .catch((err) => console.error(err))
    }
  }
}
