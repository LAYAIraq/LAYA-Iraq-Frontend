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
    /**
     * courseFlags: return courseFlags array
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     */
    courseFlags(state: { courseFlags: Array<object> }) {
      return state.courseFlags
    }
  },

  mutations: {
    /**
     * Function appendFlag(): append flag to courseFlags
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variable
     * @param flag flag to add
     */
    appendFlag(
      state: { courseFlags: Array<object> },
      flag: {
       courseId: String,
       referenceId: String,
       question: String
      }
    ) {
      if (!state.courseFlags.some( // duplicate check if invoked several times
          (existingFlag: {
            courseId: String,
            referenceId: String,
            question: String
          }) => {
            // check if flag exists by mapping course, reference and question
            return (existingFlag.courseId === flag.courseId &&
                existingFlag.referenceId === flag.referenceId &&
                existingFlag.question === flag.question)
          })
      ) { // fresh flag: push in array
        state.courseFlags.push(flag)
      }
    },

    /**
     * Function appendFlagAnswer(): add answer to answers array of a flag
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     * @param data id for flag and answer object
     */
    appendFlagAnswer(state: { courseFlags: Array<any> }, data: { id: string, answer: object }) {
      const arr = state.courseFlags.filter(flag => flag.referenceId === data.id)
      if (arr.length > 1) console.error('More than one flag with same ID!')
      arr[0].answers.push(data.answer)
      // console.log(state.courseFlags)
    },

    /**
     * Function clearFlagList(): set courseFlags array to empty
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     */
    clearFlagList(state: { courseFlags: Array<Object> } ) {
      state.courseFlags = []
    },

    /**
     * Function clearFlagsToAddList(): clear list of flags to add
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     */
    clearFlagsToAddList(state: { flagsToAdd: Array<Object> }) {
      state.flagsToAdd = []
    },

    /**
     * Function setFlag(): add Flag to flagsToAdd array
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     * @param flag Object to be added
     */
    setFlag(state, flag) {
      state.flagsToAdd.push(flag)
    }
  },

  actions: {
    /**
     * checkCourseFlags(): check if any parts of the course are
     *  flagged, mutate their properties accordingly
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param commit state commit
     * @param rootState rootState to get course
     * @param state state variables
     */
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
              // console.log(`${elemId} has a flag, trying to mutate it!`)
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

    /**
     * Function getCourseFlags(): fetch course Flag for courseID from backend
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param commit state commit
     * @param cid courseId for course
     * @returns Promise for backend http request
     */
    getCourseFlags({ commit }: { commit: Function }, cid: string) {
      commit('clearFlagList')
      // console.log('getting elements for courseId: ', cid)
      return new Promise((resolve, reject) => {
        http.get('flags', {
          params: {
            filter: { where: { courseId: cid }}
          }
        })
          .then(resp => {
            // if (resp.data.length === 0) console.log('None found!')
            resp.data.forEach(elem => {
              // console.log(elem)
              // console.log('Adding ' + elem.referenceId + 'to flag list')
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

    /**
     * function saveFlags(): persist flagsToAdd into backend
     *
     * Author: cmc
     *
     * Last Updated: August 17, 2021
     * @param state state variables
     * @param commit commit function
     */
    saveFlags({state, commit}) {
      state.flagsToAdd.forEach(flag => {
        // console.log(flag)
        http.post('flags', flag)
          .then(resp => {
            commit('appendFlag', resp.data)
          })
          .catch(err => console.error(err))

      })
      commit('clearFlagsToAddList')
    },

    /**
     * function updateFlags(): persist changes to courseFlags
     * @param commit commit function
     * @param state state variables
     */
    updateFlags({ commit, state }) {
      const reqs = []
      state.courseFlags.forEach(flag => {
        // const id = flag.referenceId
        // const id = flag.referenceId
        // const flagNoId = (({referenceId, ...o}) => (o)) (flag)
        reqs.push(
          http.post('flags/updateFlag', flag)
        )
        // reqs.push(
        //   http.post(`flags/${id}/`)
        // )
      })
      http.all(reqs)
        .then( () => console.log('Flags updated'))
        .catch((err) => console.error(err))
      commit('clearFlagList')
    }
  }
}