/**
 * @fileOverview Vuex module for course content, esp. course navigation
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */
// @ts-ignore
import {
  CourseNavigationItem,
  LegacyContentBlock,
  CourseNavigation,
  breakSteps,
  LegacyContentInput,
  LegacyCourse, slugify, getPaths
} from '@/misc/course-structure'
import { v4 as uuidv4 } from 'uuid'
export default {

  state: {
    courseContent: {},
    courseNav: {
      start: null,
      structure: []
    },
    courseRoutes: []
  },

  getters: {
    courseContent: (state: { courseContent: CourseNavigationItem }) => state.courseContent,
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
    courseContentRouteIdMap: (state: { courseRoutes: any }) => {
      const map = {}
      for (const [route, id] of state.courseRoutes) {
        map[route] = id
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
    setCourseContent (
      // rootState: { content: LegacyContentBlock[] },
      state: {
        courseContent: any,
        courseNav: CourseNavigation,
        courseRoutes: any
      },
      course: LegacyCourse
    ) {
      // console.log('setCourseContent', content)
      for (const block of course.content) {
        const blockId = uuidv4().split('-')[0] // legacy content blocks have no id
        const i = course.content.indexOf(block)
        // const block = content[i]
        state.courseContent[blockId] = { ...block.input, name: block.name } // this is analogous to the new course structure
        console.log('slug would be', slugify(block.input.title.text))
        console.log('but we use only numbers for now')
        state.courseNav.structure[i] = {
          id: blockId,
          slug: i,
          follow: breakSteps(block)
        }
        if (i === 0) {
          state.courseNav.start = i
        }
      }
      // traverse course content and create routes
      state.courseRoutes = getPaths(state.courseNav)
    }
  }
}
