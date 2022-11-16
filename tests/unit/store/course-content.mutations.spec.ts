import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
// import SampleCourseChaptersContent from '../../mocks/sample-course-chapters-content.json'
import 'regenerator-runtime/runtime'

describe('store module course-content mutations', () => {
  let state
  const mutations = courseContent.mutations
  const Course = { ...SampleCourse, properties: {}, lastChanged: Date.now() }
  beforeAll(() => {
    state = {
      courseContent: {},
      courseIds: {},
      courseNav: {
        start: null,
        structure: []
      },
      courseChapters: {},
      courseRoutes: [],
      courseStart: ''
    }
  })

  describe('setCourseContentAndNav', () => {
    beforeAll(() => {
      mutations.setCourseContentAndNav(state, Course)
      console.log(state.courseContent)
    })
    it('creates an entry in courseContent for each course block', () => {
      expect(Object.keys(state.courseContent).length).toBe(SampleCourse.content.length)
    })

    it('creates an entry in courseIds for each course block', () => {
      expect(Object.keys(state.courseIds).length).toBe(SampleCourse.content.length)
    })

    it('recreates the content array in courseNav', () => {
      expect(state.courseChapters.length).toBe(SampleCourse.content.length)
      state.courseChapters.forEach((item, index) => { // check that the courseNav.structure array is in the same order as the course content
        expect(state.courseContent[item.id]).toStrictEqual(
          expect.objectContaining(Course.content[index].input)
        )
      })
    })

    it('sets the start property in courseNav', () => {
      expect(state.courseContent[state.courseStart]).toStrictEqual(
        expect.objectContaining(SampleCourse.content[0].input)
      )
    })

    it('saves a slug for each course block', () => {
      state.courseNav.structure.forEach((item: any) => {
        expect(item.slug).toBeTruthy()
      })
    })
  })

  describe('courseStructureDestructure', () => {
    beforeAll(() => {
      state.courseChapters = {}
      mutations.courseStructureDestructure(state, SampleCourseChapters)
    })
    it('creates an entry in courseContent for each course block', () => {
      expect(Object.keys(state.courseContent).length).toBe(5)
    })

    it('sets the start property', () => {
      expect(state.courseStart).toBe('e1ns')
    })

    it('copies the chapters in store', () => {
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })
  })
})
