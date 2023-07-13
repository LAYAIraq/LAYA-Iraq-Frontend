/**
 * @fileOverview utility functions for course navigation
 * @author cmc
 * @since 1.3.0
 */
import { CourseNavigationItem } from '@/mixins/types/course-structure'

/**
 * @description transform course navigation structure object to draggable array
 * @param courseChapter course navigation structure object
 */
export const courseChapterTransformToDraggable = (courseChapter: CourseNavigationItem[] | CourseNavigationItem): CourseNavigationItem => {
  if (courseChapter instanceof Array) { // courseChapter is CourseNavigationItem[]
    return {
      isChapter: true,
      children: courseChapter.map((item) => courseChapterTransformToDraggable(item))
    }
  } else if (Object.prototype.hasOwnProperty.call(courseChapter, 'id')) { // courseChapter is CourseNavigationItem
    return {
      children: [],
      isChapter: false,
      ...courseChapter
    }
  } else { // courseChapter is CourseNavigation
    return {
      isChapter: true,
      children: Object.keys(courseChapter).map((chapter) => {
        return {
          ...courseChapterTransformToDraggable(courseChapter[chapter]),
          chapterName: chapter
        }
      })
    }
  }
}

/**
 * @description converts chapter name to camelCase id
 * @author cmc
 * @param name string chapter name
 * @returns string camelCase id
 */
export const courseChapterNameConvertToId = (name: string): string => {
  const tokens = name.split(' ')
  tokens.forEach((token, i) => { // remove non-alphanumeric characters
    tokens[i] = token.replace(/[^a-zA-Z0-9]/g, '')
  })
  // concatenate tokens, first token lowercase, rest camelCase
  return tokens[0].toLowerCase() +
    tokens.slice(1).map(
      (token) => token.charAt(0).toUpperCase() + token.slice(1)
    ).join('')
}

/**
 * @description converts chapter id to human readable name, e.g. 'chapterOne' -> 'Chapter One'
 * @author cmc
 * @param id string chapter id
 * @returns string human readable name
 */
export const courseChapterIdConvertToName = (id: string): string => {
  const tokens = id.split(/(?=[A-Z])/)
  // concatenate tokens, first token lowercase, rest camelCase
  return tokens.map(
    (token) => token.charAt(0).toUpperCase() + token.slice(1)
  ).join(' ')
}
