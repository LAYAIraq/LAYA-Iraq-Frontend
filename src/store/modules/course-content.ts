/**
 * @fileOverview Vuex module for course content, esp. course navigation
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */
// @ts-ignore
import { ContentInput, LegacyContentBlock, CourseNavigation, breakSteps } from '@/misc/course-structure'
import { v4 as uuidv4 } from 'uuid'
export default {

  state: {
    courseContent: {},
    courseNav: {
      start: null,
      chapters: []
    }
  },

  mutations: {
    setCourseContent (
      // rootState: { content: LegacyContentBlock[] },
      state: { courseContent: any, courseNav: CourseNavigation },
      course: any
    ) {
      const content = course.content
      // console.log('setCourseContent', content)
      for (const block of content) {
        const blockId = uuidv4()
        const i = content.indexOf(block)
        // const block = content[i]
        state.courseContent[blockId] = { ...block.input, id: blockId, name: block.name }
        state.courseNav.chapters[i] = { id: blockId, follow: breakSteps(block) }
        if (i === 0) {
          state.courseNav.start = i
        }
      }
    }
  }
}
