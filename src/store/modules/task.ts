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
      current: false
    },
    textList: []
  },
  getters: {
    created: (state: { created: string}) => state.created,
    freetext: (state: { freetext: object }) => state.freetext,
    freetextGrade: (state: { freetextGrade: number }) => state.freetextGrade,
    task: (state: { task: Array<object> }) => state.task,
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
    }
  },
  actions: {
    /**
     * TODO:
     *  add create Task
     *  Add get Task
     *  Update
     */

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
            resolve(resp.data.task)
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
     *
     * @param param0 state variables
     */
    taskUpdate ({ state, commit }) {
      const task = state.task
      console.log('Task Update')
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
        : Promise.reject(new Error('No task found!'))
    },

    /**
     */
    getCourseFreeTexts (
      { state, commit },
      data:{courseId:string, assessmentId:string}
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
