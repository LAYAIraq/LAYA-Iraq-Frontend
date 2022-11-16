/**
 * @fileOverview Vuex module for course content, esp. course navigation
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */
// @ts-ignore
import {
  ContentBlock,
  Course,
  CourseNavigation,
  CourseNavigationItem,
  CourseNavigationStructure,
  LegacyContentBlock,
  LegacyContentInput,
  LegacyCourse,
  breakSteps,
  getPaths,
  slugify,
  traverseCourseChapters
} from '@/misc/course-structure'
import { stripKey } from '@/misc/utils.js'
import { v4 as uuidv4 } from 'uuid'
import http, { AxiosResponse } from 'axios'

export default {

  state: {
    courseContent: {},
    courseIds: {},
    courseStart: '',
    courseChapters: {},
    courseRoutes: []
  },

  getters: {
    courseContent: (state: { courseContent: { [id: string]: CourseNavigationItem } }) => state.courseContent,
    courseNav: (state) => {
      return {
        start: state.courseStart,
        structure: state.courseChapters
      }
    },
    courseRoutes: (state: { courseRoutes: any }) => state.courseRoutes,
    courseContentIdRouteMap: (state: { courseRoutes: any }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        if (!(map[id] === '')) {
          map[id] = route
        }
      }
      return map
    },
    courseContentIndexIdMap: (state: { courseIds: { [id: string]: number } }) => state.courseIds,
    courseContentRouteIdMap: (state: { courseRoutes: any }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        map[route.substring(1)] = id
      }
      return map
    },
    courseContentSlugIdMap: (state: { courseRoutes: [[route: string, id: string]] }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        map[route.split('/').pop()] = id
      }
      return map
    }
  },

  mutations: {
    /**
     * @description copy start, chapter from new back end course, destructure
     *   course chapters into courseContent
     * @param state - state variables
     * @param course - new back end course
     */
    courseStructureDestructure (
      state: {
        courseContent: { },
        courseIds: { [id: string]: number },
        courseStart: string,
        courseChapters: CourseNavigationStructure,
        courseRoutes: any
      },
      course: Course
    ) {
      [state.courseContent, state.courseRoutes] = traverseCourseChapters(course.chapters)
      state.courseChapters = course.chapters
      state.courseStart = course.start
    },

    courseContentSet (state: { courseContent: { [id: string]: ContentBlock } }, block: ContentBlock) {
      state.courseContent[block.id] = block
    },

    courseContentRemove (state: { courseContent: object }, id: string) {
      state.courseContent = stripKey(id, state.courseContent)
    },

    /**
     * @description Set the course content when loading a course from old backend
     * @param state Vuex state
     * @param course LegacyCourse object
     */
    setCourseContentAndNav (
      state: {
        courseContent: any,
        courseIds: any,
        courseRoutes: any,
        courseStart: any,
        courseChapters: any
      },
      course: LegacyCourse
    ) {
      state.courseChapters = []
      for (const block of course.content) {
        const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
        const i = course.content.indexOf(block)
        state.courseContent[blockId] = { ...block.input, name: block.name, id: blockId } // this is analogous to the new course structure
        state.courseIds[i] = blockId // index of block in content array for legacy content
        state.courseChapters.push({
          id: blockId,
          slug: slugify(block.input.title.text),
          follow: breakSteps(block)
        })
        if (i === 0) {
          state.courseStart = blockId
        }
      }
      // traverse course content and create routes
      state.courseRoutes = getPaths(state.courseChapters, state.courseStart)
    }
  },

  actions: {
    /**
     * @description gets a course content from back end and calls
     *  setCourseContent mutation
     * @param commit - commit function
     * @param contentId - id of content to get
     */
    courseContentFetch ({ commit }, contentId: string) {
      return new Promise((resolve, reject) => {
        http.get(`course-content/${contentId}`)
          .then((response: AxiosResponse<ContentBlock>) => {
            commit('setCourseContent', response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * @description updates a course content block in back end
     * @param commit - commit function
     * @param verb - the http request verb to use
     * @param block - block to update
     */
    courseContentPersist ({ commit }, verb: string, block: ContentBlock) {
      commit('setBusy', true)
      return new Promise((resolve, reject) => {
        http[verb](`course-content/${block.id}`, block)
          .then((response: AxiosResponse<ContentBlock>) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            commit('setBusy', false)
          })
      })
    },

    /**
     * @description gets a course from new back end and calls
     *   courseStructureDestructure mutation
     *  @param commit - commit function
     *  @param courseIdentifier - identifier for course, can be id or slug
     */
    courseFetch ({ commit }, courseIdentifier: string) { // TODO: move to course module
      return new Promise((resolve, reject) => {
        http.get(`courses/${courseIdentifier}`)
          .then((response: AxiosResponse<Course>) => {
            commit('courseStructureDestructure', response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}
