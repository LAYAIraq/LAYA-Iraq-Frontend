import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'

describe('store module course-content mutations', () => {
  let state
  const emptyState = {
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
  const mutations = courseContent.mutations
  const Course = { ...SampleCourse, properties: {}, lastChanged: Date.now() }

  describe('setCourseContentAndNav', () => {
    beforeAll(() => {
      state = emptyState
      mutations.setCourseContentAndNav(state, Course)
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

    it('saves a follow property for each course block', () => {
      state.courseNav.structure.forEach((item: any) => {
        expect(item.follow).toBeTruthy()
      })
    })

    it('creates a courseRoutes array', () => {
      expect(state.courseRoutes.length).toBeGreaterThan(0)
    })
  })

  describe('courseContentSet', () => {
    beforeAll(() => {
      state = emptyState
    })

    it('adds a new block to courseContent', () => {
      const block = {
        id: 'test',
        title: {
          text: 'Test'
        },
        name: 'some-component'
      }
      mutations.courseContentSet(state, block)
      expect(state.courseContent.test).toStrictEqual(block)
    })

    it('updates an existing block in courseContent', () => { // only run in suite
      expect(state.courseContent.test.title.text).toBe('Test') // will fail here if run alone
      const block = {
        id: 'test',
        title: {
          text: 'Updated Test Title'
        },
        name: 'different-component'
      }
      mutations.courseContentSet(state, block)
      expect(state.courseContent.test).toStrictEqual(block)
    })
  })

  describe('courseContentRemove', () => {
    beforeAll(() => {
      state = {
        courseContent: {
          test: {
            id: 'test'
          }
        }
      }
    })

    it('removes a block from courseContent', () => {
      mutations.courseContentRemove(state, 'test')
      expect(state.courseContent.test).toBeUndefined()
    })
  })

  describe('courseStructureDestructure', () => {
    beforeAll(() => {
      state = emptyState
      mutations.courseStructureDestructure(state, SampleCourseChapters)
    })
    it.skip('creates an entry in courseContent for each course block', () => { // skipped b/c this is function in course-structure.ts
      expect(Object.keys(state.courseContent).length).toBe(5)
    })

    it('sets the start property', () => {
      expect(state.courseStart).toBe('e1ns')
    })

    it('copies the chapters in store', () => {
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })

    it('creates an entry in courseRoutes for each course block', () => {
      expect(state.courseRoutes.length).toBeGreaterThanOrEqual(5)
    })

    it.skip('sets start property in courseRoutes correctly', () => { // skipped b/c this is function in course-structure.ts
      expect(state.courseRoutes).toContainEqual(['', 'e1ns'])
    })
  })

  describe('courseContentRouteId', () => {
    const getters = courseContent.getters
    beforeAll(() => {
      state = emptyState
      mutations.courseStructureDestructure(state, SampleCourseChapters)
    })

    it('returns the id of the block with the given route', () => {
      expect(getters.courseContentPathId(state)('')).toBe('e1ns')
      expect(getters.courseContentPathId(state)('video/video')).toBe('zw31')
    })
  })
})
