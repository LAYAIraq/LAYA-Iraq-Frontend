import { CourseNavigationStructure, CourseNavigationItem } from '@/misc/course-structure-types'
import { courseStructureContentIdsExtract } from '@/misc/course-structure-methods'

const courseContentFollowExists = (item: CourseNavigationItem): boolean => {
  return item.follow !== undefined && item.follow !== null
}

/**
 * @description descends into course structure and adds all following content to edges
 * @param courseNav CourseNavigationStructure the course structure
 * @param edges object[] the edges to add to
 */
export const courseNavGraphEdges = (courseNav: CourseNavigationStructure, edges: object[]): void => {
  if (courseNav instanceof Array) { // stucture is CourseNavigationItem[], assume linear order of content
    courseNav.forEach((item, index) => {
      // TODO: check if item is a dialog, then check if it has the follow property, else just assume the next item is the follow
    })
  } else if (Object.prototype.hasOwnProperty.call(courseNav, 'id')) { // structure is CourseNavigationItem
    // @ts-expect-error b/c of check above
    if (courseContentFollowExists(courseNav)) {
      // @ts-expect-error ditto
      courseNav.follow.forEach(item => edges.push({ source: courseNav.id, target: item }))
    }
  } else {
    for (const chapter in courseNav) { // descent into chapter, adding chapters to courseNav
      courseNavGraphEdges(courseNav[chapter], edges)
    }
  }
}
