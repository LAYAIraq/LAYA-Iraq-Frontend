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
    },

    /**
     * singleFlag: return a single flag that matches id
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state courseFlags
     * @param id identifier of flag to return
     */
    singleFlag: (
      state: {
        courseFlags: [
          flag: {
          referenceId: string
        }
        ]
      }) => (id: string) =>
    {
      for (const flag of state.courseFlags) {
        if (flag.referenceId === id) {
          return flag
        }
      }
      return null
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
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param answerData id for flag and answer object
     */
    appendFlagAnswer(
      state: {
        courseFlags: Array<{
          answers: Array<object>,
          referenceId: string
        }>
      },
      answerData: {
        id: string,
        answer: object
      } ) {
      // find element courseFlags
      const arr = state.courseFlags.filter(flag => flag.referenceId === answerData.id)
      // if (arr.length > 1) console.error('More than one flag with same ID!')
      arr[0].answers.push(answerData.answer)
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
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param flag Object to be added
     */
    setFlag(
      state: { flagsToAdd: Array<object> },
      flag: object
    ) {
      state.flagsToAdd.push(flag)
    },

    /**
     * Function updateAnswer: update an answer in store,
     *  store old answer in history, state par
     *
     * Author: cmc
     *
     * Last Updated: October 22, 2021
     * @param state neccessary to deference answer
     * @param answer a reference to an answer ín state
     * @param text the new answer text
     * @param bool if answer is question
     */
    updateAnswer(
      state,
      { answer, text, bool }: {
        answer: {
          edited: boolean,
          history: any, // can be null
          isQuestion: boolean,
          text: string,
          timestamp: number,
        },
        bool: boolean,
        text: string,

      }) {
      const oldAnswer = {
        text: answer.text,
        timestamp: answer.timestamp
      }
      if (!answer.history) {
        answer.history = []
        answer.edited = true
      }
      answer.history.push(oldAnswer)
      answer.text = text
      answer.isQuestion = bool
      answer.timestamp = Date.now()
    },

    /**
     * function updateFlagQuestion: update the text of a question
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state flag is a reference here
     * @param flag the flag to answer
     * @param question string that represents the new question
     */
    updateFlagQuestion(
      state,
      {flag, question}: {
        flag: {
          question: {
            text: string,
            edited: boolean,
            editTime: number
          }
        },
        question: string
      }) {
      flag.question.text = question
      flag.question.edited = true
      flag.question.editTime = Date.now()
    },

    /**
     * function voteOnFlagAnswer: upvote or downvote an answer
     *
     * Author: cmc
     *
     * Last Updated: October 22, 2021
     * @param state answer is a reference here
     * @param answer the referenced answer
     * @param val -1 if downvote, 1 if upvote
     * @param uid userId of voter
     */
    voteOnFlagAnswer(
      state,
      { answer, val, uid }: {
        answer: {
          votes: any, // can be null
          score: number
        },
        val: number,
        uid: string
      } ) {
      if (Object.prototype.hasOwnProperty.call(answer,'votes')) {
        // answer has exisiting votes
        const vote = answer.votes[uid] ? answer.votes[uid] : 0 // turn null vote into 0
        switch (vote+val) { // possibilities for voting
          case -2: // remove downvote
            answer.votes[uid] = 0
            answer.score++
            break
          case -1: // add downvote
            answer.votes[uid] = val
            answer.score--
            break
          case 0: // reverse up/downvote
            val === 1 ? answer.score += 2 : answer.score -= 2
            answer.votes[uid] = val
            break
          case 1: // add upvote
            answer.votes[uid] = val
            answer.score++
            break
          case 2: // remove upvote
            answer.votes[uid] = 0
            answer.score--
            break
          default:
            console.error('something went terribly wrong!')
            break
        }
      } else { // no votes yet
        answer.votes = {}
        answer.votes[uid] = val
        answer.score += val
      }
    }
  },

  actions: {
    /**
     * checkCourseFlags(): check if any parts of the course are
     *  flagged, mutate their properties accordingly
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param commit state commit
     * @param rootState rootState to get course
     * @param state state variables
     */
    checkCourseFlags(
      {commit, rootState, state}: {
        commit: Function,
        rootState: {
          edit: {
            course: {
              content: Array<{
                input: object
              }>
            }
          }
        },
        state: {
          courseFlags: Array<{
            referenceId: string
          }>
        }
      } ) {
      // console.log('We are checking Course Flags!')
      const content = rootState.edit.course.content
      const flags = state.courseFlags
      // console.log(course)
      // console.log(flags)
      const checkIfFlagged = (elem) => { // helper function to check if a part is flagged
        // console.log('checking: ')
        // console.log(elem)
        if (!elem) {
          console.error(`not an element: ${elem}`)
        } else if (Object.prototype.hasOwnProperty.call(elem,'flagged')) {
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
      for (const step of content) {
        // console.log(step)
        const iterInput = Object.values(step.input)
        // console.log(`iterInput: ${iterInput}`)
        for (const elem of iterInput) {
          if (typeof(elem) === 'object') {
            if (Array.isArray(elem)) {
              for (const iter of elem) {
                if (iter) checkIfFlagged(iter)
              }
            } else if (elem){
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
     * Last Updated: January 27, 2022
     * @param param0 store functions
     * @param cid courseId for course
     */
    getCourseFlags(
      { commit, dispatch }: {
        commit: Function,
        dispatch: Function
      },
      cid: string
    ) {
      commit('clearFlagList')
      // console.log('getting elements for courseId: ', cid)
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
        dispatch('checkCourseFlags')
      })
      .catch(err => console.error(err))
    },

    /**
     * function saveFlags(): persist flagsToAdd into backend
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param commit commit function
     */
    saveFlags(
      {state, commit}: {
        commit: Function,
        state: {
          flagsToAdd: Array<object>
        }
      } ) {
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
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param commit commit function
     * @param state state variables
     */
    updateFlags(
      { commit, state }: {
        commit: Function,
        state: {
          courseFlags: Array<object>
        }
      }
    ) {
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
        // .then( () => console.log('Flags updated'))
        .catch((err) => console.error(err))
      commit('clearFlagList')
    }
  }
}
