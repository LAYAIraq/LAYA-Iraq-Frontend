/**
 * @fileOverview types for course structure, old and new
 * @author cmc
 * @since 1.3.0
 */

// Old course structure
export type LegacyContentBlock = {
  name: string,
  input: {
    title: {
      flagged?: boolean
      id: string
      simple?: string
      text: string
    },
    [key: string]: any
  },
  nextStep: string | null
}

export type LegacyContentInput = LegacyContentBlock[]

export interface LegacyCourse {
  abstract: string
  category: string
  content: LegacyContentInput
  files: string[]
  name: string
  properties: object
  readonly authorId: number
  readonly courseId: string
  readonly lastChanged?: number | string
  readonly locked: boolean
  storageId: string
}

// New course structure

/**
 * @description following content is marked by string (id) or array of strings (ids)
 */
type FollowingContent = string | string[] | number | number[]

/**
 * @description Course navigation item has id and slug
 * @property id unique id for course content block
 * @property slug slug for course content block (can be used for route)
 */
export interface CourseNavigationItem {
  isChapter: boolean,
  slug: string
}

/**
 * @description Course Chapters have a chapterName and a list of child CourseNavigationItems
 * @property chapterName Name for chapter
 * @property children List of children, i.e. sub-chapters
 */
export interface CourseNavigationItemChapter extends CourseNavigationItem {
  chapterName: string,
  children: CourseNavigationItem[],
}

/**
 * @description Course Blocks have type, id and follow set
 * @property type name of plugin type
 * @property id unique id for content block, used for lookup
 * @property follow Content following, single id or list of ids (only for button-navigation)
 */
export interface CourseNavigationItemBlock extends CourseNavigationItem {
  type: string,
  id: string,
  follow: FollowingContent
}

/**
 * @description new course structure
 * @property id - unique id for course
 * @property name - name of course
 * @property abstract - abstract of course
 * @property category - category of course
 * @property chapters - content of course structured as nested array
 * @property start - id of first content block
 */
export type Course = {
  courseId: string
  name: string
  start: string
  abstract: string
  category: string
  chapters: CourseNavigationItem[]
  chapterNames?:{ [chapterName: string]: string } // chapter names for breadcrumb
  [key: string]: any
}

/**
 * @description Course content block (new back end)
 * @property id - unique id for course content block
 * @property name - name of content plugin type (e.g. 'laya-dialog')
 * @property title - title of content block
 */
export type ContentBlock = {
  id: string
  name: string
  title: { text: string }
  [prop: string]: any
}
