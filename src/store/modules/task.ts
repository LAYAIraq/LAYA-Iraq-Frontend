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
    }
  },
  getters: {
    created: (state: { created: string}) => state.created,
    freetext: (state: { freetext: object }) => state.freetext,
    freetextGrade: (state: { freetextGrade: number }) => state.freetextGrade
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
                  console.log('+created new Task respoonse+++++++++++++++++++++++++++++++++++++++++++++')
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
