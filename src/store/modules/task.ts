/**
 * Filename: task.ts
 * Use: settings for logged users
 * Creator: core
 * Since: v1.0.0
 */

import http from 'axios'
import { ids as supportedLangs } from '@/options/langs.js'
import { stripKey } from '@/mixins/general/helpers'

export default {
  state: {
    task: {
      id: 0,
      created: '',
      freetext: {},
      freetextGrade: 0,
      assessmentId: '',
      feedback: '',
      current: false,
      rated: false
    },
    textList: []
  },
  getters: {
    created: (state: { created: string}) => state.created,
    freetext: (state: { freetext: object }) => state.freetext,
    freetextGrade: (state: { freetextGrade: number }) => state.freetextGrade,
    task: (state: { task: Array<object> }) => state.task,
    feedback: (state: { feedback: string }) => state.feedback,
    rated: (state: { rated: Boolean }) => state.rated,
    textList: (state: { textList: Array<object> }) => state.textList
  },
  mutations: {

    taskSet (
      state: {task: {id: number}},
      taskData: {id: number}
    ) {
      state.task = taskData
      console.log(state.task)
    },
    /**
     * Author: akokay
     */
    freetextAdd (
      state: {
        task: {
          freetext: object
        }
      },
      freetextData: object
    ) {
      console.log(state.task)
      console.log(state)
      state.task.freetext = freetextData
    },

    /**
     * Author: akokay
     */
    freetextListAdd (
      state: {
        textList: Array<object>
      },
      tasksObject: { subs: Array<object> }
    ) {
      console.log('freetextListAdd')
      console.log(tasksObject.subs)
      console.log(...tasksObject.subs)
      // state.enrollmentList.push(...tasksObject.subs)
      state.textList = tasksObject.subs
    },
    /**
     * Author: akokay
     */
    freetextGradeAdd ({ state },
      data: {task: {
          freetextGrade: number
        },
      grade:number}
    ) {
      data.task.freetextGrade = data.grade
    },
    /**
     * Author: akokay
     */
    freetextFeedbackAdd ({ state },
      data: {task: {
          feedback: string
        },
        feedback:string}
    ) {
      data.task.feedback = data.feedback
    },
    /**
     * Author: akokay
     */
    setRating ({ state },
      data: {task: {
          rated:Boolean
        },
        rated:Boolean}
    ) {
      data.task.rated = data.rated
    }
  },
  actions: {
    /**
     * taskCreate
     * @param state
     * @param data
     */
    taskCreate ({ state },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        console.log('taskCreate')
        http.post('tasks/create', data)
          .then(resp => {
            console.log('taskCreate respoonse')
            console.log(resp.data.task)
            resolve(resp.data.task)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * taskCreate
     * @param state
     * @param data
     */
    getSpecificTask ({ state },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        console.log('getSpecificTask')
        http.get('tasks/getSpecificTask', data)
          .then(resp => {
            console.log('getSpecificTask respoonse')
            resolve(resp.data.subs)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * taskCreate
     * @param { rootstate,state, commit }
     * @param data
     */
    taskFetch ({ state, commit },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        console.log('taskFetch')
        http.get('tasks/getSpecificTask', data)
          .then(resp => {
            if (resp.data.subs === undefined) { // check if task exists
              http.post('tasks/create', data)
                .then(resp => {
                  console.log('created new Task response')
                  resolve(resp.data.subs)
                })
                .catch(err => reject(err))
            }
            commit('taskSet', resp.data.subs)
            resolve('Task exists!')
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function enrollmentUpdate: update enrollment object
     *
     * Author: cmc
     *
     * Last Updated: December 15, 2023
     *
     * @param param0 state variables
     */
    taskUpdate ({ state, commit }, other:{id:string, grade:number, feedback:string}) {
      console.log(other)
      const task = other || state.task
      if (task.grade !== null && task.feedback.trim() !== '') {
        console.log('es exitiert feedback')
        commit('setRating', { task: task, rated: true })
      }
      console.log(`Grade: ${task.freetextGrade}`)
      return task
        ? new Promise((resolve, reject) => {
          http.patch(
            `tasks/${task.id}`,
            task
          )
            .then(() => {
              console.log('Task updated!!!!!!!!!!!!!!')
              // commit('taskSet', task)
              resolve('Task updated!')
            })
            .catch(err => reject(err))
        })
        : Promise.reject(new Error('No enrollment found!'))
    },

    /**
     */
    getCourseFreeTexts (
      { state, commit },
      data:{courseId:string, assessmentId:string,filterAdmin:Boolean}
    ) {
      const courseId = data.courseId
      const assessmentId = data.assessmentId
      return new Promise((resolve, reject) => {
        http.get('tasks/getAllByCourseId')
          .then(({ data }) => {
            // console.log('Enrollment exists!')
            console.log(data)
            console.log('data')
            commit('freetextListAdd', data)
            console.log('after data')
            console.log(state)
            console.log(state.textList)
            resolve('freetextList exists!')
          })
          .catch(err => reject(err))
          .finally(() => commit('setBusy', false))
      }
      )
    },

    /**
     *
     * @param param0 state variables
     */
    deleteAll ({ state, commit }) {
      const task = state.task
      console.log('DELETE ALL')
      return task
        ? new Promise((resolve, reject) => {
          http.post(
            'deleteAll',
            task
          )
            .then(() => {
              resolve('Task updated!')
            })
            .catch(err => reject(err))
        })
        : Promise.reject(new Error('No task found!'))
    }
  }
}
