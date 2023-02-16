import { courseChapterTransformToDraggable, courseChapterNameConvertToId } from '@/misc/course-navigation-utils'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'

describe('course navigation utils', () => {
  describe('courseChapterTransformToDraggable', () => {
    it('for array, returns object with isChapter true and children', () => {
      const result = courseChapterTransformToDraggable(SampleCourseChapters.chapters)
      // @ts-ignore
      expect(result.isChapter).toBe(true)
      // @ts-ignore
      expect(result.children).toBeDefined()
      // @ts-ignore
      expect(result.children.length).toBe(4)
      // @ts-ignore
      result.children.forEach((child: any, index) => {
        console.log('child', child)
        if (index !== 3) {
          // expect(child.length).toBe(1)
          expect(child.isChapter).toBe(false)
        } else {
          expect(child.isChapter).toBe(true)
          // @ts-ignore
          expect(child.children.length).toBe(2)
        }
      })
    })
  })

  describe('courseChapterNameConvertToId', () => {
    it('converts single word chapter name to lowercase id', () => {
      const result = courseChapterNameConvertToId('Introduction')
      expect(result).toBe('introduction')
    })
    it('converts multi word chapter name to camelCase id', () => {
      const result = courseChapterNameConvertToId('Introduction to LAYA')
      expect(result).toBe('introductionToLAYA')
    })
    it('converts multi word chapter name with spaces to camelCase id', () => {
      const result = courseChapterNameConvertToId('Introduction to LAYA   ')
      expect(result).toBe('introductionToLAYA')
    })
    it('converts multi word chapter name with spaces and special characters to camelCase id', () => {
      const result = courseChapterNameConvertToId('Introduction to LAYA   !@#$%^&*()_+')
      expect(result).toBe('introductionToLAYA')
    })
  })
})
