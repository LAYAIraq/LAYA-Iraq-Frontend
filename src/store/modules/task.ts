/**
 * Filename: task.ts
 * Use: organize tasks
 * Creator: akokay
 * Since:
 */

import http from 'axios'

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

    /**
     * Function taskSet: set a task for current state
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     *
     * @param state contains task
     * @param taskData task object
     */
    taskSet (
      state: {task: {id: number}},
      taskData: {id: number}
    ) {
      state.task = taskData
      console.log(state.task)
    },

    /**
     * Function freetextAdd: Add new free-text to free-text object or update existing free-text
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param state contains free-text
     * @param freetextData contains freetextData to be stored in freetext
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
     * Function freetextListAdd: Sets freetexts to textList
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param state contains textList
     * @param freetextData contains tasksObject to be stored in textList
     */
    freetextListAdd (
      state: {
        textList: Array<object>
      },
      tasksObject: { subs: Array<object> }
    ) {
      // state.enrollmentList.push(...tasksObject.subs)
      state.textList = tasksObject.subs
    },

    /**
     * Function freetextGradeAdd: set grade of freetext
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     *
     * @param data contains freetext
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
     * Function freetextFeedbackAdd: set feedback of freetext
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     *
     * @param data contains freetext
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
     * Function setRating: set rated of freetext
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     *
     * @param data contains freetext
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
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
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
            resolve(resp.data.task)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * getSpecificTask: fetch specific Task based on sutendID and assementID
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param state
     * @param data
     */
    getSpecificTask ({ state },
      data: object
    ) {
      return new Promise((resolve, reject) => {
        http.get('tasks/getSpecificTask', data)
          .then(resp => {
            resolve(resp.data.subs)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * taskFetch: fetch specific Task based on sutendID and assementID
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param state
     * @param data
     */
    taskFetch ({ state, commit },
      data: object
    ) {
      return new Promise((resolve, reject) => {
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
     * function taskUpdate: update task object
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param param0 state variables
     * @param param1 optional task object
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
     * function getCourseFreeTexts: fetch all task objects of assesment
     *
     * Author: akokay
     *
     * Last Updated: January 7, 2024
     * @param param0 state variables
     * @param data optional task object
     */
    getCourseFreeTexts (
      { state, commit },
      data:{courseId:string, assessmentId:string, filterAdmin:Boolean}
    ) {
      const courseId = data.courseId
      const assessmentId = data.assessmentId
      return new Promise((resolve, reject) => {
        http.get('tasks/getAllByCourseId')
          .then(({ data }) => {
            commit('freetextListAdd', data)
            resolve('freetextList exists!')
          })
          .catch(err => reject(err))
          .finally(() => commit('setBusy', false))
      }
      )
    }
  }
}
