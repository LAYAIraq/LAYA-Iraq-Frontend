/**
 * @fileOverview course-structure-methods.ts - methods for course structure
 * @author cmc
 * @since 1.3.0
 * @dependencies course-structure-types.ts
 */

import {
  CourseNavigationStructure,
  CourseNavigationItem,
  LegacyContentBlock
} from './course-structure-types'

/**
 * @description breaks nextStep property into array of numbers,
 *   used for converting old navigation into new
 * @param block course content block containing nextStep property
 */
export const breakSteps = (block: LegacyContentBlock): number[] | number => {
  if (block.nextStep === null) {
    console.log('no following step')
    return null
  }
  const stepsArray = block.nextStep.split(',')
  const stepsInt = stepsArray.map((step) => parseInt(step) - 1)
  return stepsInt.length > 1 ? stepsInt : stepsInt[0] // return array if more than one step
}

/**
  * @description converts string to slug
  * @author mathewbyrne, edited by cmc
  * @see https://gist.github.com/mathewbyrne/1280286
 *  @param text string to convert
 */
export const slugify = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/_/g, '-') // Replace _ with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * @description add start route to array of routes
 * @param item course navigation item
 * @param start start of course (id or index)
 * @param routes array of routes
 * @param idx index of item in array (for old course structure)
 */
const addStartRoute = (
  item: CourseNavigationItem,
  start: number | string,
  routes: Array<any>,
  idx?: number
): void => {
  if (
    (typeof start === 'number' && idx === start) || // start element is given by number => index
    (typeof start === 'string' && item.id === start) // start element is given by string => id
  ) {
    routes.push(['', item.id])
  }
}

/**
 * @description descent into course navigation structure and add routes to array
 * @param structure - course navigation structure
 * @param start - start of course navigation
 * @param currentPath - current path in course navigation structure
 * @param routes - array of routes, will be modified
 */
const traverseNavStructure = (
  structure: CourseNavigationStructure,
  start: string | number,
  currentPath: string,
  routes: Array<[route: string, id: string]>
) => {
  if (structure instanceof Array) { // stucture is CourseNavigationItem[]
    structure.forEach((item) => {
      addStartRoute(item, start, routes, structure.indexOf(item))
      routes.push([currentPath + '/' + item.slug ? item.slug : item.id, item.id]) // can have alternative path
    })
  } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
    // @ts-ignore
    addStartRoute(structure, start, routes)
    // @ts-ignore
    routes.push([currentPath + '/' + structure.slug, structure.id])
  } else { // structure is CourseNavigationChapter
    for (const chapter in structure) {
      console.log('chapter', chapter)
      traverseNavStructure(structure[chapter], start, currentPath + '/' + chapter, routes)
    }
  }
}

/**
 * @description traverse course nav object, return set of all paths
 * @param courseNav course navigation object
 * @param start course starting point (id or array index)
 * @returns list of tuples with route and id
 */
export const getPaths =
  (courseNav: CourseNavigationStructure, start: number | string):
  [[route: string, id: string]] => {
  // @ts-ignore
    const routes: [[route: string, id: string]] = [] // instantiate here because of recursion
    traverseNavStructure(courseNav, start, '', routes)
    for (const route of routes) {
      if (route[0][0] === '/') {
        route[0] = route[0].substring(1)
      } // remove leading slash
    }
    return routes
  }

/**
 * @description traverse course structure object, extracting all content ids and
 *  writing them to `ids` object
 * @param structure course structure object
 * @param ids object containing ids of content blocks, will be modified consisting
 *  all ids of content blocks in course structure
 */
const traverseCourseStructure = (structure: CourseNavigationStructure, ids: any): void => {
  if (structure instanceof Array) { // stucture is CourseNavigationItem[]
    structure.forEach((item) => {
      ids[item.id] = {}
    })
  } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
    // @ts-ignore
    ids[structure.id] = {}
  } else { // structure is CourseNavigationChapter
    for (const chapter in structure) {
      traverseCourseStructure(structure[chapter], ids)
    }
  }
}

/**
 * @description find chapters with only one item and remove slug
 * @param routes list of routes
 * @param courseNav the course navigation object the routes were generated from
 */
const subChapterSlugTrim = (
  routes: Array<[route: string, id: string]>,
  courseNav: CourseNavigationStructure
): void => {
  routes.forEach((route) => {
    const pathList = route[0].split('/') // split path into list
    if (pathList.length >= 2) { // more than one member => subchapters
      //  TODO: refactor to check if chapter has only one item in courseNav
      console.log('subchapter', pathList.slice(-1).join('/'))
      const subChapter = routes.find(
        e => e[0].includes(pathList.slice(-1).join('/'))
      )// find all subchapters i.e. all paths with same prefix
      console.log('subchapter has route', subChapter)
      // @ts-ignore
      if (subChapter.length === 1) { // only one subchapter => remove title from path
        console.log('replacing', route[0], 'with', pathList.slice(-1).join('/'))
        route[0] = route[0].split('/').slice(-1).join('/')
      }
    }
  })
}

/**
 * @description traverse course nav object, return tuple: object with ids of content blocks and list of routes
 * @param courseChapters course structure object
 * @param start course starting point (id)
 * @param subChapterSlug course property (trim subchapter slug when only one subchapter)
 * @returns [courseContent, courseRoutes] - courseContent: object with ids as
 *  keys, courseRoutes: list of tuples [route, id]
 */
export const descentCourseChapters = (
  courseChapters: CourseNavigationStructure,
  start: string,
  subChapterSlug?: boolean
):
  [
    { [id: string]: {} },
    [[route: string, id: string]]
  ] => {
  const ids: { [id: string]: {} } = {}
  traverseCourseStructure(courseChapters, ids)
  const routes = getPaths(courseChapters, start)
  if (subChapterSlug) {
    subChapterSlugTrim(routes, courseChapters)
  }
  return [ids, routes]
}

const hasFollowUp = (item: CourseNavigationItem): boolean => {
  return item.follow !== undefined && item.follow !== null
}

export const courseNavFilledOut = (courseNav: CourseNavigationStructure): boolean => { // TODO finish
  if (courseNav instanceof Array) {
    let filledOut = true
    courseNav.forEach((item) => {
      if (courseNav.indexOf(item) === courseNav.length - 1) {
        filledOut = hasFollowUp(item)
      }
    })
  } else if (Object.prototype.hasOwnProperty.call(courseNav, 'id')) {
    return courseNav.follow !== undefined && courseNav.follow !== null
  } else {
    for (const chapter in courseNav) {
      if (courseNavFilledOut(courseNav[chapter])) {
        return true
      }
    }
  }
  return false
}
