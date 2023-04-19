/**
 * Filename: course-files.ts
 * Use: handle course files
 * Author: cmc
 * Since: v1.3.0
 */
import http from 'axios'

export default {
  state: {
    courseFiles: []
  },
  getters: {
    courseFiles: (state) => state.courseFiles
  },
  mutations: {
    /**
     * Function courseFilesSet: sets course files
     * @param state contains course files
     * @param files array of files
     */
    courseFilesSet (state, files) {
      state.courseFiles = files
    },
    /**
     * Function courseFilesUpdate: updates list of course files
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @param courseFiles array of files
     */
    courseFilesUpdate (
      state: {
        courseFiles: Array<object>
      },
      courseFiles: Array<object>
    ) {
      // console.log('Start updating Course Files in Store')
      const ids = new Set(state.courseFiles.map((d: {name: string}) => d.name))
      state.courseFiles = [
        ...state.courseFiles,
        ...courseFiles.filter((d: {name: string}) => !ids.has(d.name))
      ] // add new files to state.courseFiles
    },
    /**
     * Function fileDelete: delete file from state and database
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course file list
     * @param file file object to remove
     */
    fileDelete (
      state: {
        courseFiles: [{name: string}]
      },
      file: {
        name: string,
      }) {
      const idx = state.courseFiles.findIndex(elem => elem.name === file.name)
      state.courseFiles.splice(idx, 1)
    }
  },
  actions: {
    /**
     * @function deletes course files and storage from back end
     * @author cmc
     * @since v1.3.0
     * @param state to get course files
     * @param rootState to get course storage id and files
     */
    courseFilesDelete ({ state, rootState }) {
      const sid = rootState.courseEdit.course.storageId
      const files = state.courseFiles
      const requests = []
      return new Promise((resolve, reject) => {
        if (files) {
          for (const file of files) {
            requests.push(
              http.delete(`storage/${sid}/files/${file.name}`)
                // .then( () => console.log(`removed ${file.originalFilename}`))
                .catch((err) => {
                  // console.error(err)
                  reject(err)
                })
            )
          }
        }
        http.all(requests)
          .then(
            http.spread(() => console.log('FILES REMOVED'))
          )
          .catch(err => {
            // console.error(err)
            reject(err)
          })
          .finally(() => {
            // delete course storage
            http.delete(`storage/${sid}`)
              .then((resp) => resolve(resp))
              .catch((err) => {
                // console.error(err)
                reject(err)
              })
          })
      })
    },

    /**
     * Function courseFilesDeleteSingle: delete single file from course
     * @author cmc
     * @since v1.3.0
     * @param commit to commit fileDelete mutation
     * @param file file object to delete
     */
    courseFilesDeleteSingle ({ commit }, file) {
      return new Promise((resolve, reject) => {
        http.delete(`storage/${file.container}/files/${file.name}`)
          .then(() => {
            commit('fileDelete', file)
            resolve('File deleted')
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    /**
     * Function courseFilesStore: persist list of course files
     *  into database
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     */
    courseFilesStore ({ rootState, state }) {
      const newFileData = {
        files: state.courseFiles,
        lastChanged: Date.now()
      }
      // console.log(newFileData)
      return new Promise((resolve, reject) => {
        http.patch(
          `courses/${rootState.courseEdit.course.courseId}`,
          newFileData
        )
          .then((resp) => {
            // console.log(resp)
            resolve(resp)
          })
          .catch(err => {
            // console.error(err)
            reject(err)
          })
      })
    }
  }
}
