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
    },
    appendFlagAnswer(state, data: { id: string, answer: Object }) {
      let arr = state.courseFlags.filter(flag => flag.referenceId === data.id);
      console.log(arr)
      arr[0].answers.push(data.answer)
      console.log(state.courseFlags)
    },
    clearFlagList(state: {courseFlags: Array<Object>}) {
      state.courseFlags = []
    }
  },

  actions: {
    getCourseFlags({commit}, cid: String) {
      commit('clearFlagList')
      console.log('getting elements for courseId: ', cid)
      http.get('flags', {
        params: {
          filter: { where: { courseId: cid }}
        }
      })
        .then(resp => {
          if (resp.data.length === 0) console.log('None found!')
          resp.data.forEach(elem => {
            // console.log(elem)
            console.log('Adding ' + elem.referenceId + 'to flag list')
            commit('appendFlag', elem)
          })
        })
        .catch(err => console.error(err))
    },

    saveFlags({commit, state}) {
      const reqs = []
      state.courseFlags.forEach(flag => {
        reqs.push(
          http.patch('flags', flag)
        )
      })
      http.all(reqs)
        .then( () => console.log('Flags updated'))
        .catch((err) => console.error(err))
    }
  }
}