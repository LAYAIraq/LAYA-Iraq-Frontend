import courseContent from '@/store/modules/course-content'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import SampleCourseChaptersFlat from '../../mocks/sample-course-chapters-flat.json'
import SampleCourseChaptersIntermediate from '../../mocks/sample-course-chapters-intermediate.json'
import SampleCourseChaptersNested from '../../mocks/sample-course-chapters-nested.json'
import { deepCopy } from '@/mixins/general/helpers'
import { CourseNavigationItemBlock } from '@/mixins/types/course-structure'

describe('store module course-content mutations', () => {
  let state: any

  const emptyState = {
    courseContent: {},
    courseIds: {},
    courseNav: {
      start: null,
      structure: []
    },
    courseChapters: [],
    courseRoutes: [],
    courseStart: ''
  }
  const mutations = courseContent.mutations
  const Course = { ...SampleCourse, properties: {}, lastChanged: Date.now() }

  describe('setCourseContentAndNav', () => {
    describe('old course structure', () => {
      beforeAll(() => {
        state = deepCopy(emptyState)
        mutations.setCourseContentAndNav(state, Course)
      })
      it('creates an entry in courseContent for each course block', () => {
        expect(Object.keys(state.courseContent).length).toBe(SampleCourse.content.length)
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
        const courseStart = courseContent.getters.courseStart(state)
        expect(state.courseContent[courseStart]).toStrictEqual(
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
        expect(Object.keys(state.courseRoutes).length).toBeGreaterThan(0)
      })
    })
    describe('new course structure', () => {
      beforeAll(() => {
        state = deepCopy(emptyState)
        mutations.setCourseContentAndNav(state, SampleCourseChaptersIntermediate)
      })
      it('creates an entry in courseContent for each course block', () => {
        expect(Object.keys(state.courseContent).length).toBe(5)
      })

      it('sets chapters in store', () => {
        expect(state.courseChapters.length).toBe(3)
        expect(state.courseChapters).toStrictEqual(SampleCourseChaptersIntermediate.chapters)
      })

      it('creates a courseRoutes array', () => {
        expect(Object.keys(state.courseRoutes).length).toBe(5)
      })
    })
  })

  describe('courseChapterAdd', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })

    it('adds courseChapter to empty chapters, modifying courseStart', () => {
      const mockChapter: CourseNavigationItemBlock = {
        isChapter: false,
        id: 'abc',
        slug: 'test-nav',
        type: 'button-navigation',
        follow: null
      }
      mutations.courseChapterAdd(state, mockChapter)
      // expect(state.courseStart).toBe('abc')
      expect(state.courseChapters[0]).toStrictEqual(mockChapter)
    })

    it('adds chapter at end of existing chapters', () => {
      const newChapter = SampleCourseChapters.chapters[0]
      mutations.courseChapterAdd(state, newChapter)
      expect(state.courseChapters.length).toBe(2)
      expect(state.courseChapters[1]).toStrictEqual(newChapter)
    })
  })

  describe('courseChapterFollowUpdate', () => {
    beforeEach(() => {
      state = deepCopy(emptyState)
      state.courseChapters = deepCopy(SampleCourseChaptersNested.chapters)
    })

    it('does nothing when not passing anything', () => {
      mutations.courseChapterUpdateFollow(state, { id: null, value: null })
      expect(state.courseChapters).toStrictEqual(SampleCourseChaptersNested.chapters)
    })

    it('does nothing when not passing new values', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'v13r', value: null })
      const a = state.courseChapters[0].children[0].children[0].children[0].children[0]
      expect(a.follow).toStrictEqual('fu3nf')
    })

    it('does nothing when id does not exist', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'nasdg713', value: ['abc', 'def'] })
      expect(state.courseChapters).toStrictEqual(SampleCourseChaptersNested.chapters)
    })

    it('changes follow value of deeply nested chapter', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'v13r', value: ['abc', 'def'] })
      const a = state.courseChapters[0].children[0].children[0].children[0].children[0]
      expect(a.follow).toStrictEqual(['abc', 'def'])
    })

    it('changes follow value of button navigation', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'e1ns', value: ['abc', 'def'] })
      const a = state.courseChapters[0].children[1].children[0]
      expect(a.follow).toStrictEqual(['abc', 'def'])
    })

    it('does not change value of button navigation when null passed', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'e1ns', value: null })
      const a = state.courseChapters[0].children[1].children[0]
      expect(a.follow).toStrictEqual(['zw31', 'dr31'])
    })

    it('does not change value of button navigation when undefined passed', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'e1ns', value: undefined })
      const a = state.courseChapters[0].children[1].children[0]
      expect(a.follow).toStrictEqual(['zw31', 'dr31'])
    })

    it('changes follow value of other type', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'f33db4ck', value: 'test' })
      const a = state.courseChapters[1].children[0]
      expect(a.follow).toBe('test')
      expect(a.followManual).toBeTruthy()
    })

    it('does not change value of other type when null passed', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'f33db4ck', value: null })
      const a = state.courseChapters[1].children[0]
      expect(a.follow).toStrictEqual('v13r')
    })

    it('does not change value of other type when undefined passed', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'f33db4ck', value: undefined })
      const a = state.courseChapters[1].children[0]
      expect(a.follow).toStrictEqual('v13r')
    })

    it('does not change value of other type when empty string passed', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'f33db4ck', value: '' })
      const a = state.courseChapters[1].children[0]
      expect(a.follow).toStrictEqual('v13r')
    })

    it('does not change value of other type when value is the same', () => {
      mutations.courseChapterUpdateFollow(state, { id: 'f33db4ck', value: 'v13r' })
      const a = state.courseChapters[1].children[0]
      expect(a.follow).toStrictEqual('v13r')
    })

    it('changes follow value of shallow array', () => {
      state.courseChapters = [{ id: 'eins', follow: 'zwei' }, { id: 'zwei', follow: 'null' }]
      mutations.courseChapterUpdateFollow(state, { id: 'zwei', value: ['eins', 'zwei'] })
      expect(state.courseChapters[1].follow).toStrictEqual(['eins', 'zwei'])
    })
  })

  describe('courseChaptersSet', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })

    it('sets the courseChapters property', () => {
      expect(state.courseChapters).toStrictEqual(emptyState.courseChapters)
      mutations.courseChaptersSet(state, SampleCourseChapters.chapters)
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })

    it('does nothing if chapters is not defined', () => {
      mutations.courseChaptersSet(state, null)
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })
  })

  describe('courseContentAdd', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })

    it('adds a new block to courseContent', () => {
      const block = {
        title: {
          text: 'Test'
        },
        name: 'some-component',
        id: 't3st'
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
          },
          test2: {
            id: 'test2'
          },
          test3: {
            id: 'test3'
          }
        }
      }
    })

    it('removes a block from courseContent', () => {
      mutations.courseContentRemove(state, 'test')
      expect(state.courseContent.test).toBeUndefined()
      expect(typeof state.courseContent).toBe('object')
      expect(Array.isArray(state.courseContent)).toBeFalsy()
      expect(Object.keys(state.courseContent).length).toBe(2)
    })
  })

  describe('courseContentSet', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
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

    it('triggers update in corresponding courseChapter', () => {
      state.courseChapters = [{ id: 'test', isChapter: false, slug: 'updated-test-title', follow: null, type: 'different-component' }]
      mutations.courseContentSet(state, {
        id: 'test',
        title: {
          text: 'New Title'
        },
        name: 'different-component'
      })
      expect(state.courseChapters[0].slug).toBe('new-title')
    })
  })

  describe('courseContentSetProperty', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
      state.courseContent['test'] = {
        id: 'test',
        title: {
          text: 'Test'
        },
        name: 'some-component'
      }
      state.courseChapters = [
        { isChapter: false, id: 'test', slug: 'test', follow: null, type: 'some-component' }
      ]
    })
    it('sets a property of a courseContent block', () => {
      expect(state.courseContent['test']).toBeTruthy()
      mutations.courseContentSetProperty(state, { id: 'test', property: 'context', value: 'Test' })
      expect(state.courseContent.test.context).toBe('Test')
    })

    it('does not overwrite other properties', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: { text: 'Updated Test Title' } })
      expect(state.courseContent.test).toStrictEqual(expect.objectContaining({
        id: 'test',
        title: { text: 'Updated Test Title' },
        name: 'some-component'
      })
      )
    })

    it('triggers change in courseChapters when title is changed', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: { text: 'Updated Title' } })
      expect(state.courseContent.test).toStrictEqual(expect.objectContaining({
        id: 'test',
        title: { text: 'Updated Title' },
        name: 'some-component'
      })
      )
      expect(state.courseChapters[0].slug).toBe('updated-title')
    })

    it('does not do anything if id does not exist', () => {
      mutations.courseContentSetProperty(state, { id: 'test2', property: 'title', value: 'Test' })
      expect(state.courseContent['test2']).toBeUndefined()
    })

    it('does not do anything if property value is not set', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: 'title', value: undefined })
      expect(state.courseContent.test.title).toStrictEqual({ text: 'Updated Title' })
    })

    it('does not do anything if property is not set', () => {
      mutations.courseContentSetProperty(state, { id: 'test', property: undefined, value: 'Test' })
      expect(state.courseContent.test.title).toStrictEqual({ text: 'Updated Title' })
    })
  })

  describe('courseRoutesUpdate', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
    })

    it('sets courseRoutes to argument of courseRoutes mutation', () => {
      mutations.courseChaptersSet(state, SampleCourseChapters.chapters)
      mutations.courseRoutesUpdate(state)
      expect(Object.keys(state.courseRoutes).length).toBe(5)
      Object.keys(state.courseRoutes).forEach((id, i) => {
        if (i === 0) {
          expect(id).toBe('e1ns')
        }
        expect(typeof id === 'string')
      })
    })
  })

  describe('courseStructureDestructure', () => {
    beforeAll(() => {
      state = deepCopy(emptyState)
      mutations.courseStructureDestructure(state, SampleCourseChapters)
    })
    it('creates an entry in courseContent for each course block', () => { // skipped b/c this is function in course-structure.ts
      expect(Object.keys(state.courseContent).length).toBe(5)
    })

    it('copies the chapters in store', () => {
      expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
    })

    it('creates an entry in courseRoutes for each course block', () => {
      expect(Object.keys(state.courseRoutes).length).toBeGreaterThanOrEqual(5)
    })
  })

  // this needs to be at the end of the test file, otherwise tests fail
  describe('courseChaptersContentRemove', () => {
    describe('no actions needed', () => {
      beforeAll(() => {
        state = deepCopy(emptyState)
        mutations.courseChaptersSet(state, SampleCourseChapters.chapters)
      })
      it('contentId is not defined', () => {
        mutations.courseChaptersContentRemove(state, null)
        expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
      })
      it('contentId is empty string', () => {
        mutations.courseChaptersContentRemove(state, '')
        expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
      })
      it('contentId is not in chapters', () => {
        mutations.courseChaptersContentRemove(state, 'kjahdoh1878nna')
        expect(state.courseChapters).toStrictEqual(SampleCourseChapters.chapters)
      })
    })
    describe('action needed', () => {
      beforeEach(() => {
        state = deepCopy(emptyState)
      })
      it('removes content when chapters is flat array', () => {
        mutations.courseChaptersSet(state, SampleCourseChaptersFlat.chapters)
        mutations.courseChaptersContentRemove(state, 'v13r')
        expect(state.courseChapters.length).toBe(4)
        expect(state.courseChapters.find(el => el.id === 'v13r')).toBeFalsy()
      })
      it('removes content when chapters is nested array (one layer)', () => {
        mutations.courseChaptersSet(state, SampleCourseChapters.chapters)
        mutations.courseChaptersContentRemove(state, 'v13r')
        expect(state.courseChapters.length).toBe(3)
        expect(state.courseChapters[2].children.length).toBe(1)
        expect(state.courseChapters[2].children.find(el => el.id === 'v13r')).toBeFalsy()
      })
      it('removes content when chapters is nested array (multiple layers)', () => {
        mutations.courseChaptersSet(state, SampleCourseChaptersNested.chapters)
        mutations.courseChaptersContentRemove(state, 'v13r')
        expect(state.courseChapters.length).toBe(2)
        expect(state.courseChapters[0].children[0].children[0].children[0].children.length).toBe(1)
        expect(state.courseChapters[0].children[0].children[0].children[0].children.find(el => el.id === 'v13r')).toBeFalsy()
      })
    })
  })
})
