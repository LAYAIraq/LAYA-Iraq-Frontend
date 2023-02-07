import { CourseNavigationStructure } from '@/misc/course-structure-types'
import { DraggableCourseChapter } from '@/misc/course-navigation-types'

export const courseChapterTransformToDraggable = (courseChapter: CourseNavigationStructure): DraggableCourseChapter => {
  console.log('receiving', courseChapter)
  if (courseChapter instanceof Array) { // courseChapter is CourseNavigationItem[]
    const res = {
      isChapter: true,
      children: courseChapter.map((item) => courseChapterTransformToDraggable(item))
    }
    console.log('returning', res)
    return res
  } else if (Object.prototype.hasOwnProperty.call(courseChapter, 'id')) { // courseChapter is CourseNavigationItem
    const res = {
      children: [],
      isChapter: false,
      ...courseChapter
    }
    console.log('returning', res)
    return res
  } else { // courseChapter is CourseNavigationStructure
    const res = {
      isChapter: true,
      children: Object.keys(courseChapter).map((chapter) => {
        return {
          ...courseChapterTransformToDraggable(courseChapter[chapter]),
          chapterName: chapter
        }
      })
    }
    console.log('returning', res)
    return res
  }
}
