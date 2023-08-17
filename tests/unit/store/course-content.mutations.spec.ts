import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'

describe('store module course-content mutations', () => {
  let state: any
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

    it('creates an entry in courseContentFollowMap for each course block', () => {
      expect(Object.keys(state.courseContentFollowMap).length).toBe(SampleCourse.content.length)
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

  describe('courseChaptersSet', () => {
    beforeAll(() => {
      state = emptyState
      mutations.courseChaptersSet(state, SampleCourseChapters.chapters)
    })

    it('sets the courseChapters property', () => {
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })

    it('does nothing if chapters is not defined', () => {
      mutations.courseChaptersSet(state, null)
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })
  })

  describe('courseContentAdd', () => {
    beforeAll(() => {
      state = emptyState
    })

    it('adds a new block to courseContent', () => {
      const block = {
        title: {
          text: 'Test'
        },
        name: 'some-component'
      }
      mutations.courseContentAdd(state, block)
      expect(Object.values(state.courseContent)).toContainEqual(expect.objectContaining(block))
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

  describe('courseContentSetProperty', () => {
    beforeAll(() => {
      state = emptyState
      state.courseContent['test'] = {
        id: 'test',
        title: {
          text: 'Test'
        },
        name: 'some-component'
      }
    })
    it('sets a property of a courseContent block', () => {
      expect(state.courseContent['test']).toBeTruthy()
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: 'Test' })
      expect(state.courseContent.test.title).toBe('Test')
    })

    it('does not overwrite other properties', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: 'Updated Test Title' })
      expect(state.courseContent.test).toStrictEqual({
        id: 'test',
        title: 'Updated Test Title',
        name: 'some-component'
      })
    })

    it('does not do anything if id does not exist', () => {
      mutations.courseContentSetProperty(state, { id: 'test2', property: 'title', value: 'Test' })
      expect(state.courseContent['test2']).toBeUndefined()
    })

    it('does not do anything if property value is not set', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: undefined })
      expect(state.courseContent.test.title).toBe('Updated Test Title')
    })

    it('does not do anything if property is not set', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: undefined, value: 'Test' })
      expect(state.courseContent.test.title).toBe('Updated Test Title')
    })
  })

  describe('courseStructureDestructure', () => { // skipped b/c imported methods create problems
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

    it('sets start property in courseRoutes correctly', () => { // skipped b/c this is function in course-structure.ts
      expect(state.courseRoutes).toContainEqual(['', 'e1ns'])
    })

    it('sets chapters with double title when showSingleSubChapterTitleSlug is true', () => {
      mutations.courseStructureDestructure(state, { ...SampleCourseChapters, properties: { showSingleSubChapterTitleSlug: true } })
      expect(state.courseRoutes).toContainEqual(['video/video', 'zw31'])
    })
  })
})
