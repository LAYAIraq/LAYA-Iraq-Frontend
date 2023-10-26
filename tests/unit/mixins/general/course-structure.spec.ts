import SampleCourse from '../../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../../mocks/sample-course-chapters.json'
import SampleCourseChaptersNested from '../../../mocks/sample-course-chapters-nested.json'
import {
  ContentBlock,
  Course,
  LegacyContentBlock,
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
import { getNumberBetween1and10 } from '../../../helpers/random-input'

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
      expect(paths).toHaveLength(5)
      expect(paths).toContainEqual(['', 'ba3b89ef'])
      expect(paths).toContainEqual(['video', 'c7c75ede'])
    })

    it('does not add several start routes when course consists of several arrays', () => {
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
      expect(paths).toHaveLength(7)
      expect(paths).toContainEqual(['', 'ba3b89ef'])
      expect(paths).not.toContainEqual(['', 'some-id'])
      expect(paths).toContainEqual(['b/some-slug', 'some-id'])
      expect(paths).toContainEqual(['a/video', 'c7c75ede'])
    })

    it('returns array of length 0 with empty array', () => {
      const paths = coursePathsGet([])
      expect(paths).toHaveLength(0)
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
    it('only returns blank string for first course block', () => {
      const singleChapterCourseStructure = [
        {
          chapterName: 'verylongchaptername',
          id: 'h4b3mu5p4p4m',
          isChapter: false,
          follow: -1,
          slug: 'former-pope-benedict-dead'
        }
      ]
      const [ids, paths] = courseDestructure(singleChapterCourseStructure, 'h4b3mu5p4p4m')
      expect(Object.keys(ids)).toHaveLength(1)
      expect(Object.keys(ids)).toContainEqual('h4b3mu5p4p4m')
      expect(paths).toHaveLength(1)
      expect(paths).toContainEqual(['', 'h4b3mu5p4p4m'])
    })

    it('returns correct paths for new courses (no trimming)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [ids, paths] = courseDestructure(courseChapters, 'e1ns')
      expect(Object.keys(ids).length).toBe(5)
      expect(paths).toHaveLength(5)
      expect(paths).toContainEqual(['', 'e1ns'])
      expect(paths).toContainEqual(['video/video', 'zw31'])
      expect(paths).toContainEqual(['editor/wysiwyg', 'dr31'])
      expect(paths).toContainEqual(['quiz/sc-quiz', 'v13r'])
      expect(paths).toContainEqual(['quiz/drag-drop', 'fu3nf'])
    })

    it('returns correct paths for new courses (with trimming of block slug)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [ids, paths] = courseDestructure(courseChapters, 'chapter')
      expect(Object.keys(ids).length).toBe(5)
      expect(paths).toHaveLength(5)
      expect(paths).toContainEqual(['', 'e1ns'])
      expect(paths).toContainEqual(['video', 'zw31'])
      expect(paths).toContainEqual(['editor', 'dr31'])
      expect(paths).toContainEqual(['quiz/sc-quiz', 'v13r'])
      expect(paths).toContainEqual(['quiz/drag-drop', 'fu3nf'])
    })

    it('returns correct paths for new courses (with trimming of chapter slug)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [_, paths] = courseDestructure(courseChapters, 'block')
      expect(paths).toContainEqual(['video', 'zw31'])
      expect(paths).toContainEqual(['wysiwyg', 'dr31'])
    })

    it('returns correct paths for deeply nested courses (no trimming)', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const [ids, paths] = courseDestructure(courseChaptersNested)
      expect(Object.keys(ids).length).toBe(9)
      expect(paths).toHaveLength(9)
      expect(paths).toContainEqual(['', 'v13r'])
      expect(paths).toContainEqual(['feedback/feedback', 'f33db4ck'])
      expect(paths).toContainEqual(['main/last-chapter/video', 'zw31'])
      expect(paths).toContainEqual(['main/last-chapter/wysiwyg', 'dr31'])
      expect(paths).toContainEqual(['main/quiz/other/drag-drop/drag-drop', '513b3n'])
      expect(paths).toContainEqual(['main/quiz/other/relate/relate', '4cht'])
      expect(paths).toContainEqual(['main/quiz/scmc/choice-quizzes/mc-quiz', 'fu3nf'])
      expect(paths).toContainEqual(['main/quiz/scmc/some-sub-chapter/tf-quiz', '53ch5'])
      expect(paths).toContainEqual(['main/start/dialog-sample', 'e1ns'])
    })

    it('returns correct paths for deeply nested courses (with trimming of chapter)', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const [ids, paths] = courseDestructure(courseChaptersNested, 'block')
      expect(Object.keys(ids).length).toBe(9)
      expect(paths).toHaveLength(9)
      expect(paths).toContainEqual(['', 'v13r'])
      expect(paths).toContainEqual(['feedback', 'f33db4ck'])
      expect(paths).toContainEqual(['main/last-chapter/video', 'zw31'])
      expect(paths).toContainEqual(['main/last-chapter/wysiwyg', 'dr31'])
      expect(paths).toContainEqual(['main/quiz/other/drag-drop', '513b3n'])
      expect(paths).toContainEqual(['main/quiz/other/relate', '4cht'])
      expect(paths).toContainEqual(['main/quiz/scmc/mc-quiz', 'fu3nf'])
      expect(paths).toContainEqual(['main/quiz/scmc/tf-quiz', '53ch5'])
      expect(paths).toContainEqual(['main/dialog-sample', 'e1ns'])
    })
    it('returns correct paths for deeply nested courses (with trimming of block)', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const [ids, paths] = courseDestructure(courseChaptersNested, 'chapter')
      expect(Object.keys(ids).length).toBe(9)
      expect(paths).toHaveLength(9)
      expect(paths).toContainEqual(['', 'v13r'])
      expect(paths).toContainEqual(['feedback', 'f33db4ck'])
      expect(paths).toContainEqual(['main/last-chapter/video', 'zw31'])
      expect(paths).toContainEqual(['main/last-chapter/wysiwyg', 'dr31'])
      expect(paths).toContainEqual(['main/quiz/other/drag-drop', '513b3n'])
      expect(paths).toContainEqual(['main/quiz/other/relate', '4cht'])
      expect(paths).toContainEqual(['main/quiz/scmc/choice-quizzes', 'fu3nf'])
      expect(paths).toContainEqual(['main/quiz/scmc/some-sub-chapter', '53ch5'])
      expect(paths).toContainEqual(['main/start', 'e1ns'])
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
