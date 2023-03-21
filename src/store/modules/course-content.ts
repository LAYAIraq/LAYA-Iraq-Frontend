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
  LegacyCourse
} from '@/misc/course-structure-types'
import {
  legacyContentStepsTransform,
  courseStructureDescent,
  coursePathsGet,
  slugify, legacyContentFollowTransform
} from '@/misc/course-structure-methods'
import { stripKey } from '@/misc/utils.js'
import { v4 as uuidv4 } from 'uuid'
import http, { AxiosResponse } from 'axios'
import Vue from 'vue'

export default {

  state: {
    courseContent: {},
    courseIds: {},
    courseStart: '',
    courseChapters: {},
    courseChapterNames: {},
    courseRoutes: []
  },

  getters: {
    courseChapterNames: (state: { courseChapterNames: { [id: string]: string } }) => state.courseChapterNames,
    courseContent: (state: { courseContent: { [id: string]: CourseNavigationItem } }) => state.courseContent,
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
    courseContentRouteIdMap: (state: { courseRoutes: any, courseStart: string }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        if (id === state.courseStart) {
          if (route === '') { // only add start route to map
            map[route] = id
          }
        } else {
          map[route] = id
        }
      }
      return map
    },
    /**
     * @description returns the id of a course block by its path
     * @param state the state of the store
     * @param path the path of the course block
     * @returns the id of the course block
     */
    courseContentPathId: (state: { courseRoutes: [[route: string, id: string]] }) => (path: string): string => {
      // console.log('finding id for path', path)
      if (path === undefined || path === null) {
        path = ''
      }
      const contentPath = state.courseRoutes.find(([route, _]) => route === path)
      // const res = contentPath ? contentPath[1] : null
      // console.log('found content path', res)
      return contentPath ? contentPath[1] : null
    },
    courseNav: (state) => {
      return {
        start: state.courseStart,
        structure: state.courseChapters
      }
    },
    courseRoutes: (state: { courseRoutes: any }) => state.courseRoutes
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
        courseChapterNames: { [id: string]: string },
        courseRoutes: any
      },
      course: Course
    ) {
      [state.courseContent, state.courseRoutes] = courseStructureDescent(
        course.chapters,
        course.start,
        course.properties ? course.properties.showSingleSubChapterTitleSlug : null
      )
      state.courseChapters = course.chapters
      state.courseStart = course.start
      state.courseChapterNames = course.chapterNames
    },

    courseContentAdd (state: { courseContent: { [id: string]: ContentBlock } }, content: any) {
      const newId = uuidv4().split('-')[0]
      state.courseContent[newId] = { ...content, id: newId }
    },

    courseContentSet (state: { courseContent: { [id: string]: ContentBlock } }, block: ContentBlock) {
      state.courseContent[block.id] = block
    },

    /**
     * @description update property of courseContent item - used for reactivity in frontend
     * @author cmc
     * @param state holds courseContent object
     * @param id identifier of content block to change
     * @param property identifier of property to change
     * @param value new value for property
     */
    courseContentSetProperty (
      state: { courseContent: { [id: string]: ContentBlock } }, { id, property, value }: { id: string, property: string, value: any }) {
      Vue.set(state.courseContent[id], property, value)
    },

    courseContentRemove (state: { courseContent: any }, id: string) {
      state.courseContent = stripKey(state.courseContent, id)
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
      state.courseContent = {}
      state.courseIds = {}
      for (const block of course.content) {
        const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
        const i = course.content.indexOf(block)
        state.courseContent[blockId] = { ...block.input, name: block.name, id: blockId } // this is analogous to the new course structure
        state.courseIds[i] = blockId // index of block in content array for legacy content
        state.courseChapters.push({
          id: blockId,
          slug: slugify(block.input.title.text),
          type: block.name,
          follow: legacyContentStepsTransform(block)
        })
        if (i === 0) {
          state.courseStart = blockId
        }
      }
      legacyContentFollowTransform(state.courseChapters)
      // traverse course content and create routes
      state.courseRoutes = coursePathsGet(state.courseChapters, state.courseStart)
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
            commit('courseContentSet', response.data)
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
      if (verb === 'get') {
        return Promise.reject(new Error('Cannot use GET verb for course content persist'))
      }
      commit('setBusy', true)
      return new Promise((resolve, reject) => {
        http[verb](`course-content/${block.id}`, block)
          .finally(() => {
            commit('setBusy', false)
          })
          .then((response: any) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
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
