import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import SampleCourseChaptersContent from '../../mocks/sample-course-chapters-content.json'
import axios from 'axios'
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
      courseRoutes: []
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
      expect(state.courseNav.structure.length).toBe(SampleCourse.content.length)
      state.courseNav.structure.forEach((item, index) => { // check that the courseNav.structure array is in the same order as the course content
        expect(state.courseContent[item.id]).toStrictEqual(
          expect.objectContaining(Course.content[index].input)
        )
      })
    })

    it('sets the start property in courseNav', () => {
      expect(state.courseContent[state.courseNav.start]).toStrictEqual(
        expect.objectContaining(SampleCourse.content[0].input)
      )
    })

    it('saves a slug for each course block', () => {
      state.courseNav.structure.forEach((item: any) => {
        expect(item.slug).toBeTruthy()
      })
    })
  })

  describe('parseCourseNav', () => {
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      if (/course-content\/[a-z0-9-]+/.test(url)) {
        const id = url.split('/').pop()
        return Promise.resolve({ data: SampleCourseChaptersContent[id] })
      } else {
        return Promise.reject(new Error('not found'))
      }
    })

    beforeAll(() => {
      state.courseNav = {}
      state.courseContent = {}
      mutations.parseChapters(state, SampleCourseChapters)
    })

    it('creates an entry in courseContent for each course block', () => {
      expect(Object.keys(state.courseContent).length).toBe(5)
    })
  })
})
