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
  CourseNavigationItem,
  LegacyContentBlock,
  LegacyContentInput,
  LegacyCourse, CourseNavigationItemBlock
} from '@/mixins/types/course-structure'
import {
  coursePathsGet,
  courseStructureDescent,
  legacyContentFollowTransform,
  legacyContentStepsTransform,
  slugify, contentIdGet
} from '@/mixins/general/course-structure'
import { stripKey } from '@/mixins/general/helpers'
import { v4 as uuidv4 } from 'uuid'
import http, { AxiosResponse } from 'axios'
import Vue from 'vue'

export default {

  state: {
    courseContent: {},
    courseContentFollowMap: {},
    courseChapters: [],
    courseChapterNames: {},
    courseRoutes: []
  },

  getters: {
    courseChapters: (state: { courseChapters: object[] }) => state.courseChapters,
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
    courseNav: (state: { courseStart: string, courseChapters: object[] }) => {
      return {
        start: state.courseStart,
        structure: state.courseChapters
      }
    },
    courseRoutes: (state: { courseRoutes: any }) => state.courseRoutes,
    courseStart: (state: { courseChapters: CourseNavigationItem[] }) => contentIdGet(state.courseChapters, 'first'),
    courseEnd: (state: { courseChapters: CourseNavigationItem[] }) => contentIdGet(state.courseChapters, 'last')
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
        courseChapters: CourseNavigationItem[],
        courseRoutes: any
      },
      course: Course
    ) {
      [state.courseContent, state.courseRoutes] = courseStructureDescent(
        course.chapters,
        course.properties ? course.properties.showSingleSubChapterTitleSlug : null
      )
      state.courseChapters = course.chapters
      state.courseStart = course.start
    },

    courseContentAdd (state: { courseContent: { [id: string]: ContentBlock }, courseChapters: any[] }, content: any) {
      const id = uuidv4().split('-')[0]
      const newContent = { ...content, id }
      state.courseContent[id] = newContent
      state.courseChapters.push(newContent)
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
      if (state.courseContent[id] && property && value) { // only update if content block exists and property and value are defined
        Vue.set(state.courseContent[id], property, value)
      }
    },

    courseContentRemove (state: { courseContent: any }, id: string) {
      state.courseContent = stripKey(state.courseContent, id)
    },

    courseChaptersSet (state: { courseChapters: CourseNavigationItem[] }, chapters: CourseNavigationItem[]) {
      if (chapters) {
        Vue.set(state, 'courseChapters', chapters)
      }
    },

    courseChapterAdd (state: { courseChapters: CourseNavigationItem[], courseStart: string }, chapter: CourseNavigationItemBlock) {
      if (state.courseChapters.length === 0) {
        Vue.set(state, 'courseStart', chapter.id)
      }
      state.courseChapters.push(chapter)
    },

    courseRoutesUpdate (state: { courseChapters: any, courseRoutes: any }) {
      Vue.set(state, 'courseRoutes', coursePathsGet(state.courseChapters))
    },

    /**
     * @description Set the course content when loading a course from old backend
     * @param state Vuex state
     * @param course LegacyCourse object
     */
    setCourseContentAndNav (
      state: {
        courseContent: any,
        courseContentFollowMap: any,
        courseRoutes: any,
        courseStart: any,
        courseChapters: any
      },
      course: LegacyCourse
    ) {
      state.courseChapters = []
      state.courseContent = {}
      state.courseContentFollowMap = {}
      for (const block of course.content) {
        const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
        const i = course.content.indexOf(block)
        state.courseContent[blockId] = { ...block.input, name: block.name, id: blockId } // this is analogous to the new course structure
        state.courseContentFollowMap[blockId] = [] // index of block in content array for legacy content
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
      state.courseChapters.forEach((chapter: CourseNavigationItemBlock) => {
        state.courseContentFollowMap[chapter.id] = chapter.follow
      })
      // traverse course content and create routes
      state.courseRoutes = coursePathsGet(state.courseChapters)
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
    }
  }
}
