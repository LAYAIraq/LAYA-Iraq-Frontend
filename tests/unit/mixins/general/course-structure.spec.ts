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
  chapterFollowSet,
  contentBlockToNavItemTransform,
  contentIdGet,
  coursePathsGet,
  courseStructureChapterNames,
  courseStructureContentIdsExtract,
  courseStructureDescent,
  legacyContentStepsTransform,
  slugify,
  unslugify
} from '@/mixins/general/course-structure'
import { validateSlug } from '../../../helpers/validations'
import { deepCopy } from '@/mixins/general/helpers'

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
  const getNumberBetween1and10 = () => Math.ceil(Math.random() * 10)
  describe('legacyContentStepsTransform', () => {
    const content = SampleCourse.content
    const mockContentBlock: LegacyContentBlock = {
      name: 'mock',
      input: {
        title: { id: 't1tl3', text: 'mock' }
      },
      nextStep: null
    }
    it('breaks steps into chapters', () => {
      const contentBlock = content[0]
      const chapters: any = legacyContentStepsTransform(contentBlock)
      expect(chapters).toHaveLength(2)
      expect(Array.isArray(chapters)).toBeTruthy()
      chapters.forEach(chapter => expect(typeof chapter === 'number').toBeTruthy())
    })

    it('returns just a number for a single step', () => {
      for (let i = 1; i < content.length; i++) {
        const contentBlock = content[i]
        const chapters: any = legacyContentStepsTransform(contentBlock)
        expect(typeof chapters === 'number').toBeTruthy()
      }
    })

    it('returns null for no next step', () => {
      const chapters: any = legacyContentStepsTransform(mockContentBlock)
      expect(chapters).toBeNull()
    })

    it('returns -1 for next step 0 (i.e. designated last block)', () => {
      const testBlock = { ...mockContentBlock, nextStep: '0' }
      const chapters: any = legacyContentStepsTransform(testBlock)
      expect(chapters).toBe(-1)
    })

    it('return correct output for random input', () => {
      const noOfItems = getNumberBetween1and10() // random number between 1 and 10
      let steps = ''
      const follow = []
      for (let i = 0; i < noOfItems; i++) { // create random string of numbers
        const number = getNumberBetween1and10()
        steps += i === noOfItems - 1 ? `${number}` : `${number},` // add comma if not last number
        follow.push(number - 1) // -1 because of 0-indexing
      }
      mockContentBlock.nextStep = steps // set random string as nextStep
      const followSteps: any = legacyContentStepsTransform(mockContentBlock)
      if (noOfItems > 1) { // if more than one step, expect array
        expect(followSteps).toHaveLength(noOfItems)
        expect(followSteps).toEqual(follow)
      } else { // if only one step, expect number
        expect(followSteps).toBe(follow[0])
      }
    })
  })

  describe('slugify', () => {
    it('converts strings to slugs', () => {
      const strings = ['Hello World', 'Hello World!', 'Hello World!!', 'Hello World!!!']
      const expectedSlug = 'hello-world'
      strings.forEach((string) => {
        const slug = slugify(string)
        expect(validateSlug(slug)).toBeTruthy()
        expect(slug).toBe(expectedSlug)
      })
    })

    it('converts random sentences to valid slugs', () => {
      const noOfWords = getNumberBetween1and10() * 2 // random number between 1 and 10
      const chars = '()[]{}!@#$%^&*'
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      const spaces = ' -_ '
      const getRandomItem = () => {
        let str = ''
        str = str + spaces[Math.floor(Math.random() * spaces.length)]
        if (Math.random() > 0.75) {
          str = str + chars[Math.floor(Math.random() * chars.length)]
          if (Math.random() > 0.5) {
            str = str + spaces[Math.floor(Math.random() * spaces.length)]
          }
        }
        return str
      }

      let sentence = ''
      for (let i = 0; i < noOfWords; i++) {
        const noOfLetters = getNumberBetween1and10() // random number between 1 and 10

        let word = ''
        for (let j = 0; j < noOfLetters; j++) {
          word += letters.charAt(Math.floor(Math.random() * 26))
          // console.log(word)
        }
        const space = i === noOfWords - 1 ? '' : getRandomItem()
        sentence += word + space
        // console.log(sentence)
      }
      // console.log(sentence)
      const slug = slugify(sentence)
      // console.log(slug)
      expect(validateSlug(slug)).toBeTruthy()
    })

    it('does useful things when given an arabic string', () => {
      const arabicString = 'مرحبا بالعالم'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('mr7ba-bal3alm')
    })

    it('converts arabic numbers to latin numbers', () => {
      const arabicString = '١٢٣٤٥٦٧٨٩٠'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('1234567890')
    })

    it('adds spaces when converting arabic numbers', () => {
      const arabicString = '١٢٣ ٤٥٦٧٨٩٠'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('123-4567890')
    })

    it.skip('adds spaces between letters and numbers when converting arabic numbers', () => { // skipped b/c not sure if this is desirable
      const arabicString = '١٢٣٤٥٦٧٨٩٠abc'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('1234567890-abc')
    })
  })

  describe('unslugify', () => {
    it('converts slugs to space separated uppercase words', () => {
      const slugs = ['hello-world', 'hello-world!', 'hello-world!!', 'hello-world!!!', 'very-complicated-slug-lacking-brevity']
      const expectedStrings = ['Hello World', 'Hello World!', 'Hello World!!', 'Hello World!!!', 'Very Complicated Slug Lacking Brevity']
      slugs.forEach((slug, index) => {
        const string = unslugify(slug)
        expect(string).toBe(expectedStrings[index])
      })
    })
  })

  describe('contentIdGet', () => {
    describe('first mode', () => {
      it('returns correct id for new courses', () => {
        const courseChapters = SampleCourseChapters.chapters
        const firstContentId = contentIdGet(courseChapters, 'first')
        expect(firstContentId).toBe('e1ns')
      })

      it('returns correct id for deeply nested courses', () => {
        const courseChaptersNested = SampleCourseChaptersNested.chapters
        const firstContentId = contentIdGet(courseChaptersNested, 'first')
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
        const firstContentId = contentIdGet(courseChapters, 'first')
        expect(firstContentId).toBe('ba3b89ef')
      })

      it('returns null when no id is found', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { isChapter: true, children: [] }
        ]
        expect(contentIdGet(courseChapters.slice(2), 'first')).toBeNull()
      })

      it('returns id of when given single CourseNavItem', () => {
        const courseChapters = { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] }
        expect(contentIdGet(courseChapters, 'first')).toBe('ba3b89ef')
      })

      it('returns id of first child f given single chapter', () => {
        const courseChapters = {
          isChapter: true,
          children: [
            { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
            { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 }
          ]
        }
        expect(contentIdGet(courseChapters, 'first')).toBe('ba3b89ef')
      })
    })
    describe('last mode', () => {
      it('returns correct id for new courses', () => {
        const courseChapters = SampleCourseChapters.chapters
        const lastContentId = contentIdGet(courseChapters, 'last')
        expect(lastContentId).toBe('fu3nf')
      })

      it('returns correct id for deeply nested courses', () => {
        const courseChaptersNested = SampleCourseChaptersNested.chapters
        const lastContentId = contentIdGet(courseChaptersNested, 'last')
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
        const lastContentId = contentIdGet(courseChapters, 'last')
        expect(lastContentId).toBe('d0b662f2')
      })

      it('returns null when no id is found', () => {
        const courseChapters = [
          { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
          { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 },
          { isChapter: true, children: [] }
        ]
        expect(contentIdGet(courseChapters.slice(2), 'last')).toBeNull()
      })

      it('returns id of when given single CourseNavItem', () => {
        const courseChapters = { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] }
        expect(contentIdGet(courseChapters, 'last')).toBe('ba3b89ef')
      })

      it('returns id of last child of given single chapter', () => {
        const courseChapters = {
          isChapter: true,
          children: [
            { id: 'ba3b89ef', isChapter: false, slug: 'dialog-sample', follow: [1, 2] },
            { id: 'c7c75ede', isChapter: false, slug: 'video', follow: 2 }
          ]
        }
        expect(contentIdGet(courseChapters, 'last')).toBe('c7c75ede')
      })
    })
  })

  describe('chapterFollowSet', () => {
    let courseChapters: any
    const linearChapters = {
      isChapter: true,
      children: [
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: ['zw31', 'dr31'] },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'fu3nf' },
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: null }
      ]
    }
    beforeEach(() => {
      courseChapters = deepCopy(linearChapters)
    })

    it('sets follow property for all chapters', () => {
      courseChapters.children.forEach((chapter: any) => { chapter.follow = null })
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: null },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'fu3nf' },
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: null }
      ])
    })

    it('sets follow correctly when order is reversed', () => {
      courseChapters.children.reverse()
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'zw31' },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'e1n5' },
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: ['zw31', 'dr31'] }
      ])
    })

    it('sets follow correctly in nested chapters', () => {
      courseChapters = {
        isChapter: true,
        children: [
          {
            id: 'b',
            isChapter: true,
            children: [
              { id: 'e', isChapter: false },
              { id: 'f', isChapter: false }
            ]
          },
          { id: 'c', isChapter: false },
          { id: 'd', isChapter: false }
        ]
      }
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        {
          id: 'b',
          isChapter: true,
          children: [
            { id: 'e', isChapter: false, follow: 'f' },
            { id: 'f', isChapter: false, follow: 'c' }
          ]
        },
        { id: 'c', isChapter: false, follow: 'd' },
        { id: 'd', isChapter: false, follow: null }
      ])
    })
  })

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
      const navItem = contentBlockToNavItemTransform(content)
      expect(typeof navItem).toBe('object')
      expect(Array.isArray(navItem)).toBeFalsy()
    })

    it('returns a proper navItem', () => {
      const navItem = contentBlockToNavItemTransform(content)
      expect(Object.keys(navItem)).toContain('isChapter')
    })

    it('does not create a slug that ends on "edit" and returns false', () => {
      content.title.text = 'Edit'
      const navItem = contentBlockToNavItemTransform(content)
      expect(navItem.slug).not.toBe('edit')
    })

    it('does not create a slug that ends on "new" and returns false', () => {
      content.title.text = 'New'
      const navItem = contentBlockToNavItemTransform(content)
      expect(navItem.slug).not.toBe('new')
    })
  })

  describe('coursePathsGet', () => {
    it('returns correct paths for old courses', () => { // FIXME: this is new course structure
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

  describe('courseStructureChapterNames', () => {
    it('returns null if no chapter array is passed', () => {
      expect(courseStructureChapterNames(null)).toBeNull()
      expect(courseStructureChapterNames(undefined)).toBeNull()
    })
    it('returns empty object for empty chapter array', () => {
      expect(courseStructureChapterNames([])).toStrictEqual({})
    })
    it('returns the correct object for simple chapters', () => {
      expect(courseStructureChapterNames(SampleCourseChapters.chapters)).toStrictEqual({
        video: 'video',
        editor: 'Editor',
        quiz: 'quiz'
      })
    })
    it('returns the correct object for nested chapters', () => {
      expect(courseStructureChapterNames(SampleCourseChaptersNested.chapters)).toStrictEqual({
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

  describe('courseStructureDescent', () => { // TODO: reactivate
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
      const [ids, paths] = courseStructureDescent(singleChapterCourseStructure, 'h4b3mu5p4p4m')
      expect(Object.keys(ids)).toHaveLength(1)
      expect(Object.keys(ids)).toContainEqual('h4b3mu5p4p4m')
      expect(paths).toHaveLength(1)
      expect(paths).toContainEqual(['', 'h4b3mu5p4p4m'])
    })

    it('returns correct paths for new courses (no trimming)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [ids, paths] = courseStructureDescent(courseChapters, 'e1ns')
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
      const [ids, paths] = courseStructureDescent(courseChapters, 'chapter')
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
      const [_, paths] = courseStructureDescent(courseChapters, 'block')
      expect(paths).toContainEqual(['video', 'zw31'])
      expect(paths).toContainEqual(['wysiwyg', 'dr31'])
    })

    it('returns correct paths for deeply nested courses (no trimming)', () => {
      const courseChaptersNested = SampleCourseChaptersNested.chapters
      const [ids, paths] = courseStructureDescent(courseChaptersNested)
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
      const [ids, paths] = courseStructureDescent(courseChaptersNested, 'block')
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
      const [ids, paths] = courseStructureDescent(courseChaptersNested, 'chapter')
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

  describe('courseStructureContentIdsExtract', () => {
    it('returns correct ids for new courses', () => {
      const courseChapters = SampleCourseChapters.chapters
      const ids = {}
      courseStructureContentIdsExtract(courseChapters, ids)
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
      courseStructureContentIdsExtract(courseChaptersNested, ids)
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
