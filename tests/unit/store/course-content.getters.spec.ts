import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import SampleCourseChaptersNested from '../../mocks/sample-course-chapters-nested.json'
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

  describe('courseChaptersCoherent', () => {
    beforeEach(() => {
      state = deepCopy(emptyState)
    })
    it('returns true when chapters are integer (flat)', () => {
      state.courseChapters = [
        { isChapter: false, slug: 'block-1' },
        { isChapter: false, slug: 'block-2' }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeTruthy()
    })
    it('returns true when chapters are integer (deep)', () => {
      state.courseChapters = [
        {
          isChapter: true,
          slug: 'coherent',
          children: [
            { isChapter: false, slug: 'block-1' },
            { isChapter: false, slug: 'block-2' }
          ]
        },
        {
          isChapter: true,
          slug: 'coherent-2',
          children: [
            { isChapter: false, slug: 'block-3' },
            { isChapter: false, slug: 'block-4' }
          ]
        }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeTruthy()
    })
    it('returns true when chapters are integer (nested)', () => {
      state.courseChapters = [
        {
          isChapter: true,
          slug: 'coherent',
          children: [
            {
              isChapter: true,
              slug: 'coherent',
              children: [
                { isChapter: false, slug: 'block-1' },
                { isChapter: false, slug: 'block-2' }
              ]
            },
            {
              isChapter: true,
              slug: 'coherent',
              children: [
                { isChapter: false, slug: 'block-3' },
                { isChapter: false, slug: 'block-4' }
              ]
            }
          ]
        },
        {
          isChapter: true,
          slug: 'coherent-2',
          children: [
            {
              isChapter: true,
              slug: 'coherent',
              children: [
                { isChapter: false, slug: 'block-5' },
                { isChapter: false, slug: 'block-6' }
              ]
            },
            {
              isChapter: true,
              slug: 'coherent',
              children: [
                { isChapter: false, slug: 'block-7' },
                { isChapter: false, slug: 'block-8' }
              ]
            }
          ]
        }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeTruthy()
    })
    it('returns false when chapters are not integer (flat)', () => {
      state.courseChapters = [
        { isChapter: false, slug: 'block-1' },
        { isChapter: true, slug: 'block-2', children: [] }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeFalsy()
    })
    it('returns false when chapters are not integer (deep)', () => {
      state.courseChapters = [
        {
          isChapter: true,
          slug: 'incoherent',
          children: [
            { isChapter: false, slug: 'block-1' },
            { isChapter: true, slug: 'block-2', children: [] }
          ]
        },
        {
          isChapter: true,
          slug: 'incoherent-2',
          children: [
            { isChapter: true, slug: 'block-3', children: [] },
            { isChapter: false, slug: 'block-4' }
          ]
        }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeFalsy()
    })
    it('returns false when chapters are not integer (actual use data)', () => {
      state.courseChapters = [{ chapterName: 'New Chapter', slug: 'new-chapter', isChapter: true, children: [{ chapterName: 'New Chapter 4', slug: 'new-chapter-4', isChapter: true, children: [{ id: '3b7053f5', slug: 'dialog-sample', type: 'button-navigation', follow: ['c5829415', '6f610939'] }, { id: '2135dd5d', slug: 'wysiwyg', type: 'free-text', follow: '6f610939' }, { id: '6f610939', slug: 'drag-drop-sample', type: 'category-matching', follow: '811857fb' }, { id: '811857fb', slug: 'multiple-choice-test', type: 'choice-question', follow: 'c5829415' }, { id: 'c5829415', slug: 'video', type: 'video-player', follow: '3f4db7f4-6b22-4f47-9f98-7d8da58677ab' }] }, { id: '3f4db7f4-6b22-4f47-9f98-7d8da58677ab', isChapter: false, slug: 'dasds', type: 'video-player', follow: null }] }, { chapterName: 'New Chapter 2', slug: 'new-chapter-2', isChapter: true, children: [] }]
      expect(getters.courseChaptersCoherent(state)).toBeFalsy()
    })
    it('returns false when chapter has no children (flat)', () => {
      expect(getters.courseChaptersCoherent(state)).toBeFalsy()
    })
    it('returns false when chapter has no children (deep)', () => {
      state.courseChapters = [
        {
          isChapter: true,
          slug: 'incoherent',
          children: []
        },
        {
          isChapter: true,
          slug: 'incoherent-2',
          children: [
            { isChapter: true, slug: 'block-3', children: [] },
            { isChapter: false, slug: 'block-4' }
          ]
        }
      ]
      expect(getters.courseChaptersCoherent(state)).toBeFalsy()
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

  describe('courseContentFollowMap', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })
    it('returns empty object when there are no chapters', () => {
      expect(getters.courseContentFollowMap(state)).toStrictEqual({})
    })

    it('returns correct object when courseChapters change', () => {
      state.courseChapters = SampleCourseChapters.chapters
      expect(getters.courseContentFollowMap(state)).toStrictEqual({
        e1ns: ['zw31', 'dr31'],
        zw31: 'dr31',
        dr31: 'v13r',
        v13r: 'fu3nf',
        fu3nf: undefined
      })
    })
  })

  describe('courseContentPathId', () => {
    beforeEach(() => {
      state.courseChapters = SampleCourseChaptersNested.chapters
    })
    it('returns first content id if path is undefined', () => {
      expect(getters.courseContentPathId(state)(undefined)).toBe('v13r')
    })

    it('returns first content id if path is null', () => {
      expect(getters.courseContentPathId(state)(null)).toBe('v13r')
    })

    it('returns null if path is not found (flat)', () => {
      expect(getters.courseContentPathId(state)(['hilllllarious'])).toBeNull()
    })
    it('returns null if path is not found (nested)', () => {
      expect(getters.courseContentPathId(state)(['feedback', 'test', 'test'])).toBeNull()
    })

    it('returns correct id of nested path', () => {
      expect(getters.courseContentPathId(state)(['feedback', 'feedback'])).toBe('f33db4ck')
    })
    it('returns correct id of chapter', () => {
      expect(getters.courseContentPathId(state)(['feedback'])).toBe('f33db4ck')
    })
    it('returns correct id of sub-chapter', () => {
      expect(getters.courseContentPathId(state)(['main', 'quiz', 'scmc'])).toBe('v13r')
      expect(getters.courseContentPathId(state)(['main', 'quiz', 'scmc', 'some-sub-chapter'])).toBe('53ch5')
    })
  })

  describe.skip('courseRoutes', () => { // skipped b/c useless test cases
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
