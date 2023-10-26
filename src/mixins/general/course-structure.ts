/**
 * @fileOverview course-structure.ts - methods for course structure
 * @author cmc
 * @since 1.3.0
 */

import {
  ContentBlock,
  CourseNavigationItem,
  CourseNavigationItemBlock,
  LegacyContentBlock
} from '@/mixins/types/course-structure'
import { chapterSlugRoutingIssueAvoid } from '@/mixins/general/course-chapters'

/**
 * @description traverses chapters, extracts object that has slugs as keys and chapterNames as values
 * @param chapters courseChapters to inspect
 */
export const courseChaptersCollect = (chapters: CourseNavigationItem[]): object => {
  if (!chapters) {
    return null
  }
  let chapterNames = {}
  chapters.forEach((chapter: any) => {
    if (chapter.isChapter) {
      chapterNames[chapter.slug] = chapter.chapterName
      chapterNames = { ...chapterNames, ...courseChaptersCollect(chapter.children) }
    }
    return chapterNames
  })
  return chapterNames
}

/**
 * @description transform a content block into a course chapter
 * @param block to be transformed into chapter
 */
export const courseContentBlockToNavItemTransform = (block: ContentBlock): CourseNavigationItemBlock => {
  const slug = chapterSlugRoutingIssueAvoid(block.title.text, block.name)
  return {
    id: block.id,
    isChapter: false,
    slug,
    type: block.name,
    follow: null
  }
}

/**
 * @function return id of first or last content in chapter, recursively if nested
 * @author cmc
 * @since v1.3.0
 * @param courseNav list of or single CourseNavigationItem
 * @param mode either 'first' or 'last'
 */
export const courseContentIdGet = (courseNav: any, mode: string): string => {
  if (!courseNav || (mode !== 'first' && mode !== 'last')) {
    return null
  }
  if (Array.isArray(courseNav)) { // courseNav is CourseNavigationItem[]
    const index = mode === 'first' ? 0 : courseNav.length - 1 // first or last element depending on mode
    if (courseNav.length === 0) {
      return null
    } else if (courseNav[index].isChapter) {
      return courseContentIdGet(courseNav[index].children, mode)
    } else {
      return courseNav[index].id
    }
  } else if (courseNav.isChapter) { // courseNav is CourseNavigationItemChapter
    return courseContentIdGet(courseNav.children, mode)
  } else { // courseNav is CourseNavigationItemBlock
    return courseNav.id
  }
}

/**
 * @description traverse course structure object, extracting all content ids and
 *  writing them to `ids` object
 * @param structure course structure object
 * @param ids object containing ids of content blocks, will be modified consisting
 *  all ids of content blocks in course structure
 */
export const courseContentIdsExtract = (structure: any, ids: any): void => {
  if (Array.isArray(structure)) { // structure is array of CourseNavigationItems
    structure.forEach(item => courseContentIdsExtract(item, ids))
  } else if (structure.isChapter && structure.children) { // structure is single CourseNavigationItem
    structure.children.forEach((item: CourseNavigationItem) => courseContentIdsExtract(item, ids)) // recursively call for each child
  } else {
    ids[structure.id] = {}
  }
}

/**
 * @description traverse course nav object, return tuple: object with ids of content blocks and list of routes
 * @param courseChapters course structure object
 * @param subChapterSlug course property (trim subchapter slug when only one subchapter)
 * @returns [courseContent, courseRoutes] - courseContent: object with ids as
 *  keys, courseRoutes: list of tuples [route, id]
 */
export const courseDestructure = (
  courseChapters: CourseNavigationItem[],
  subChapterSlug?: string
):
  [
    { [id: string]: {} },
    any[]
  ] => {
  const ids: { [id: string]: {} } = {}
  courseContentIdsExtract(courseChapters, ids)
  const routes = coursePathsGet(courseChapters)
  if (subChapterSlug) {
    courseSlugsTrim(routes, subChapterSlug)
  }
  return [ids, routes]
}

/**
 * @description traverse course nav object, return set of all paths
 * @param courseNav course navigation object
 * @returns list of tuples with route and id
 */
export const coursePathsGet = (courseNav: CourseNavigationItem[]): { [id: string]: string[] } => {
  const routes = {} // instantiate here because of recursion
  // const start = courseContentIdGet(courseNav, 'first')
  // if (start) {
  //   routes.push(['', start])
  // }
  courseRoutesCollect(courseNav, '', routes)
  // return routes
  return {}
}

/**
 * @description descent into course navigation structure and add routes to array
 * @param structure - course navigation structure
 * @param currentPath - current path in course navigation structure
 * @param routes - array of routes, will be modified
 */
const courseRoutesCollect = (
  structure: any,
  currentPath: string[],
  routes: object
) => {
  if (structure instanceof Array) { // structure is CourseNavigationItem[]
    structure.forEach((item) => {
      courseRoutesCollect(item, currentPath, routes)
      // routes.push([currentPath + '/' + item.slug ? item.slug : item.id, item.id]) // can have alternative path
    })
  } else if (structure.isChapter) { // structure is CourseNavigationItemChapter
    courseRoutesCollect(structure.children, currentPath.push(structure.slug), routes)
  } else if (!Object.keys(routes).some(el => el === structure.id)) { // add path to routes if id is not already there
    routes[structure.id] = currentPath.push(structure.slug)
  }
}

/**
 * @description find chapters with only one item and remove slug
 * @author cmc
 * @since v1.3.0
 * @param routes list of routes
 * @param subChapterSlug slug to keep (chapter name or block title)
 */
const courseSlugsTrim = (
  routes: { [id: string]: string[] },
  subChapterSlug: string
): void => {
  if (subChapterSlug === 'chapter' || subChapterSlug === 'block') {
    Object.keys(routes).forEach((id: string, i) => {
      if (routes[id].length >= 2) { // more than one member => subchapters
        const subChapter = routes.filter(
          e => e[0].includes(pathList.slice(0, -1).join('/'))
        )// find all subchapters i.e. all paths with same prefix
        // @ts-ignore
        if (subChapter.length === 1) { // only one subchapter => remove slug from path
          const pathList = route[0].split('/')
          if (subChapterSlug === 'chapter') { // keep chapter slug
            route[0] = pathList.slice(0, -1).join('/')
          } else { // keep block slug
            route[0] = pathList.length > 2
              ? pathList.slice(0, -2).join('/') + '/' + pathList.slice(-1)
              : '' + pathList.slice(-1)
          }
        }
      }
    })
  }
}
