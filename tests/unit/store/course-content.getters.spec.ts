import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import { deepCopy } from '@/mixins/general/helpers'
describe('store module course-content getters', () => {
  let state: any
  const emptyState = {
    courseContent: {},
    courseIds: {},
    courseChapters: [],
    courseChapterNames: {},
    courseRoutes: [],
    courseStart: ''
  }
  const getters = courseContent.getters
  const Course = { ...SampleCourse, properties: {}, lastChanged: Date.now() }
  beforeEach(() => {
    state = deepCopy(emptyState)
  })
  describe('courseChapters', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })
    it('returns empty array when state is empty', () => {
      expect(getters.courseChapters(state)).toStrictEqual([])
    })

    it('returns object that resides in state', () => {
      state.courseChapters = SampleCourse
      expect(getters.courseChapters(state)).toStrictEqual(SampleCourse)
    })

    it('returns null courseChapters is null', () => {
      state.courseChapters = null
      expect(getters.courseChapters(state)).toBeNull()
    })
  })
  describe('courseChapterNames', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })
    it('returns empty object if state is empty', () => {
      expect(getters.courseChapterNames(state)).toStrictEqual({})
    })

    it('returns object that resides in state', () => {
      state.courseChapters = SampleCourseChapters.chapters
      expect(getters.courseChapterNames(state)).toStrictEqual({
        editor: 'Editor',
        quiz: 'quiz',
        video: 'video'
      })
    })

    it('returns null if courseChapterNames is null', () => {
      state.courseChapters = null
      expect(getters.courseChapterNames(state)).toBeNull()
    })
  })

  describe('courseContent', () => {
    it('returns empty object if state is empty', () => {
      expect(getters.courseContent(state)).toStrictEqual({})
    })

    it('returns object that resides in state', () => {
      state.courseContent = Course
      expect(getters.courseContent(state)).toStrictEqual(Course)
    })

    it('returns null if courseContent is null', () => {
      state.courseContent = null
      expect(getters.courseContent(state)).toBeNull()
    })
  })

  describe('courseContentIdRouteMap', () => {
    it('returns empty object if courseRoutes are empty', () => {
      expect(getters.courseContentIdRouteMap(state)).toStrictEqual({})
    })

    it('returns object with route as key and id as value', () => {
      state.courseRoutes = [['/test', 'test']]
      expect(getters.courseContentIdRouteMap(state)).toStrictEqual({ test: '/test' })
    })

    it('does not add key to map if the same id is already in the map with empty key', () => {
      state.courseRoutes = [['', 'test'], ['/test', 'test']]
      expect(getters.courseContentIdRouteMap(state)).toStrictEqual({ test: '' })
    })
  })

  describe('courseContentRouteIdMap', () => {
    it('returns empty object if courseRoutes are empty', () => {
      state.courseRoutes = []
      expect(getters.courseContentRouteIdMap(state, { courseStart: getters.courseStart(state) })).toStrictEqual({})
    })

    it('returns object with route as key and id as value', () => {
      state.courseChapters = [{ slug: 'test', isChapter: true, chapterName: 'Test', children: [{ id: 'test', slug: 'test' }] }]
      expect(getters.courseStart(state)).toBe('test')
      state.courseRoutes = [['', 'test'], ['test/test', 'test']]
      expect(getters.courseContentRouteIdMap(state, { courseStart: getters.courseStart(state) })).toStrictEqual({ '': 'test' })
    })

    it('returns object with all keys and values', () => {
      state.courseChapters = [{ slug: 'test', isChapter: true, chapterName: 'Test', children: [{ id: 'test', slug: 'test' }] }]
      state.courseRoutes = [['', 'test'], ['test/test', 'test'], ['test/test2', 'test2']]
      expect(getters.courseContentRouteIdMap(state, { courseStart: getters.courseStart(state) })).toStrictEqual({ '': 'test', 'test/test2': 'test2' })
    })
  })

  describe('courseContentPathId', () => {
    beforeEach(() => {
      state.courseRoutes = [['', 'test'], ['/test', 'test']]
    })
    it('returns null if path is undefined', () => {
      expect(getters.courseContentPathId(state)(undefined)).toBe('test')
    })

    it('returns null if path is null', () => {
      expect(getters.courseContentPathId(state)(null)).toBe('test')
    })

    it('returns null if path is not found', () => {
      expect(getters.courseContentPathId(state)('/test2')).toBeNull()
    })

    it('returns id if path is found', () => {
      expect(getters.courseContentPathId(state)('/test')).toBe('test')
    })
  })

  describe('courseNav', () => {
    it('returns empty object if no courseChapters', () => {
      state.courseChapters = []
      expect(getters.courseNav(state, getters)).toStrictEqual({ start: expect.any(Function), structure: [] })
    })

    it('returns object consisting of courseStart and courseChapters', () => {
      state.courseChapters = SampleCourseChapters.chapters
      expect(getters.courseNav(state, { courseStart: getters.courseStart(state) })).toStrictEqual({
        start: 'e1ns',
        structure: SampleCourseChapters.chapters
      })
    })
  })

  describe('courseRoutes', () => {
    it('returns empty array if state is empty', () => {
      state.courseRoutes = []
      expect(getters.courseRoutes(state)).toStrictEqual([])
    })

    it('returns array consisting of courseRoutes', () => {
      state.courseRoutes = [['', 'test'], ['/test', 'test']]
      expect(getters.courseRoutes(state)).toStrictEqual([['', 'test'], ['/test', 'test']])
    })
  })
})
