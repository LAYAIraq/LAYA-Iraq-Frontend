import http from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { slugify } from '@/mixins/general/course-structure'
import { LegacyContentBlock } from '@/mixins/types/course-structure'

export default {
  state: {
    course: {},
    courseUpdated: false
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
      authorName: string,
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
     * function courseLanguage: return course language to locale
     *  Author: nv
     *  Last Updated: October 29, 2021
     * @param state contains language
     */
    courseLanguage (state: {
      course: {
        language: string
      }
    }) {
      return state.course.language
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
     * function courseAbstractChange: update course abstract
     * Author: nv
     *Since: v1.3.0
     */
    courseAbstractChange (
      state: {
        course: {
          abstract: string
        }
      },
      newAbstract: string
    ) {
      state.course.abstract = newAbstract
    },

    /**
     * function courseAuthorNameChange: update course author name
     * Author: nv
     *Since: v1.3.0
     */
    courseAuthorNameChange (
      state: {
        course: {
          authorName: string
        }
      },
      newAuthorName: string
    ) {
      state.course.authorName = newAuthorName
    },

    /**
     * function courseCategoryChange: update course category
     *
     * Author: cmc
     *
     * Last Updated: August 8, 2022
     * @param state contains course object
     * @param newCategory new category
     */
    courseCategoryChange (
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
     * function courseLanguageChange: update course category
     * Author: nv
     * Since: v1.3.0
     * @param state contains course object
     * @param newLanguage new language
     */
    courseLanguageChange (
      state: {
        course: {
          language: string
        }
      },
      newLanguage: string
    ) {
      state.course.language = newLanguage
    },

    /**
     * function courseKeywordsChange: update course keywords
     * Author: nv
     *Since: v1.3.0
     */
    courseKeywordsChange (
      state: {
        course: {
          keywords: string
        }
      },
      newKeywords: string
    ) {
      state.course.keywords = newKeywords
    },

    /**
     * function coursePropertiesChange: update course properties
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state contains course.properties object
     * @param properties new properties
     */
    coursePropertiesChange (
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
     * @function coursePropertyCheck checks all course blocks for text and video content, sets properties accordingly
     * @author cmc
     * @since v1.3.0
     * @param state contains course object
     */
    coursePropertyCheck (state: {
      course: {
        content: LegacyContentBlock[],
        properties: {
          text: boolean,
          video: boolean
        }
      }
    }) {
      state.course.content.forEach(block => {
        switch (block.name) { // check content for text and video
          // TODO: what about audio? obsolete b/c screenreaders?
          case 'video-player':
            state.course.properties.video = true
            break
          case 'free-text':
            state.course.properties.text = true
            break
          // commented out b/c ableplayer is disabled, 2022-10-19
          // case 'laya-ableplayer':
          //   listData.properties.video = true
          //   break
          case 'button-navigation':
            state.course.properties.text = true
            break
        }
      })
    },

    /**
     * Function courseRename: rename a Course
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains course
     * @param newName string for new name
     */
    courseRename (
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
     * Function courseSet: set state to given course
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     * @param state contains course
     * @param courseData course object
     */
    courseSet (
      state: {
        course: object
      },
      courseData: object
    ) {
      state.course = courseData
    },

    /**
     * @function courseSimpleLanguageCheck checks all course blocks for existing simple language alternatives
     * @author cmc
     * @since v1.3.0
     * @param state contains course object
     */
    courseSimpleLanguageCheck (state: {
      course: {
        content: LegacyContentBlock[],
        properties: {
          simpleLanguage: boolean,
          simple: boolean
        }
      }
    }) { // checks all course blocks for simple language
      state.course.content.forEach(block => {
        if (state.course.properties.simpleLanguage) { // check if course is completely available in simple language
          // TODO:
          // following is duplicate of checkForSimpleLanguage() in
          // @/views/course-edit-tools/course-preferences.vue
          // might be refactored to reduce redundancy
          state.course.properties.simple = true // set properties.simple true first

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
                      state.course.properties.simple = false
                      break // we can stop looking further
                    }
                  }
                }
              } else if (elem) { // element is an object
                if (!hasSimple(elem)) { // element does not have a simple language version
                  state.course.properties.simple = false
                  break // we can stop looking further
                }
              }
            }
          }
        }
      })
    },

    /**
     * Function courseUpdatedSet: set courseUpdated to given value
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     * @param state contains boolean courseUpdated
     * @param value boolean value
     */
    courseUpdatedSet (state: { courseUpdated: boolean }, value: boolean) {
      state.courseUpdated = value
    }
  },

  actions: {
    /**
     * function courseCreate: create storage and course in backend
     *
     * Author: cmc
     *
     * Last Updated: April 14, 2022
     * @param state state variables
     * @param data course properties
     */
    courseCreate (state, data: {
      name: string,
      language: string,
      authorName: string,
      category: string,
      abstract: string,
      keywords: string,
      userId: number,
      enrollment?: boolean
    }) {
      const storageId = uuidv4()
      return new Promise((resolve, reject) => {
        /* create storage */
        http.post('storage', { // TODO: move to store action in course-files module
          name: storageId
        })
          .then(() => {
            /* storage created, create course */
            http.post('courses', {
              name: data.name,
              category: data.category,
              language: data.language,
              abstract: data.abstract,
              keywords: data.keywords,
              authorName: data.authorName,
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
     * Function courseCopy: copy course and all the files
     *  FIXME: Files are not copied
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0
     * @param newName
     */
    courseCopy (
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
     * Function courseDelete: delete Course, remove all files
     *   and storage
     *
     * Author: cmc
     *
     * Last Changed: January 27, 2022
     *
     * @param state contains course object
     * @param dispatch to call other actions
     * @returns Promise to delete course
     */
    courseDelete ({ state, dispatch }) {
      return new Promise((resolve, reject) => {
        // fire action to delete course files
        dispatch('courseFilesDelete')
          .then( // delete course itself
            http.delete(`courses/${state.course.courseId}`)
              .then(() => {
                // console.log("REMOVED COURSE", cid)
                resolve('all good')
              })
              .catch(err => {
                // console.error('Failed to delete course:', err)
                reject(err)
              })
          )
          .catch(err => reject(err))
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
    courseFetch (
      { commit, dispatch, state, getters },
      name: string
    ) {
      if (getters.storeBusy) return null
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
                commit('courseSet', data)
                commit('courseUpdatedSet', true)
                commit('courseFilesSet', data.files)
                commit('setCourseContentAndNav', data)
                dispatch('courseFlagsFetch', state.course.courseId)
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
                  commit('courseSet', course)
                  commit('courseUpdatedSet', true)
                  commit('setCourseContentAndNav', course)
                  dispatch('courseFlagsFetch', state.course.courseId)
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
     * function courseUpdate: update course in database
     *
     * Auhtor: cmc
     *
     * Last Updated: August 9, 2022
     * @param commit to commit mutations
     * @param state state variables
     */
    courseUpdate ({ commit, state }) {
      // check properties and language
      commit('courseSimpleLanguageCheck')
      commit('coursePropertyCheck')
      return new Promise((resolve, reject) => {
        http.patch(
          `courses/${state.course.courseId}`,
          {
            ...state.course,
            lastChanged: Date.now() // TODO: remove this line after switching to new back end
          }
        )
          .catch(err => {
            // console.error('Failed storing course content:', err)
            reject(err)
          })
          .finally(() => {
            commit('courseUpdatedSet', false)
            resolve('Course updated successfully')
          })
      })
    },

    /**
     * function courseUpdateLanguage: persist locale to backend
     * Author: nv
     * Since: v1.3.0
     * @param param0 contains state variables
     * @param langData contains course language
     */
    courseUpdateLanguage (
      { commit, state }: {
        state: {
          course: {
            language: string,
            courseId: string
          }
        },
        commit: Function
      }) {
      const langData = {
        language: state.course.language
      }
      console.log('update course language in course.ts')
      return new Promise((resolve, reject) => {
        http.patch(
        `/courses/${state.course.courseId}`, langData
        ).then(() => {
          commit('courseLanguageChange', langData.language)
          resolve('Updated Course Language!')
        })
          .catch((err) => {
            reject(err)
          })
      })
    },

    /**
     * Function courseUpdateRename: rename old course
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 state variables
     * @returns Promise to update renamed course
     */
    courseUpdateRename (
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
