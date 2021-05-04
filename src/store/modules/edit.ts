import http from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  state: {
    course: {},
    courseList: [],
    enrollment: {},
    userEnrolled: false
  },
  
  getters: {

    /**
     * Function isUserEnrolled: returns if user is enrolled
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains userEnrolled boolean 
     * @returns true if user is enrolled
     */
    isUserEnrolled (state: { userEnrolled: boolean}) {
      return state.userEnrolled
    },

    /**
     * Function content: returns content of given course
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course Object
     * @returns content Array
     */
    content(state: { course: { content: Array<object> } } ) {
      return state.course.content
    },

    /**
     * Function course: returns course Object
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course Object
     * @returns course Object
     */
    course(state: { course: object } ) {
      return state.course
    },

    /**
     * Function courseFiles: returns array of stored files
     * 
     * Author: cmc 
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @returns array of course files
     */
    courseFiles(state: { course: { files: Array<Object> } }) {
      return state.course.files
    },

    /**
     * Function courseList: returns list of courses
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList 
     * @returns array of courses
     */
    courseList(state: { courseList: Array<Object>}) {
      return state.courseList
    },

    /**
     * Function courseStorage: returns id of course storage
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @returns course storage id
     */
    courseStorage(state: { course: { storageId: string } }) {
      return state.course.storageId
    }
  },

  mutations: {

    /**
     * Function appendContent: add a content block to content array
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course containing content array
     * @param data content to add
     */
    appendContent ( 
      state: { course: { content: Array<Object> } }, 
      data:{ name: String, nextStep: any, input: Object} 
      ) {
      state.course.content.push(data)
    },

    /**
     * Function appendToCourseList: add course object
     *  to courseList array
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList array
     * @param data course objecte to be added to list
     */
    appendToCourseList(
      state: { courseList: Array<Object> }, 
      data: Object ) {
      state.courseList.push(data)
    },

    /**
     * Function delContent: remove Content at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course object
     * @param step index of content to remove
     */
    delContent( state: 
        { course: { content: object[] } }, 
        step: number ) {
      state.course.content.splice(step, 1)
    },

    /**
     * Function delFile: delete file from state and database
     * 
     * Author: cmc
     * 
     * Last Updated: April 9, 2021
     * 
     * @param state contains course file list
     * @param file file object to remove
     */
    delFile(state: { course: { files: object[] } }, file: { name: string, container: string } ) {
      let idx = state.course.files.indexOf(file)
      // console.log(`${file.name} hat Stelle ${idx}`)
      state.course.files.splice(idx, 1)
      http.delete(`storage/${file.container}/files/${file.name}`)
        .catch( (err) => {
          console.error(err)
        })
    },

    /**
     * Function renameCourse: rename a Course
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course 
     * @param newName string for new name
     */
    renameCourse( state: {course: {name: string}}, newName: string) {
      state.course.name = newName
    },

    /**
     * Function setEnrollment: set an enrollment for current user
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains enrollment, userEnrolled
     * @param data enrollment object
     */
    setEnrollment(state: {enrollment: object, userEnrolled: boolean }, data: object) {
      state.enrollment = data
      state.userEnrolled = true
    },

    /**
     * Function setCourse: set state to given course
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course
     * @param data course object
     */
    setCourse(state: { course: object}, data: object) {
      state.course = data
    },

    /**
     * Function setCourseList: set list of courses in store
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains courseList array
     * @param data array of course objects
     */
    setCourseList(state: { courseList: Array<Object> }, data: Array<Object>) {
      console.log(data)
      state.courseList = data
    },

    /**
     * Function updateCourseFiles: updates list of course files
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param state contains course object
     * @param data array of files
     */
    updateCourseFiles(state: { course: { files: Array<Object> } }, data: Array<Object>) {
      console.log('Start updating Course Files in Store')
      
      let ids = new Set(state.course.files.map((d: {name: string}) => d.name))
      let merged = [...state.course.files, ...data.filter( (d: {name: string}) => !ids.has(d.name) )]

      // console.log(merged)
      state.course.files = merged

    },

    /**
     * Function updateCourseNav: replace content with input content array
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course, content
     * @param data new content array
     */
    updateCourseNav( state: {course: {content: Array<object>}}, data: Array<object>) {
      state.course.content = data
    },


    /**
     * Function updateStep: update content block at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains course, content
     * @param data contains step index, new content object 
     */
    updateStep( state: {course: {content: Array<object>}} , 
        data: { step: number, updatedStep: object } ) {
      state.course.content[data.step] = {
        ...state.course.content[data.step], 
        ...data.updatedStep
      }
    }

  },
  
  actions: {

    /**
     * Function deleteCourse: delete Course, remove all files
     *   and storage
     * 
     * Author: cmc
     * 
     * Last Changed: April 9, 2021
     * 
     * @param param0 state variables
     */
    deleteCourse({ state }) {
      let cid = state.course.courseId
      let sid = state.course.storageId
      let files = state.course.files

      return new Promise ((resolve, reject) => {
        // collect delete requests for all course files
        let requests = []
        if (files) {
          for ( let file of files) {
            requests.push(
              http.delete(`storage/${sid}/files/${file.name}`)
                .then( () => console.log(`removed ${file.originalFilename}`))
                .catch( (err) => { 
                  // console.error(err)
                  reject(err)
                })
            )
          }
        }
        http.all(requests)
          .then(
            http.spread( () => console.log('FILES REMOVED'))
          )
          .catch(err => {
            // console.error(err)
            reject(err)
          })
          .finally( () => {
            // delete course storage
            http.delete(`storage/${sid}`)
            .then( () => console.log('Container removed!'))
            .catch( (err) => {
              // console.error(err)
              reject(err)
            })
          })

        // delete course itself
        http.delete(`courses/${cid}`)
        .then( () => {
          // console.log("REMOVED COURSE", cid)
          resolve('all good')
        })
        .catch(err => {
          // console.error('Failed to delete course:', err)
          reject(err)
        })
      })
    },

    /**
     * Function copyCourse: copy course and all the files
     *  FIXME: Files are not copied
     * 
     * Author: cmc
     * 
     * Last Updated: April 21, 2021
     * @param param0 
     * @param newName 
     */
    copyCourse({commit, state, rootState}, newName: string) {
      console.log('Original Course Files:', state.course.files)
      // console.log(rootState)
      // create new course object
      let newId = uuidv4()
      let newStorage = uuidv4()
      let copiedCourse = { ...state.course,
        name: newName,
        createDate: Date.now(),
        lastChanged: Date.now(),
        courseId: newId,
        storageId: newStorage,
        files: []
      }

      // create new Storage
      let store = http.post('storage', { name: newStorage })
      let fileReqs = []
      let newFiles = []
      store

      /* Files are not being copied because of a bug */
      // .then( () => {
      //   // storage created, now copy files
      //   // therefore, we create an array of requests
      //   state.course.files.forEach( (file: { 
      //     name: string, 
      //     container: string, 
      //     originalFilename: string
      //   }) => {
      //     fileReqs.push(
      //       // download file
      //       new Promise((resolve, reject) => {
      //         http.get(`storage/${file.container}/download/${file.name}`)
      //         .then( resp => {
      //           //file was downloaded, extract values
      //           // console.log('new data: ', resp)
      //           let mimeType = JSON.parse(JSON.stringify(resp.headers))['content-type']
      //           // console.log(mimeType)
      //           let blob = new Blob([resp.data], {type: mimeType})
      //           // console.log(blob)
      //           const formData = new FormData()
      //           formData.append('file', blob, file.originalFilename)
                
      //           // re-upload file in new storage
      //           http.post(`storage/${newStorage}/upload/`, formData, {
      //             headers: {
      //               'Content-Type': 'multipart/form-data'
      //             }
      //             })
      //             .then( resp => {
      //               // file was re-uploaded, push values to newFiles
      //               let newFile = resp.data.result.files.file[0]
      //               // console.log(newFile)
      //               // console.log('File uploaded: ', resp)
      //               newFiles.push(newFile)
      //               // console.log('New files:', newFiles)
      //               resolve('done')
      //             })
      //             .catch( err => {
      //               // file re-upload failed
      //               // console.error('Hier geht nix: ', err)
      //               reject('nox')
      //             })
      //         })
      //       })
      //     )
      //   })
      // })
      .catch( err => { 
        // creating new storage failed, return reject
        return new Promise((resolve, reject) => { 
          reject(err) 
        }) 
      })

      /* commented out because files are not being copied as of now */
      // // fire all requests for new files
      // // console.log('Array of requests: ', fileReqs)
      // let copiedFiles = Promise.allSettled(fileReqs)
      // copiedFiles.then( (...resp) => {

      //   // console.log('ALL FILES HAVE SUCCESSFULLY BEEN UPLOADED!')
      //   // console.log(resp)
      //   // console.log(newFiles)
      //   copiedCourse = {
      //     ...copiedCourse, 
      //     files: newFiles
      //   }
      //   // console.log('NEW COPIED COURSE:', copiedCourse)

        return new Promise( (resolve,reject) => {
          
          // console.log('again: this course should be posted ', copiedCourse)
          // FIXME: filelist is not pushed in database
          http.post(`courses`, copiedCourse)
            .then( (resp) => { 
              // console.log('This response we got: ', resp)
              resolve('success')
              // FIXME: Copy File List to Course
              // let fileList = []
              // newFiles.forEach(elem => {
              //   let copy = JSON.parse(JSON.stringify(elem))
              //   fileList.push(copy)
              // })
              // console.log('We try to push these files:', fileList)
              // console.log('We tried to copy this array: ', newFiles)

              // http.post(`courses/${newId}/update-files`, newFiles)
              //   .then( (resp) => {
              //     console.log(`New course files: `, resp)
              //     resolve('success')
              //   })
              //   .catch((err) => {
              //     reject(err)
              //   })
            })
            .catch( (err) => { reject(err)})
        })
      // })
      // .catch(err => { 
      //   // copying course files failed, return reject
      //   return new Promise((resolve, reject) => { 
      //     reject(err) 
      //   })
      // })
    },

    /**
     * Function fetchCourse: load course into store
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param name course identifier
     * @returns Promise to load course object
     */
     fetchCourse ({ commit, state, rootState}, name: String) {
      //can you return router function? //TODO direkt hier 
      return new Promise( (resolve, reject) => {
        commit('setBusy', true)

        //get course ID from name
        http.get(`courses/getCourseId?courseName=${name}`)
          .then( ({ data }) => {
            /* fetch course */
            http.get(`courses/${data.courseId}`)
            .then(({ data }) => {
              // console.log(data)
              commit('setCourse', data)
              resolve('Course loaded')
            })
            .catch( err => {
              /*
              * redirect off invalid course */
              console.error(err);
              reject(err)
            })
          })
          .catch( err => {
            console.log(err)
          })
          .finally( () => commit('setBusy', false))
        })
    },

    /**
     * Function fetchCourseList: get list of courses
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     */
    fetchCourseList({commit, state, rootState}) {
      commit('setBusy', true)
      http.get('courses?filter[include]=author')
        .then( ({data}) => {
          for(let courseObject of data) {
            const listData = { 
              category: courseObject.category, 
              name: courseObject.name, 
              needsEnrollment: courseObject.needsEnrollment, 
              courseId: courseObject.courseId 
            }
            state.courseList.some((e: { courseId: String }) => 
              e.courseId === listData.courseId)? '' : commit('appendToCourseList', listData)
          }
        })
        .catch(err => console.error(err))
        .finally( () => { commit('setBusy', false) })
    },

    /**
     * Function fetchEnrollment: fetch enrollment created at given date
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables
     * @param courseId identifier for enrollment
     */
     fetchEnrollment({ commit, state, rootState }, courseId: String) {
      const self = this
      let uid = rootState.auth.userId
      let cid = courseId
      commit('setBusy', true)
      http.get('enrollments/findOne', { params: 
          { filter:
            { where: 
              { studentId: uid, courseId: cid } 
            }
          }
        })
        .then(({data}) => {
          console.log('Enrollment exists!')
          commit('setEnrollment', data)
        })
        .catch(err => {
          console.log('No enrollment found!')
          console.error(err)
        })
        .finally( () => { commit('setBusy', false) })
    },

    /**
     * Function storeCourse: persist changes to store in database
     * 
     * Author: core
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     * @returns Promise to save changes
     */
     storeCourse({ commit, state, rootState}) {
      let updated = Date.now()
      let cId = state.course.courseId
      let cContent = state.course.content

      return new Promise( (resolve, reject) => { 
        http.patch(`courses/${cId}`, {content: cContent, lastChanged: updated})
          .catch(err => {
            console.error('Failed storing course content:', err)
            reject(err)
          })
          .finally(()  => {
            resolve('Course updated successfully')
          })
        })
      
    },

    /**
     * Function storeCourseFiles: persist list of course files 
     *  into database
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     * 
     * @param param0 state variables
     */
    storeCourseFiles({ state }) {
      const newFileData = {
        files: state.course.files,
        lastChanged: Date.now()
      }
      // console.log(newFileData)
      return new Promise( (resolve, reject) => {
        http.patch(`courses/${state.course.courseId}`, newFileData)
          .then( (resp) => {
            // console.log(resp)
            resolve(resp)
          })
          .catch( err => {
            console.error(err)
            reject(err)
          })
      })
 
    },

    /**
     * function updateEnrollment: update enrollment object
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param param0 state variables 
     */
     updateEnrollment({ commit, state, rootState } ) {
      const enrol = state.enrollment

      http.patch(`enrollments/${enrol.id}`, enrol)
        .then(resp => {
          console.log('Enrollment updated!')
        })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * Function updateRenamedCourse: rename old course
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     * @returns Promise to update renamed course
     */
    updateRenamedCourse({ commit, state, rootState}) {   

      const newName = {
        lastChanged: Date.now(),
        name: state.course.name
      }

      return new Promise( (resolve, reject) => {
        http.patch(`courses/${state.course.courseId}`, newName)
          .then( () => {
            resolve('Updated Course name!')
          })
          .catch( (err) => {
            reject(err)
          })
      }) 
    }      
  }
}