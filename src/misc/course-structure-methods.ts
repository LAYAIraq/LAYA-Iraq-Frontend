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
export const legacyContentStepsTransform = (block: LegacyContentBlock): number[] | number => {
  if (block.nextStep === null) {
    console.log('no following step')
    return null
  }
  const stepsArray = block.nextStep.split(',')
  const stepsInt = stepsArray.map((step) => parseInt(step) - 1)
  return stepsInt.length > 1 ? stepsInt : stepsInt[0] // return array if more than one step
}

/**
 * @description transforms follow property from number to id
 * @param courseChapters array of course chapters, result of setCourseContentAndNav mutation
 */
export const legacyContentFollowTransform = (courseChapters: CourseNavigationItem[]): void => {
  courseChapters.forEach(chapter => {
    const transformNumberToId = (follow: number): string => {
      const followChapter = courseChapters[follow] ? courseChapters[follow].id : null
      console.log('followChapter', followChapter)
      return followChapter
    }
    console.log('chapter', chapter.id)
    if (Array.isArray(chapter.follow)) {
      chapter.follow.forEach((follow, i) => {
        chapter.follow[i] = transformNumberToId(follow)
      })
    } else {
      // @ts-ignore
      chapter.follow = transformNumberToId(chapter.follow)
    }
  })
}

/**
  * @description converts string to slug
  * @author mathewbyrne, edited by cmc
  * @see https://gist.github.com/mathewbyrne/1280286
 *  @param text string to convert
 */
export const slugify = (text: string): string => { // TODO: convert arabic & kurdish letters to latin
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/_/g, '-') // Replace _ with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const unslugify = (text: string): string => {
  const words = text.split('-')
  const newWords = []
  for (const word of words) {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
  }
  return newWords.join(' ')
}

/**
 * @description add start route to array of routes
 * @param item course navigation item
 * @param start start of course (id or index)
 * @param routes array of routes
 * @param idx index of item in array (for old course structure)
 */
const courseStructureRoutesStartAdd = (
  item: CourseNavigationItem,
  start: number | string,
  routes: Array<any>,
  idx?: number
): void => {
  if (
    (typeof start === 'number' && idx === start) || // start element is given by number => index
    (typeof start === 'string' && item.id === start) // start element is given by string => id
  ) {
    if (!routes.some(e => e[0] === '' && e[1] === item.id)) { // add start route if not already present
      routes.push(['', item.id])
    }
  }
}

/**
 * @description descent into course navigation structure and add routes to array
 * @param structure - course navigation structure
 * @param start - start of course navigation
 * @param currentPath - current path in course navigation structure
 * @param routes - array of routes, will be modified
 */
const courseStructureRoutesCollect = (
  structure: CourseNavigationStructure,
  start: string | number,
  currentPath: string,
  routes: Array<[route: string, id: string]>
) => {
  if (structure instanceof Array) { // stucture is CourseNavigationItem[]
    structure.forEach((item) => {
      courseStructureRoutesStartAdd(item, start, routes, structure.indexOf(item))
      courseStructureRoutesCollect(item, start, currentPath, routes)
      // routes.push([currentPath + '/' + item.slug ? item.slug : item.id, item.id]) // can have alternative path
    })
  } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
    // @ts-ignore b/c of check above
    courseStructureRoutesStartAdd(structure, start, routes)
    // @ts-ignore ditto
    routes.push([currentPath + '/' + structure.slug, structure.id])
  } else { // structure is CourseNavigationChapter
    for (const chapter of Object.keys(structure)) {
      courseStructureRoutesCollect(structure[chapter], start, currentPath + '/' + chapter, routes)
    }
  }
}

/**
 * @description traverse course nav object, return set of all paths
 * @param courseNav course navigation object
 * @param start course starting point (id or array index)
 * @returns list of tuples with route and id
 */
export const coursePathsGet =
  (courseNav: CourseNavigationStructure, start: string | number):
    [[route: string, id: string]] => {
    // @ts-ignore
    const routes: [[route: string, id: string]] = [] // instantiate here because of recursion
    courseStructureRoutesCollect(courseNav, start, '', routes)
    for (const i in routes) {
      if (routes[i][0][0] === '/') {
        // console.log('removing leading slash', routes[i][0])
        routes[i][0] = routes[i][0].substring(1)
      } // remove leading slash
      if (routes[i][1] === start || typeof start === 'number') { // remove duplicate route for start element
        for (const j in routes) {
          if (i !== j && routes[i][1] === routes[j][1]) { // remove longer duplicate route, i.e. keep ''
            if (routes[i][0].length < routes[j][0].length) {
              routes.splice(parseInt(j), 1)
            } // no other cases because '' will always be added before other routes
          }
        }
      }
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
export const courseStructureContentIdsExtract = (structure: CourseNavigationStructure, ids: any): void => {
  if (structure instanceof Array) { // stucture is CourseNavigationItem[]
    structure.forEach((item) => {
      ids[item.id] = { partOfArray: true }
    })
  } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
    // @ts-ignore
    ids[structure.id] = {}
  } else { // structure is CourseNavigationChapter
    for (const chapter in structure) {
      courseStructureContentIdsExtract(structure[chapter], ids)
    }
  }
}

/**
 * @description find chapters with only one item and remove slug
 * @author cmc
 * @since v1.3.0
 * @param routes list of routes
 */
const courseSubChapterSlugTrim = (
  routes: Array<[route: string, id: string]>
): void => {
  routes.forEach((route: [string, string]) => {
    const pathList = route[0].split('/') // split path into list
    if (pathList.length >= 2) { // more than one member => subchapters
      const subChapter = routes.filter(
        e => e[0].includes(pathList.slice(0, -1).join('/'))
      )// find all subchapters i.e. all paths with same prefix
      // @ts-ignore
      if (subChapter.length === 1) { // only one subchapter => remove slug from path
        route[0] = route[0].split('/').slice(0, -1).join('/')
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
export const courseStructureDescent = (
  courseChapters: CourseNavigationStructure,
  start: string,
  subChapterSlug?: boolean
):
  [
    { [id: string]: {} },
    [[route: string, id: string]]
  ] => {
  const ids: { [id: string]: {} } = {}
  courseStructureContentIdsExtract(courseChapters, ids)
  const routes = coursePathsGet(courseChapters, start)
  if (subChapterSlug) {
    courseSubChapterSlugTrim(routes)
  }
  return [ids, routes]
}

// lookup table for mapping arabic to latin letters
const arabicToLatin = {
  ء: 'A',
  آ: 'A',
  أ: 'A',
  ؤ: 'A',
  إ: 'A',
  ئ: 'A',
  ا: 'A',
  ب: 'B',
  ة: 'H',
  ت: 'T',
  ث: 'T',
  ج: 'J',
  ح: 'H',
  خ: 'H',
  د: 'D',
  ذ: 'D',
  ر: 'R',
  ز: 'Z',
  س: 'S',
  ش: 'S',
  ص: 'S',
  ض: 'D',
  ط: 'T',
  ظ: 'Z',
  ع: 'A',
  غ: 'G',
  ف: 'F',
  ق: 'Q',
  ك: 'K',
  ل: 'L',
  م: 'M',
  ن: 'N',
  ه: 'H',
  و: 'W',
  ى: 'A',
  ي: 'Y'
}
