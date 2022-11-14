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
type CourseNavigationStructure =
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
    return null
  }
  const stepsArray = block.nextStep.split(',')
  const stepsInt = stepsArray.map((step) => parseInt(step))
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
 * @param courseNav course navigation object
 * @returns list of tuples with route and id
 */
export const getPaths = (courseNav: CourseNavigation): [[route: string, id: string]] => {
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
        addStartRoute(item, courseNav.start, structure.indexOf(item))
        routes.push([currentPath + '/' + item.slug, item.id]) // can have alternative path
      })
    } else if (Object.prototype.hasOwnProperty.call(structure, 'follow')) { // structure is CourseNavigationItem
      // @ts-ignore
      addStartRoute(structure, courseNav.start)
      // @ts-ignore
      routes.push([currentPath + '/' + structure.slug, structure.id])
    } else { // structure is CourseNavigationChapter
      for (const chapter in structure) {
        console.log('chapter', chapter)
        traverse(structure[chapter], currentPath + '/' + chapter)
      }
    }
  }
  traverse(courseNav.structure, '')
  return routes
}

/**
 * @description validates slug
 * @param slug slug to validate
 */
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * @description generates follow
 * @param follow
 * @param currentRoute
 */
export const getContentRoute = (follow: number | string, currentRoute: string): string => {
  if (typeof follow === 'number') { // follow is number => step TODO: remove when old course structure is removed
    const path = currentRoute.split('/') // split path into array
    if (isNaN(parseInt(path[-1]))) { // if last element is not a number, it is the beginning of a chapter
      return follow === 0 ? currentRoute : currentRoute + '/' + follow // 0 is beginning of chapter, otherwise add number
    } else { // last element is a number
      return follow === 0 ? currentRoute : path.slice(0, -1).join('/') + '/' + follow
    }
  } else { // follow is string
    return follow // TODO  do other cases: string (slug or id)
  }
}
