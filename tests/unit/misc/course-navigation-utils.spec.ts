import { courseChapterTransformToDraggable } from '@/misc/course-navigation-utils'
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
})
