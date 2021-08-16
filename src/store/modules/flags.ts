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
      if (state.courseFlags.some( // duplicate check if invoked several times
          (existingFlag: {
            courseId: String,
            referenceId: String,
            question: String
          }) => {
            // console.log(`Flag exists (Object comparison): ${existingFlag == flag}`)
            return (existingFlag.courseId === flag.courseId &&
                existingFlag.referenceId === flag.referenceId &&
                existingFlag.question === flag.question)
          })
      ) {
        console.error('Flag exists! (Comparison by selected values)')
      } else { // fresh flag: push in array
        state.courseFlags.push(flag)
      }

    },
    appendFlagAnswer(state, data: { id: string, answer: Object }) {
      const arr = state.courseFlags.filter(flag => flag.referenceId === data.id)
      if (arr.length > 1) console.error('More than one flag with same ID!')
      arr[0].answers.push(data.answer)
      // console.log(state.courseFlags)
    },
    clearFlagList(state: {courseFlags: Array<Object>}) {
      state.courseFlags = []
    },
    clearFlagsToAddList(state: {flagsToAdd: Array<Object>}) {
      state.flagsToAdd = []
    },
    setFlag(state, flag) {
      state.flagsToAdd.push(flag)
    }
  },

  actions: {
    checkCourseFlags({commit, rootState, state}) {
      // console.log('We are checking Course Flags!')
      const course = rootState.edit.course
      const flags = rootState.flags.courseFlags
      // console.log(course)
      // console.log(flags)
      const checkIfFlagged = (elem) => { // helper function to check if a part is flagged
        // console.log('checking: ')
        // console.log(elem)
        if (Object.prototype.hasOwnProperty.call(elem,'flagged')) {
          const elemId = elem.id
          for (const flag of flags) {
            if (flag.referenceId === elemId) {
              console.log(`${elemId} has a flag, trying to mutate it!`)
              commit('flagFlaggableElement', elem)
            } else {
              // console.log(elem + ' can be flagged but no flag exists')
            }
          }
        } else {
          // console.log('flagged boolean doesn\'t exist!')
        }
      }
      // console.log(course.content)
      for (const step of course.content) {
        const iterInput = Object.values(step.input)
        // console.log(`iterInput: ${iterInput}`)
        for (const elem of iterInput) {
          if (typeof(elem) === 'object') {
            if (Array.isArray(elem)) {
              for (const iter of elem) {
                checkIfFlagged(iter)
              }
            } else {
              checkIfFlagged(elem)
            }
          }
        }
      }
    },

    getCourseFlags({ commit }: { commit: Function }, cid: String) {
      commit('clearFlagList')
      console.log('getting elements for courseId: ', cid)
      return new Promise((resolve, reject) => {
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
            resolve(null)
          })
          .catch(err => {
            console.error(err)
            reject(null)
          })
      })
    },

    updateCourseFlags({state, commit}) {
      state.flagsToAdd.forEach(flag => {
        console.log(flag)
        http.post('flags', flag)
          .then(resp => {
            commit('appendFlag', resp.data)
          })
          .catch(err => console.error(err))
      })


    },

    saveFlags({commit, state}) {
      const reqs = []
      state.courseFlags.forEach(flag => {
        console.log(flag)
        reqs.push(
          http.patch('flags', flag)
        )
      })
      http.all(reqs)
        .then( () => console.log('Flags updated'))
        .catch((err) => console.error(err))
      commit('clearFlagList')
    }
  }
}