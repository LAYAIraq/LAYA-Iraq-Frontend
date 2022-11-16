/**
 * @fileOverview course-structure.ts - outline of the content structure as TypeScript interface
 * @author cmc
 * @since 1.3.0
 */
/***********************************************************
 ***********************************************************
 ********************* Old Course Structure ****************
 ***********************************************************
 ***********************************************************/

// course content block in old back end
export type LegacyContentBlock = {
  name: string,
  input: {
    title: {
      flagged?: boolean,
      id: string,
      simple?: string,
      text: string
    },
    [key: string]: any
  },
  nextStep: string | null
}

// course content array in old back end
export type LegacyContentInput = LegacyContentBlock[]

/**
 * @description Course structure (old back end) as TypeScript interface
 */
export interface LegacyCourse {
  abstract: string,
  category: string,
  content: LegacyContentInput
  files: string[],
  name: string,
  properties: object,
  readonly authorId: number,
  readonly courseId: string,
  readonly lastChanged: number | string,
  readonly locked: boolean,
  storageId: string
}

/***************************************************
 ***************************************************
 ********** types for new course navigation ********
 ***************************************************
 ***************************************************/

/**
 * @description following content is marked by string (id) or array of strings (ids)
 */
type FollowingContent = string | string[]

/**
 * @description Course navigation item has id and slug with optional follow
 *  property
 * @property id unique id for course content block
 * @property slug slug for course content block (can be used for route)
 * @property follow following content (can be marked with number (step) or
 *  string (id/slug), also as array)
 */
export type CourseNavigationItem = {
  id: string,
  slug: string,
  follow?: FollowingContent
}

/**
 * @description Course navigation can be either a nested object or an array
 *  (like old course structure)
 */
export type CourseNavigationStructure =
  { [chapterName: string]: CourseNavigationStructure } |
  CourseNavigationItem[] |
  CourseNavigationItem

/**
 * @description Course navigation as TypeScript interface
 * @property start start of course navigation (index of array, first chapter
 *  name or content id / slug)
 * @property structure course navigation structure (nested object or array)
 */
export type CourseNavigation = {
  start: string,
  structure: CourseNavigationStructure
}

/**
 * @description new course structure
 * @property id - unique id for course
 * @property name - name of course
 * @property abstract - abstract of course
 * @property category - category of course
 * @property chapters - content of course structured as nested object
 * @property start - id of first content block
 */
export type Course = {
  courseId: string,
  name: string,
  start: string,
  abstract: string,
  category: string,
  chapters: CourseNavigationStructure,
  [key: string]: any
}

/**
 * @description Course content block (new back end)
 * @property id - unique id for course content block
 * @property name - name of content plugin type (e.g. 'laya-dialog')
 * @property title - title of content block
 */
export type ContentBlock = {
  id: string,
  name: string,
  title: { text: string },
  [prop: string]: any
}

/**************************************************************
 **************************************************************
 ***************** functions for course structure *************
 **************************************************************
 **************************************************************/

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
  * @author mathewbyrne
  * @see https://gist.github.com/mathewbyrne/1280286
 */
export const slugify = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * @description traverse course nav object, return set of all slugs
 *  use for old course structure
 * @param courseNav course navigation object
 * @param start course starting point (id or array index)
 * @returns list of tuples with route and id
 */
export const getPaths =
  (courseNav: CourseNavigationStructure, start: number | string): [[route: string, id: string]] => {
  // @ts-ignore
    const routes: [[route: string, id: string]] = []
    const addStartRoute = (item: CourseNavigationItem, start: number | string, idx?: number): void => {
      if (
        (typeof start === 'number' && idx === start) || // start element is given by number => index
        (typeof start === 'string' && item.slug === start) // start element is given by string => id
      ) {
        routes.push(['', item.id])
      } else {
        console.warn('start property does not match any slug')
      }
    }
    const traverse = (structure: CourseNavigationStructure, currentPath: string) => {
      if (structure instanceof Array) { // stucture is CourseNavigationItem[]
        structure.forEach((item) => {
          addStartRoute(item, start, structure.indexOf(item))
          routes.push([currentPath + '/' + item.slug, item.id]) // can have alternative path
        })
      } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
      // @ts-ignore
        addStartRoute(structure, start)
        // @ts-ignore
        routes.push([currentPath + '/' + structure.slug, structure.id])
      } else { // structure is CourseNavigationChapter
        for (const chapter in structure) {
          console.log('chapter', chapter)
          traverse(structure[chapter], currentPath + '/' + chapter)
        }
      }
    }
    traverse(courseNav, '')
    return routes
  }

/**
 * @description traverse course nav object, return object of all ids
 * @param courseChapters course structure object
 * @returns [courseContent, courseRoutes] - courseContent: object with ids as
 *  keys, courseRoutes: list of tuples [route, id]
 */
export const traverseCourseChapters = (courseChapters: CourseNavigationStructure):
  [
    { [id: string]: {} },
    [[route: string, id: string]]
  ] => {
  const ids: { [id: string]: {} } = {}
  // const routes: [[route: string, id: string]] = []
  const traverse = (structure: CourseNavigationStructure) => {
    if (structure instanceof Array) { // stucture is CourseNavigationItem[]
      structure.forEach((item) => {
        ids[item.id] = {}
      })
    } else if (Object.prototype.hasOwnProperty.call(structure, 'id')) { // structure is CourseNavigationItem
      // @ts-ignore
      ids[structure.id] = {}
    } else { // structure is CourseNavigationChapter
      for (const chapter in structure) {
        traverse(structure[chapter])
      }
    }
  }
  traverse(courseChapters)
  const routes = getPaths(courseChapters, 0)
  return [ids, routes]
}
