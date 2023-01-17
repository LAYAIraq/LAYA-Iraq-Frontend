import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import {
  Course,
  LegacyContentBlock,
  LegacyCourse
} from '@/misc/course-structure-types'
import {
  breakSteps,
  descentCourseChapters,
  getPaths,
  slugify
} from '@/misc/course-structure-methods'
import { validateSlug } from '../../helpers/validations'

describe('content-structure types', () => {
  describe('legacy course structure', () => {
    const isLegacyCourseStructure = (course: any): course is LegacyCourse => {
      return ('content' in course && 'properties' in course)
    }
    it('old courses fulfill the `LegacyCourse` interface', () => {
      expect(isLegacyCourseStructure(SampleCourse)).toBeTruthy()
    })
  })
  describe('new course structure', () => {
    const isCourseStructure = (course: any): course is Course => {
      return ('start' in course && 'chapters' in course)
    }
    it('new courses fulfill the `CourseNavigation` interface', () => {
      expect(isCourseStructure(SampleCourseChapters)).toBeTruthy()
    })
  })
})

describe('content-structure methods', () => {
  const getNumberBetween1and10 = () => Math.floor(Math.random() * 10) + 1
  describe('breakSteps', () => {
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
      const chapters: any = breakSteps(contentBlock)
      expect(chapters).toHaveLength(2)
      expect(Array.isArray(chapters)).toBeTruthy()
      chapters.forEach(chapter => expect(typeof chapter === 'number').toBeTruthy())
    })

    it('returns just a number for a single step', () => {
      for (let i = 1; i < content.length; i++) {
        const contentBlock = content[i]
        const chapters: any = breakSteps(contentBlock)
        expect(typeof chapters === 'number').toBeTruthy()
      }
    })

    it('returns null for no next step', () => {
      const chapters: any = breakSteps(mockContentBlock)
      expect(chapters).toBeNull()
    })

    it('return correct output for random input', () => {
      const noOfItems = getNumberBetween1and10() // random number between 1 and 10
      let steps = ''
      const follow = []
      for (let i = 0; i < noOfItems; i++) { // create random string of numbers
        const number = getNumberBetween1and10()
        steps += i === noOfItems - 1 ? `${number}` : `${number},`
        follow.push(number - 1) // -1 because of 0-indexing
      }
      mockContentBlock.nextStep = steps // set random string as nextStep
      const followSteps: any = breakSteps(mockContentBlock)
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
      const slugs = ['hello-world', 'hello-world', 'hello-world', 'hello-world']
      strings.forEach((string, i) => {
        const slug = slugify(string)
        expect(validateSlug(slug)).toBeTruthy()
        expect(slug).toBe(slugs[i])
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
      console.log(sentence)
      const slug = slugify(sentence)
      console.log(slug)
      expect(validateSlug(slug)).toBeTruthy()
    })
  })
  describe('getPaths', () => { // FIXME
    it('returns correct paths for old courses', () => {
      const courseChapters = [{ id: 'ba3b89ef', slug: 'dialog-sample', follow: [1, 2] }, {
        id: 'c7c75ede',
        slug: 'video',
        follow: 2
      }, { id: '562a0638', slug: 'wysiwyg', follow: 3 }, {
        id: 'a7bd9c9c',
        slug: 'multiple-choice-test',
        follow: 4
      }, { id: 'd0b662f2', slug: 'drag-drop-sample', follow: -1 }]
      const paths = getPaths(courseChapters, 0)
      expect(paths).toHaveLength(6)
      expect(paths).toContainEqual(['', 'ba3b89ef'])
      expect(paths).toContainEqual(['video', 'c7c75ede'])
    })
  })
  describe('descentCourseChapters', () => {
    it('returns correct paths for new courses (no trimming)', () => {
      const courseChapters = SampleCourseChapters.chapters
      const [ids, paths] = descentCourseChapters(courseChapters, 'e1ns')
      expect(Object.keys(ids).length).toBe(5)
      expect(paths).toHaveLength(6)
      expect(paths).toContainEqual(['', 'e1ns'])
      expect(paths).toContainEqual(['video/video', 'zw31'])
    })
  })
})
