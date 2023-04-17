import http from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { slugify } from '@/mixins/general/course-structure'
// import auth from '@/store/modules/auth'

export default {
  state: {
    course: {},
    courseList: [],
    courseUpdated: false,
    studentId: []
  },

  getters: {

    /**
     * Function content: returns content of given course
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @returns content Array
     */
    content (state: {
      course: {
        content: Array<{ input: object }>,
        name: string
      }
    }) {
      return state.course.content
    },

    /**
     * Function course: returns course object
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     *
     * @param state contains course object
     * @returns course object
     */
    course (state: { course: {
      authorId: number,
      name: string,
      properties: object
      }
    }) {
      return state.course
    },

    /**
     * Function courseCreator: returns ID of course Creator
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state course object
     * @returns userId of course creator
     */
    courseCreator (state: {
      course: {
        authorId: number
      }
    }) {
      return state.course.authorId
    },

    /**
     * Function courseFiles: returns array of stored files
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @returns array of course files
     */
    courseFiles (state: {
      course: {
        files: Array<object>
      }
    }) {
      return state.course.files
    },

    /**
     * Function courseId: returns the courseId string
     * Author: cmc
     * Last Updated: January 27, 2022
     * @param state
     */
    courseId (state: {
      course: {
        courseId: string
      }
    }) {
      return state.course.courseId
    },

    /**
     * Function courseList: returns list of courses
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains courseList
     * @returns array of courses
     */
    courseList (state: { courseList: Array<Object> }) {
      return state.courseList
    },

    /**
     * function courseSimple: return true if course has simpleLanguage
     *  setting enabled
     *
     *  Author: cmc
     *
     *  Last Updated: October 29, 2021
     * @param state contains course
     */
    courseSimple (state: {
      course: {
        properties: {
          simpleLanguage: boolean
        }
      }
    }) {
      return state.course.properties.simpleLanguage
    },

    /**
     * @description returns course name slugified
     * @param state contains course object
     */
    courseSlug: (state: { course: { name: string } }) => slugify(state.course.name ?? ''),

    /**
     * Function courseStorage: returns id of course storage
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @returns course storage id
     */
    courseStorage (state: {
      course: {
        storageId: string
      }
    }) {
      return state.course.storageId
    },

    /**
     * Function courseUpdated: returns courseUpdated,
     *  used to circumvent unresponsive deep content watchers
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     * @param state contains boolean courseUpdated
     * @returns true
     */
    courseUpdated (state: { courseUpdated: boolean }) {
      return state.courseUpdated
    }
  },

  mutations: {

    /**
     * Function appendContent: add a content block to content array
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course containing content array
     * @param contentToAdd content to add
     */
    appendContent (
      state: {
        course: {
          content: Array<object>
        }
      },
      contentToAdd:{
        name: string,
        nextStep: any,
        input: object
      }) {
      state.course.content.push(contentToAdd)
    },

    /**
     * function changeCourseCategory: update course category
     *
     * Author: cmc
     *
     * Last Updated: August 8, 2022
     * @param state contains course object
     * @param newCategory new category
     */
    changeCourseCategory (
      state: {
        course: {
          category: string
        }
      },
      newCategory: string
    ) {
      state.course.category = newCategory
    },

    /**
     * function changeCourseProperties: update course properties
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state contains course.properties object
     * @param properties new properties
     */
    changeCourseProperties (
      state: {
        course: {
          properties: object
        }
      },
      properties: object
    ) {
      state.course.properties = {
        ...state.course.properties,
        ...properties
      }
    },

    /**
     * Function courseListAppend: add course object
     *  to courseList array
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022 by cmc
     *
     * @param state contains courseList array
     * @param courseListItem course object to be added to list
     */
    courseListAppend (
      state: { courseList: Array<object> },
      courseListItem: {
        author: number,
        category: string,
        courseId: string,
        name: string,
        properties: object,
        slug: string
      }
    ) {
      state.courseList.push(courseListItem)
    },

    /**
     * function courseListRemove: remove an item from the course list
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022
     * @param state contains courseList
     * @param {string} courseId of course item to delete
     */
    courseListRemove (
      state: {
        courseList: Array<{
          courseId: string
        }>
      },
      courseId: string
    ) {
      const idx = state.courseList.findIndex(elem => elem.courseId === courseId)
      state.courseList.splice(idx, 1)
    },

    /**
     * Function courseListUpdate: update courseList after name change of course
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022
     * @param state contains courseList
     * @param courseId id of updated course
     */
    courseListUpdate (
      state: {
        course: { category: string, name: string },
        courseList: Array<{
          category: string,
          courseId: string,
          name: string,
          slug: string
        }>
      },
      courseId: string
    ) {
      console.log('courseListUpdate')
      const listItem = state.courseList.find((item: { courseId: string, name: string }) => item.courseId === courseId)
      console.log(listItem)
      listItem.name = state.course.name
      listItem.category = state.course.category
      listItem.slug = slugify(state.course.name)
      console.log(listItem)
      console.log(state.courseList)
    },

    /**
     * Function delContent: remove Content at given index
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @param step index of content to remove
     */
    delContent (
      state: {
        course: {
          content: Array<object>
        }
      },
      step: number
    ) {
      state.course.content.splice(step, 1)
    },

    /**
     * Function delFile: delete file from state and database
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course file list
     * @param file file object to remove
     */
    delFile (
      state: {
        course: {
          files: Array<object>
        }
      },
      file: {
        name: string,
        container: string
      }) {
      const idx = state.course.files.indexOf(file)
      // console.log(`${file.name} hat Stelle ${idx}`)
      state.course.files.splice(idx, 1)
      http.delete(`storage/${file.container}/files/${file.name}`)
        .catch((err) => {
          console.error(err)
        })
    },

    /**
     * function flagFlaggableElement(): mutate flagged boolean of element
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param elem the flaggable element to be mutated
     */
    flagFlaggableElement (
      state: {
        course: {
          content: Array<object>
        }
      },
      elem: {
        id: string,
        flagged: boolean
      }) {
      // const checkAndFlag = (o: any) => {
      //   console.log(`we flag ${o}`)
      //   if (object.prototype.hasOwnProperty.call(o, 'flagged')) {
      //     o.flagged = true
      //     console.log('successs!!!')
      //     return true
      //   } else {
      //     return false
      //   }
      // }
      // console.log('trying to flag: ', elem.id, ', flagged status: ', elem.flagged )
      elem.flagged = true
      // console.log(state.course.content)
      // for (const el of state.course.content) {
      //   const vals = object.values(el.input)
      //   for (const c of vals) {
      //     console.log(c)
      //     if (typeof(c) === 'object') {
      //       if (Array.isArray(c)) {
      //         console.log(`${c} is an array!`)
      //         //@ts-ignore
      //         for (const d in c) {
      //           console.log(d)
      //           if(checkAndFlag(d)) {
      //             break
      //           }
      //         }
      //       } else {
      //         if (checkAndFlag(c)) {
      //           break
      //         }
      //       }
      //     }
      //   }
      // }
    },

    /**
     * Function renameCourse: rename a Course
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course
     * @param newName string for new name
     */
    renameCourse (
      state: {
        course: {
          name: string
        }
      },
      newName: string
    ) {
      state.course.name = newName
    },

    /**
     * Function setCourse: set state to given course
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     * @param state contains course
     * @param courseData course object
     */
    setCourse (
      state: {
        course: object
      },
      courseData: object
    ) {
      state.course = courseData
    },

    /**
     * Function setCourseList: set list of courses in store
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains courseList array
     * @param courseList array of course objects
     */
    setCourseList (
      state: {
        courseList: object[]
      },
      courseList: object[]
    ) {
      state.courseList = courseList
    },

    /**
     * Function to replace properties attribute for course in course list
     *
     * Author: pj
     *
     * Last Updated: February 20, 2022
     *
     * @param state course list array
     * @param data new properties to be set
     */
    setCourseListProperties (
      state: {
        courseList: Array<{
          courseId: string,
          properties: object
        }> },
      data: {
        course: {
          courseId: string
        },
        prefs: object
      }
    ) {
      console.log('course list before: ', state.courseList)
      const listEntry = state.courseList.find(x => x.courseId === data.course.courseId)
      if (listEntry) { // update properties of listEntry if present
        console.log('updating properties of course in course list')
        console.log('entry: ', listEntry)
        console.log('data: ', data)
        listEntry.properties = {
          ...listEntry.properties,
          ...data.prefs
        }
        console.log('updated entry: ', listEntry)
      }
      console.log('course list after: ', state.courseList)
    },

    /**
     * Function setCourseUpdated: set courseUpdated to true
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     * @param state contains boolean courseUpdated
     */
    setCourseUpdated (state: { courseUpdated: boolean }) {
      state.courseUpdated = true
    },

    /**
     * Function unsetCourseUpdated: set courseUpdated to false
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     * @param state contains boolean courseUpdated
     */
    unsetCourseUpdated (state: { courseUpdated: boolean }) {
      state.courseUpdated = false
    },

    /**
     * Function updateCourseFiles: updates list of course files
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course object
     * @param courseFiles array of files
     */
    updateCourseFiles (
      state: {
        course: {
          files: Array<object>
        }
      },
      courseFiles: Array<object>
    ) {
      // console.log('Start updating Course Files in Store')
      const ids = new Set(state.course.files.map((d: {name: string}) => d.name))
      state.course.files = [
        ...state.course.files,
        ...courseFiles.filter((d: {name: string}) => !ids.has(d.name))
      ] // add new files to state.course.files
    },

    /**
     * Function updateCourseNav: replace content with input content array
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course, content
     * @param courseData new content array
     */
    updateCourseNav (
      state: {
        course: {
          content: Array<object>
        }
      },
      courseData: Array<object>
    ) {
      state.course.content = courseData
    },

    /**
     * Function updateStep: update content block at given index
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     * @param state contains course, content
     * @param stepData contains step index, new content object
     */
    updateStep (
      state: {
        course: {
          content: Array<object>
        }
      },
      stepData: {
        step: number,
        updatedStep: object
      }) {
      // console.log(data.step)
      // console.log(data.updatedStep)
      state.course.content[stepData.step] = {
        ...state.course.content[stepData.step],
        ...stepData.updatedStep
      }
    }

  },

  actions: {
    /**
     * function createCourse: create storage and course in backend
     *
     * Author: cmc
     *
     * Last Updated: April 14, 2022
     * @param state state variables
     * @param data course properties
     */
    createCourse (state, data: {
      name: string,
      category: string,
      userId: number,
      enrollment?: boolean
    }) {
      const storageId = uuidv4()
      return new Promise((resolve, reject) => {
        /* create storage */
        http.post('storage', {
          name: storageId
        })
          .then(() => {
            /* storage created, create course */
            http.post('courses', {
              name: data.name,
              category: data.category,
              authorId: data.userId,
              storageId: storageId,
              properties: { enrollment: data.enrollment }
            })
              .then(() => {
                resolve('Course successfully created')
              })
              .catch((err) => {
                reject(new Error(err)) // error creating course
              })
          })
          .catch((err) => {
            reject(new Error(err)) // error creating storage
          })
      })
    },

    /**
     * Function copyCourse: copy course and all the files
     *  FIXME: Files are not copied
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0
     * @param newName
     */
    copyCourse (
      { commit, state, rootState },
      newName: string
    ) {
      console.log('Original Course Files:', state.course.files)
      // console.log(rootState)
      // create new course object
      const newId = uuidv4()
      const newStorage = uuidv4()
      const copiedCourse = {
        ...state.course,
        name: newName,
        createDate: Date.now(),
        lastChanged: Date.now(),
        courseId: newId,
        storageId: newStorage,
        files: []
      }

      // create new Storage //TODO: fix here
      // const store = http.post('storage', { name: newStorage })
      // const fileReqs = []
      // const newFiles = []
      // store

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
      // .catch( err => {
      //   // creating new storage failed, return reject
      //   return new Promise((resolve, reject) => {
      //     reject(err)
      //   })
      // })

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

      return new Promise((resolve, reject) => {
        // console.log('again: this course should be posted ', copiedCourse)
        // FIXME: filelist is not pushed in database
        http.post('courses', copiedCourse)
          .then((resp) => {
            // console.log('This response we got: ', resp)
            resolve(resp.data)
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
          .catch((err) => { reject(err) })
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
     * Function deleteCourse: delete Course, remove all files
     *   and storage
     *
     * Author: cmc
     *
     * Last Changed: January 27, 2022
     *
     * @param state contains course object
     */
    deleteCourse ({ state }) {
      const cid = state.course.courseId
      const sid = state.course.storageId
      const files = state.course.files

      return new Promise((resolve, reject) => {
        // collect delete requests for all course files
        const requests = []
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
              .then(() => console.log('Container removed!'))
              .catch((err) => {
                // console.error(err)
                reject(err)
              })
          })

        // delete course itself
        http.delete(`courses/${cid}`)
          .then(() => {
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
     * Function courseFetch: load course into store
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     * @param param0 state variables
     * @param name course identifier
     * @returns Promise to load course object, null if already being loaded
     */
    fetchCourse (
      { commit, dispatch, state, rootState },
      name: string
    ) {
      if (rootState.note.busy) return null
      return new Promise((resolve, reject) => {
        commit('setBusy', true)
        console.log(name)
        // get course ID from name
        http.get(`courses/getCourseId?courseName=${name}`)
          .then(({ data }) => {
            /* fetch course */
            http.get(`courses/${data.courseId}`)
              .then(({ data }) => {
                // console.log(data)
                commit('setCourse', data)
                commit('setCourseUpdated')
                commit('setCourseContentAndNav', data)
                dispatch('getCourseFlags', state.course.courseId)
                resolve('Course loaded')
              })
              .catch(err => {
                console.error(err)
                reject(err)
              })
          })
          .catch(() => {
            // course name not found -> fallback to slug lookup TODO: remove this fallback after switching to new back end
            // console.error(err)
            http.get('courses')
              .then(({ data }) => {
                console.log('slug lookup')
                console.log(data)
                const course = data.find((course: any) => slugify(course.name) === name)
                if (course) {
                  commit('setCourse', course)
                  commit('setCourseUpdated')
                  commit('setCourseContentAndNav', course)
                  dispatch('getCourseFlags', state.course.courseId)
                  resolve('Course loaded')
                } else {
                  reject(new Error('Course not found'))
                }
              })
              .catch(err => {
                console.error(err)
                reject(err)
              })
          })
          .finally(() => commit('setBusy', false))
      })
    },

    /**
     * Function fetchCourseList: get list of courses
     *
     * Author: cmc
     *
     * Last Updated: October 19, 2022
     *
     * @param param0 state variables
     */
    fetchCourseList (
      { commit, state }
    ) {
      commit('setBusy', true)
      http.get('courses')
        .then(({ data }) => {
          for (const courseObject of data) {
            const listData = {
              category: courseObject.category,
              name: courseObject.name,
              slug: slugify(courseObject.name), // TODO: handle arabic & kurdish
              properties: courseObject.properties,
              courseId: courseObject.courseId,
              author: courseObject.authorId
            }
            courseObject.content.forEach(block => {
              if (courseObject.properties.simpleLanguage) { // check if course is completely available in simple language
                // TODO:
                // following is duplicate of checkForSimpleLanguage() in
                // @/views/course-edit-tools/course-preferences.vue
                // might be refactored to reduce redundancy
                courseObject.properties.simple = true // set properties.simple true first

                const hasSimple = (elem) => { // check if all keys have a simple language version
                  return Object.prototype.hasOwnProperty.call(elem, 'simple')
                    ? elem.simple !== '' // if simple language version exists, check if it is not empty
                    : Object.prototype.hasOwnProperty.call(elem, 'ops') // if simple language version does not exist, check if it is a quill object
                }
                const iterInput = Object.values(block.input) // values of content input array

                for (const elem of iterInput) { // for each element in input array
                  if (typeof (elem) === 'object') { // if element is an object
                    if (Array.isArray(elem)) { // if it's an array, descent into array
                      for (const iter of elem) { // for each element in array
                        if (iter) {
                          if (!hasSimple(iter)) { // element does not have a simple language version
                            courseObject.properties.simple = false
                            break // we can stop looking further
                          }
                        }
                      }
                    } else if (elem) { // element is an object
                      if (!hasSimple(elem)) { // element does not have a simple language version
                        courseObject.properties.simple = false
                        break // we can stop looking further
                      }
                    }
                  }
                }
              }
              switch (block.name) { // check content for text and video
                // TODO: what about audio? obsolete b/c screenreaders?
                case 'laya-plyr':
                  listData.properties.video = true
                  break
                case 'laya-wysiwyg':
                  listData.properties.text = true
                  break
                // commented out b/c ableplayer is disabled, 2022-10-19
                // case 'laya-ableplayer':
                //   listData.properties.video = true
                //   break
                case 'laya-dialog':
                  listData.properties.text = true
                  break
              }
            })
            if (!state.courseList.some( // add to course list if not present
              (e: { courseId: String }) => e.courseId === listData.courseId)
            ) {
              commit('courseListAppend', listData)
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => { commit('setBusy', false) })
    },

    /**
     * Function storeCourse: persist changes to store in database
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     * @returns Promise to save changes
     */
    storeCourse (
      { commit, state }
    ) {
      return new Promise((resolve, reject) => {
        http.patch(`courses/${state.course.courseId}`, {
          content: state.course.content,
          lastChanged: Date.now(),
          properties: state.course.properties
        })
          .catch(err => {
            // console.error('Failed storing course content:', err)
            reject(err)
          })
          .finally(() => {
            commit('unsetCourseUpdated')
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
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     */
    storeCourseFiles ({ state }) {
      const newFileData = {
        files: state.course.files,
        lastChanged: Date.now()
      }
      // console.log(newFileData)
      return new Promise((resolve, reject) => {
        http.patch(
          `courses/${state.course.courseId}`,
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
    },

    /**
     * function updateCourse: update course in database
     *
     * Auhtor: cmc
     *
     * Last Updated: August 9, 2022
     * @param state state variables
     */
    updateCourse ({ state }) {
      return new Promise((resolve, reject) => {
        http.patch(
          `courses/${state.course.courseId}`,
          {
            ...state.course,
            lastChanged: Date.now()
          }
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
    },

    /**
     * Function updateRenamedCourse: rename old course
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     * @returns Promise to update renamed course
     */
    updateRenamedCourse (
      { state, commit }: {
        state: {
          course: {
            courseId: string,
            name: string
          }
        },
        commit: Function
      }
    ) {
      const newNameData = {
        lastChanged: Date.now(),
        name: state.course.name
      }

      return new Promise((resolve, reject) => {
        http.patch(
      `courses/${state.course.courseId}`,
      newNameData
        )
          .then(() => {
            commit('courseListUpdate', state.course.courseId)
            resolve('Updated Course name!')
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
