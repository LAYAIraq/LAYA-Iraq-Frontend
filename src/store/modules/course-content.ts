/**
 * @file Vuex module for course content, esp. course navigation
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */
import {
  ContentBlock,
  Course,
  CourseNavigationItem
} from '@/mixins/types/course-structure'
import {
  courseContentIdGet,
  coursePathsGet,
  courseChaptersCollect,
  courseDestructure
} from '@/mixins/general/course-structure'
import { stripKey } from '@/mixins/general/helpers'
import { legacyContentFollowTransform, legacyContentStepsTransform } from '@/mixins/general/legacy-content'
import { v4 as uuidv4 } from 'uuid'
import http, { AxiosResponse } from 'axios'
import Vue from 'vue'
import {
  chaptersCheck,
  chaptersExtractFollow,
  chapterSlugDuplicateAvoid,
  chapterSlugUpdate
} from '@/mixins/general/course-chapters'
import { slugify } from '@/mixins/general/slugs'

export default {

  state: {
    courseContent: {},
    courseChapters: [],
    courseChapterNames: {},
    courseRoutes: []
  },

  getters: {
    courseChapters: (state: { courseChapters: object[] }) => state.courseChapters,
    courseChaptersCoherent: (state: { courseChapters: CourseNavigationItem[] }) => chaptersCheck(
      { id: 'm41n', isChapter: true, chapterName: 'main', children: state.courseChapters, slug: 'main' }
    ),
    courseChapterNames: (state: { courseChapters: CourseNavigationItem[] }) => courseChaptersCollect(state.courseChapters),
    courseContent: (state: { courseContent: { [id: string]: CourseNavigationItem } }) => state.courseContent,
    courseContentFollowMap: (state: { courseChapters: CourseNavigationItem[] }): object => {
      const map = {}
      chaptersExtractFollow(state.courseChapters, map)
      return map
    },
    courseContentIdRouteMap: (state: { courseRoutes: any }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        if (!(map[id] === '')) {
          map[id] = route
        }
      }
      return map
    },
    courseContentRouteIdMap: (state: { courseRoutes: any }, getters: { courseStart: string }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        if (id === getters.courseStart) {
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
      if (path === undefined || path === null) {
        path = ''
      }
      const contentPath = state.courseRoutes.find(([route, _]) => route === path)
      return contentPath ? contentPath[1] : null
    },
    courseRoutes: (state: { courseRoutes: any }) => state.courseRoutes,
    courseStart: (state: { courseChapters: CourseNavigationItem[] }) => courseContentIdGet(state.courseChapters, 'first')
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
        courseContent: object,
        courseChapters: CourseNavigationItem[],
        courseRoutes: any[]
      },
      course: Course
    ) {
      [state.courseContent, state.courseRoutes] = courseDestructure(
        course.chapters,
        course.properties ? course.properties.showSingleSubChapterTitleSlug : null
      )
      state.courseChapters = course.chapters
    },

    /**
     * @description add new content block to state
     * @param state state variables
     * @param content new content block
     */
    courseContentAdd (
      state: {
        courseContent: { [id: string]: ContentBlock },
        courseChapters: any[]
      },
      content: ContentBlock) {
      state.courseContent[content.id] = content
    },
    /**
     * @description update content block by replacing it with given parameter
     * @param state store variables
     * @param block new content block data
     */
    courseContentSet (state: {
      courseChapters: any[],
      courseContent: { [id: string]: ContentBlock }
    }, block: ContentBlock) {
      state.courseContent[block.id] = block
      chapterSlugUpdate(state.courseChapters, block.id, block.title.text, block.name)
    },

    /**
     * @description update property of courseContent item - used for reactivity in frontend
     * @author cmc
     * @param state holds courseContent object
     * @param data id and property to change as well as changed value
     */
    courseContentSetProperty (
      state: {
        courseChapters: any[],
        courseContent: { [id: string]: ContentBlock }
      },
      { id, property, value }: { id: string, property: string, value: any }) {
      if (state.courseContent[id] && property && value) { // only update if content block exists and property and value are defined
        Vue.set(state.courseContent[id], property, value)
        if (property === 'title') { // trigger slug changes for corresponding navItem
          chapterSlugUpdate(state.courseChapters, id, value.text, state.courseContent[id].type)
        }
      }
    },

    /**
     * @description remove content block by given id
     * @param state
     * @param id
     */
    courseContentRemove (state: { courseContent: any }, id: string) {
      state.courseContent = stripKey(state.courseContent, id)
    },

    /**
     * @description set courseChapters in state
     * @param state store variables
     * @param chapters course navigation
     */
    courseChaptersSet (state: { courseChapters: CourseNavigationItem[] }, chapters: CourseNavigationItem[]) {
      if (chapters) {
        chapterSlugDuplicateAvoid(chapters) // remove duplicate slugs if there are any
        Vue.set(state, 'courseChapters', chapters)
      }
    },

    /**
     * @description adds chapter to courseChapters
     * @param state store
     * @param chapter chapter to add
     */
    courseChapterAdd (state: { courseChapters: CourseNavigationItem[], courseStart: string }, chapter: CourseNavigationItem) {
      state.courseChapters.push(chapter)
    },

    /**
     * @description recursively update follow properties
     * @param state contains courseChapters
     * @param data id and value for updated follow
     */
    courseChapterUpdateFollow (state: { courseChapters: CourseNavigationItem[]}, data: { id: string, value: string[] }) {
      // @description update follow if id is is arr, go deeper if not
      const updateOrDeeper = (arr: any) => {
        if (Array.isArray(arr)) {
          arr.forEach((el: any) => {
            if (el.isChapter) {
              updateOrDeeper(el.children)
            } else if (el.id === data.id) {
              Vue.set(el, 'follow', data.value)
            }
          })
        } else {
          if (arr.isChapter) {
            updateOrDeeper(arr.children)
          } else if (arr.id === data.id) {
            Vue.set(arr, 'follow', data.value)
          }
        }
      }
      if (data.value) {
        state.courseChapters.forEach((c: any) => updateOrDeeper(c))
      }
    },

    /**
     * @description update course routes to maintain correct mapping
     * @param state contains courseChapters, courseRoutes
     */
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
      course: any
    ) {
      state.courseChapters = []
      state.courseContent = {}
      if (!course.chapters && !course.courseContent) { // actual old course that have not been touched with new system
        for (const block of course.content) {
          const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
          state.courseContent[blockId] = { ...block.input, name: block.name, id: blockId } // this is analogous to the new course structure
          state.courseChapters.push({
            id: blockId,
            slug: slugify(block.input.title.text),
            type: block.name,
            follow: legacyContentStepsTransform(block)
          })
        }
        legacyContentFollowTransform(state.courseChapters)
      } else { // chapters and courseContent are defined, just set them to store
        state.courseContent = course.courseContent
        state.courseChapters = course.chapters
      }
      // traverse course chapters and create routes
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
