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
 * @description follwing content can be marked with number (step) or string
 * (id/slug), also as array
 */
type FollowingContent = string | number | string[] | number[]

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
  slug: string | number,
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
  start: string | number,
  structure: CourseNavigationStructure
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
  return stepsArray.length > 1 ? stepsInt : stepsInt[0]
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
 */
export const getPaths = (courseNav: CourseNavigation): { [key: string]: string } => {
  const routes = {}
  const addStartRoute = (item: CourseNavigationItem, start: number | string, idx?: number): void => {
    if (typeof start === 'number' && idx === start) {
      routes[''] = item.id
    } else if (typeof start === 'string' && item.slug === start) {
      routes[''] = item.id
    } else {
      console.warn('start property does not match any slug')
    }
  }
  const traverse = (structure: CourseNavigationStructure, currentPath: string) => {
    if (structure instanceof Array) { // stucture is CourseNavigationItem[]
      structure.forEach((item) => {
        addStartRoute(item, courseNav.start, structure.indexOf(item))
        routes[currentPath + '/' + item.slug] = item.id // can have alternative path
      })
    } else if (Object.prototype.hasOwnProperty.call(structure, 'follow')) { // structure is CourseNavigationItem
      // @ts-ignore
      addStartRoute(structure, courseNav.start)
      routes[currentPath + '/' + structure.slug] = structure.id
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
