/**
 * @fileOverview types for course structure, old and new
 * @author cmc
 * @since 1.3.0
 * @dependencies none
 */

// Old course structure
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

export type LegacyContentInput = LegacyContentBlock[]

export interface LegacyCourse {
  abstract: string,
  category: string,
  content: LegacyContentInput
  files: string[],
  name: string,
  properties: object,
  readonly authorId: number,
  readonly courseId: string,
  readonly lastChanged?: number | string,
  readonly locked: boolean,
  storageId: string
}

// New course structure

/**
 * @description following content is marked by string (id) or array of strings (ids)
 */
type FollowingContent = string | string[] | number | number[]

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
  type?: string,
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
  chapterNames?:{ [chapterName: string]: string }, // chapter names for breadcrumb
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
