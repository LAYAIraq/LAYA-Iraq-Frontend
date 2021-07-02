/**
 * Filename: flags.ts
 * Use: Handle flags for courses in vuex
 * Creator: cmc
 * Date: July 2, 2021
 * Dependecies:
 *  axios
 */

import http from 'axios'
export default {
  state: {
    courseFlags: [],
    flagsToAdd: []
  },

  getters: {
    courseFlags(state: { courseFlags: Array<object> }) {
      return state.courseFlags
    }
  },

  mutations: {
    appendFlag(state, flag) {
      state.courseFlags.push(flag)
    }
  },

  actions: {
    getCourseFlags({commit}, cid: String) {
      http.get('flags', {
        params: {
          filter: { where: { courseId: cid }}
        }
      })
        .then(resp => {
          resp.data.forEach(elem => {
            commit('addFlag', elem)
          })
        })
        .catch(err => console.error(err))
    }
  }
}