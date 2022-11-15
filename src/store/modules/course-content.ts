/**
 * @fileOverview Vuex module for course content, esp. course navigation
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */
// @ts-ignore
import {
  Course,
  CourseNavigation,
  CourseNavigationItem,
  LegacyContentBlock,
  LegacyContentInput,
  LegacyCourse,
  breakSteps,
  getPaths,
  slugify
} from '@/misc/course-structure'
import { v4 as uuidv4 } from 'uuid'
export default {

  state: {
    courseContent: {},
    courseIds: {},
    courseNav: {
      start: null,
      structure: []
    },
    courseRoutes: []
  },

  getters: {
    courseContent: (state: { courseContent: { [id: string]: CourseNavigationItem } }) => state.courseContent,
    courseNav: (state: { courseNav: CourseNavigation }) => state.courseNav,
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
    // TODO: finish
    parseChapters (
      state: {
        courseContent: { },
        courseIds: { [id: string]: number },
        courseNav: CourseNavigation,
        courseRoutes: any
      },
      course: Course
    ) {
      state.courseNav.start = course.start
    },

    /**
     * @description Set the course content when loading a course from old backend
     * @param state Vuex state
     * @param course LegacyCourse object
     */
    setCourseContentAndNav (
      // rootState: { content: LegacyContentBlock[] },
      state: {
        courseContent: any,
        courseIds: any,
        courseNav: CourseNavigation,
        courseRoutes: any
      },
      course: LegacyCourse
    ) {
      // console.log('setCourseContentAndNav', content)
      for (const block of course.content) {
        const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
        const i = course.content.indexOf(block)
        // const block = content[i]
        state.courseContent[blockId] = { ...block.input, name: block.name, id: blockId } // this is analogous to the new course structure
        state.courseIds[i] = blockId // index of block in content array for legacy content
        // console.log('slug would be', slugify(block.input.title.text))
        // console.log('but we use only numbers for now')
        state.courseNav.structure[i] = {
          id: blockId,
          slug: slugify(block.input.title.text),
          follow: breakSteps(block)
        }
        if (i === 0) {
          state.courseNav.start = blockId
        }
      }
      // traverse course content and create routes
      state.courseRoutes = getPaths(state.courseNav)
    }
  }
}
