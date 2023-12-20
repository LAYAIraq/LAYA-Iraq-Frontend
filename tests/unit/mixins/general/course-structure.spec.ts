import SampleCourse from '../../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../../mocks/sample-course-chapters.json'
import SampleCourseChaptersNested from '../../../mocks/sample-course-chapters-nested.json'
import {
  ContentBlock,
  Course,
  LegacyCourse
} from '@/mixins/types/course-structure'
import {
  courseContentBlockToNavItemTransform,
  courseContentIdGet,
  coursePathsGet,
  courseChaptersCollect,
  courseContentIdsExtract,
  courseDestructure
} from '@/mixins/general/course-structure'

// prerequisites to make sure sample data is valid
describe('content-structure types', () => {
  describe('legacy course structure', () => {
    const isLegacyCourseStructure = (course: LegacyCourse) => {
      return ('content' in course && 'properties' in course)
    }
    it('old courses fulfill the `LegacyCourse` interface', () => {
      expect(isLegacyCourseStructure(SampleCourse)).toBeTruthy()
    })
  })
  describe('new course structure', () => {
    const isCourseStructure = (course: Course) => {
      return ('start' in course && 'chapters' in course)
    }
    it('new courses fulfill the `CourseNavigation` interface', () => {
      expect(isCourseStructure(SampleCourseChapters)).toBeTruthy()
    })
  })
})

describe('content-structure methods', () => {
  describe('contentBlockToNavItemTransform', () => {
    let content: ContentBlock
    beforeEach(() => {
      content = {
        id: 'content',
        title: {
          text: 'Test'
        },
        name: 'button-navigation'
      }
    })

    it('returns navItem as return value', () => {
      const navItem = courseContentBlockToNavItemTransform(content)
      expect(typeof navItem).toBe('object')
      expect(Array.isArray(navItem)).toBeFalsy()
    })

    it('returns a proper navItem', () => {
      const navItem = courseContentBlockToNavItemTransform(content)
      expect(Object.keys(navItem)).toContain('isChapter')
    })

    it('does not create a slug that ends on "edit" and returns false', () => {
      content.title.text = 'Edit'
      const navItem = courseContentBlockToNavItemTransform(content)
      expect(navItem.slug).not.toBe('edit')
    })

    it('does not create a slug that ends on "new" and returns false', () => {
      content.title.text = 'New'
      const navItem = courseContentBlockToNavItemTransform(content)
      expect(navItem.slug).not.toBe('new')
    })
  })

  describe('courseContentIdGet', () => {
    describe('first mode', () => {
      it('returns correct id for new courses', () => {
        const courseChapters = SampleCourseChapters.chapters
        const firstContentId = courseContentIdGet(courseChapters, 'first')
        expect(firstContentId).toBe('e1ns')
      })

      it('returns correct id for deeply nested courses', () => {
        const courseChaptersNested = SampleCourseChaptersNested.chapters
        const firstContentId = courseContentIdGet(courseChaptersNested, 'first')
        expect(firstContentId).toBe('v13r')
      })

      it('returns correct id for old courses', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { id: '562a0638', isChapter: false, slug: 'wysiwyg', follow: 3 },
          { id: 'a7bd9c9c', isChapter: false, slug: 'multiple-choice-test', follow: 4 },
          { id: 'd0b662f2', isChapter: false, slug: 'drag-drop-sample', follow: -1 }
        ]
        const firstContentId = courseContentIdGet(courseChapters, 'first')
        expect(firstContentId).toBe('ba3b89ef')
      })

      it('returns null when no id is found', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { isChapter: true, children: [] }
        ]
        expect(courseContentIdGet(courseChapters.slice(2), 'first')).toBeNull()
      })

      it('returns id of when given single CourseNavItem', () => {
        const courseChapters = { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] }
        expect(courseContentIdGet(courseChapters, 'first')).toBe('ba3b89ef')
      })

      it('returns id of first child f given single chapter', () => {
        const courseChapters = {
          isChapter: true,
          children: [
            { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
            { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 }
          ]
        }
        expect(courseContentIdGet(courseChapters, 'first')).toBe('ba3b89ef')
      })
    })
    describe('last mode', () => {
      it('returns correct id for new courses', () => {
        const courseChapters = SampleCourseChapters.chapters
        const lastContentId = courseContentIdGet(courseChapters, 'last')
        expect(lastContentId).toBe('fu3nf')
      })

      it('returns correct id for deeply nested courses', () => {
        const courseChaptersNested = SampleCourseChaptersNested.chapters
        const lastContentId = courseContentIdGet(courseChaptersNested, 'last')
        expect(lastContentId).toBe('f33db4ck')
      })

      it('returns correct id for old courses', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { id: '562a0638', isChapter: false, slug: 'wysiwyg', follow: 3 },
          { id: 'a7bd9c9c', isChapter: false, slug: 'multiple-choice-test', follow: 4 },
          { id: 'd0b662f2', isChapter: false, slug: 'drag-drop-sample', follow: -1 }
        ]
        const lastContentId = courseContentIdGet(courseChapters, 'last')
        expect(lastContentId).toBe('d0b662f2')
      })

      it('returns null when no id is found', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { isChapter: true, children: [] }
        ]
        expect(courseContentIdGet(courseChapters.slice(2), 'last')).toBeNull()
      })

      it('returns id of when given single CourseNavItem', () => {
        const courseChapters = { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] }
        expect(courseContentIdGet(courseChapters, 'last')).toBe('ba3b89ef')
      })

      it('returns id of last child of given single chapter', () => {
        const courseChapters = {
          isChapter: true,
          children: [
            { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
            { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 }
          ]
        }
        expect(courseContentIdGet(courseChapters, 'last')).toBe('c7c75ede')
      })
    })
  })

  describe('coursePathsGet', () => {
    it('returns correct paths for courses', () => {
      const courseChapters = [
        { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
        { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
        { id: '562a0638', isChapter: false, slug: 'wysiwyg', follow: 3 },
        { id: 'a7bd9c9c', isChapter: false, slug: 'multiple-choice-test', follow: 4 },
        { id: 'd0b662f2', isChapter: false, slug: 'drag-drop-sample', follow: -1 }
      ]
      const paths = coursePathsGet(courseChapters)
      expect(Object.keys(paths)).toHaveLength(5)
      expect(paths['ba3b89ef']).toStrictEqual(['dialog-sample'])
      expect(paths['c7c75ede']).toStrictEqual(['video'])
    })

    it.skip('does not add several start routes when course consists of several arrays', () => {
      const courseChapters = [
        {
          chapterName: 'A',
          id: 'a',
          isChapter: true,
          slug: 'a',
          children:
          [
            { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
            { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
            { id: '562a0638', isChapter: false, slug: 'wysiwyg', follow: 3 },
            { id: 'a7bd9c9c', isChapter: false, slug: 'multiple-choice-test', follow: 4 },
            { id: 'd0b662f2', isChapter: false, slug: 'drag-drop-sample', follow: -1 }
          ]
        },
        {
          chapterName: 'B',
          id: 'b',
          isChapter: true,
          slug: 'b',
          children: [
            { id: 'some-id', isChapter: false, slug: 'some-slug', follow: -1 },
            { id: 'some-id-2', isChapter: false, slug: 'some-slug-2', follow: -1 }
          ]
        }
      ]
      const paths = coursePathsGet(courseChapters)
      expect(Object.keys(paths)).toHaveLength(7)
      expect(paths).toContainEqual(['', 'ba3b89ef'])
      expect(paths).not.toContainEqual(['', 'some-id'])
      expect(paths).toContainEqual(['b/some-slug', 'some-id'])
      expect(paths).toContainEqual(['a/video', 'c7c75ede'])
    })

    it('returns empty object with empty courseStructure', () => {
      const paths = coursePathsGet([])
      expect(paths).toStrictEqual({})
    })
  })

  describe('courseChaptersCollect', () => {
    it('returns null if no chapter array is passed', () => {
      expect(courseChaptersCollect(null)).toBeNull()
      expect(courseChaptersCollect(undefined)).toBeNull()
    })
    it('returns empty object for empty chapter array', () => {
      expect(courseChaptersCollect([])).toStrictEqual({})
    })
    it('returns the correct object for simple chapters', () => {
      expect(courseChaptersCollect(SampleCourseChapters.chapters)).toStrictEqual({
        video: 'video',
        editor: 'Editor',
        quiz: 'quiz'
      })
    })
    it('returns the correct object for nested chapters', () => {
      expect(courseChaptersCollect(SampleCourseChaptersNested.chapters)).toStrictEqual({
        quiz: 'quiz',
        scmc: 'scmc',
        'choice-quizzes': 'Choice-Quizzes',
        other: 'other',
        'drag-drop': 'Drag & Drop',
        relate: 'Relate',
        start: 'start',
        'last-chapter': 'Last Chapter',
        main: 'main',
        'some-sub-chapter': 'Some - Sub–Chapter',
        feedback: 'Feedback'
      })
    })
  })

  describe('courseDestructure', () => {
    it.skip('only returns blank string for first course block', () => {
      const singleChapterCourseStructure = [
        {
          id: 'h4b3mu5p4p4m',
          isChapter: false,
          follow: null,
          slug: 'former-pope-benedict-dead'
        }
      ]
      const [ids, paths] = courseDestructure(singleChapterCourseStructure)
      expect(Object.keys(ids)).toHaveLength(1)
      expect(Object.keys(ids)).toContainEqual('h4b3mu5p4p4m')
      expect(Object.keys(paths)).toHaveLength(1)
      expect(paths).toStrictEqual({ h4b3mu5p4p4m: [] })
    })

    it('returns correct paths for new courses (no trimming)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [ids, paths] = courseDestructure(courseChapters)
      expect(Object.keys(ids).length).toBe(5)
      expect(Object.keys(paths).length).toBe(5)

      expect(paths['e1ns']).toStrictEqual(['video', 'dialog-sample'])
      expect(paths['zw31']).toStrictEqual(['video', 'video'])
      expect(paths['dr31']).toStrictEqual(['editor', 'wysiwyg'])
      expect(paths['v13r']).toStrictEqual(['quiz', 'sc-quiz'])
      expect(paths['fu3nf']).toStrictEqual(['quiz', 'drag-drop'])
    })

    it('returns correct paths for deeply nested courses (no trimming)', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const [ids, paths] = courseDestructure(courseChaptersNested)
      expect(Object.keys(ids).length).toBe(9)
      expect(Object.keys(paths).length).toBe(9)
      expect(paths['e1ns']).toStrictEqual(['main', 'start', 'dialog-sample'])
      expect(paths['zw31']).toStrictEqual(['main', 'last-chapter', 'video'])
      expect(paths['dr31']).toStrictEqual(['main', 'last-chapter', 'wysiwyg'])
      expect(paths['513b3n']).toStrictEqual(['main', 'quiz', 'other', 'drag-drop', 'drag-drop'])
      expect(paths['4cht']).toStrictEqual(['main', 'quiz', 'other', 'relate', 'relate'])
      expect(paths['fu3nf']).toStrictEqual(['main', 'quiz', 'scmc', 'choice-quizzes', 'mc-quiz'])
      expect(paths['v13r']).toStrictEqual(['main', 'quiz', 'scmc', 'choice-quizzes', 'sc-quiz'])
      expect(paths['53ch5']).toStrictEqual(['main', 'quiz', 'scmc', 'some-sub-chapter', 'tf-quiz'])
      expect(paths['dr31']).toStrictEqual(['main', 'last-chapter', 'wysiwyg'])
    })
  })

  describe('courseContentIdsExtract', () => {
    it('returns correct ids for new courses', () => {
      const courseChapters = SampleCourseChapters.chapters
      const ids = {}
      courseContentIdsExtract(courseChapters, ids)
      expect(Object.keys(ids).length).toBe(5)
      expect(ids).toHaveProperty('e1ns')
      expect(ids).toHaveProperty('zw31')
      expect(ids).toHaveProperty('dr31')
      expect(ids).toHaveProperty('v13r')
      expect(ids).toHaveProperty('fu3nf')
    })

    it('returns correct ids for deeply nested courses', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const ids = {}
      courseContentIdsExtract(courseChaptersNested, ids)
      expect(Object.keys(ids).length).toBe(9)
      expect(ids).toHaveProperty('e1ns')
      expect(ids).toHaveProperty('zw31')
      expect(ids).toHaveProperty('dr31')
      expect(ids).toHaveProperty('v13r')
      expect(ids).toHaveProperty('fu3nf')
      expect(ids).toHaveProperty('53ch5')
      expect(ids).toHaveProperty('513b3n')
      expect(ids).toHaveProperty('4cht')
      expect(ids).toHaveProperty('f33db4ck')
    })
  })
})
