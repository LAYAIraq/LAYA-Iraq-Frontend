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
export const legacyContentFollowTransform = (courseChapters: CourseNavigationItemBlock[]): void => {
  courseChapters.forEach(chapter => {
    const transformNumberToId = (follow: number): string => {
      const followChapter = courseChapters[follow] ? courseChapters[follow].id : null
      console.log('followChapter', followChapter)
      return followChapter
    }
    console.log('chapter', chapter.id)
    if (Array.isArray(chapter.follow)) {
      chapter.follow.forEach((follow: any, i: number) => {
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
export const slugify = (text: string): string => {
  // check if there are non-latin letters
  // eslint-disable-next-line no-control-regex
  const nonLatin = text.match(/[^\u0000-\u00ff]/)
  if (nonLatin) {
    // replace arabic letters with latin letters
    text = arabicToChat(text)
  }
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
 * @description descent into course navigation structure and add routes to array
 * @param structure - course navigation structure
 * @param currentPath - current path in course navigation structure
 * @param routes - array of routes, will be modified
 */
const courseStructureRoutesCollect = (
  structure: any,
  currentPath: string,
  routes: Array<[route: string, id: string]>
) => {
  const currentPathSnippet = currentPath ? currentPath + '/' : ''
  if (structure instanceof Array) { // structure is CourseNavigationItem[]
    structure.forEach((item) => {
      courseStructureRoutesCollect(item, currentPath, routes)
      // routes.push([currentPath + '/' + item.slug ? item.slug : item.id, item.id]) // can have alternative path
    })
  } else if (structure.isChapter) { // structure is CourseNavigationItemChapter
    courseStructureRoutesCollect(structure.children, currentPathSnippet + structure.slug, routes)
  } else if (!routes.some(el => el[1] === structure.id)) { // add path to routes if id is not already there
    routes.push([currentPathSnippet + structure.slug, structure.id])
  }
}

/**
 * @description traverses chapters, extracts object that has slugs as keys and chapterNames as values
 * @param chapters courseChapters to inspect
 */
export const courseStructureChapterNames = (chapters: CourseNavigationItem[]): object => {
  if (!chapters) {
    return null
  }
  let chapterNames = {}
  chapters.forEach((chapter: any) => {
    if (chapter.isChapter) {
      chapterNames[chapter.slug] = chapter.chapterName
      chapterNames = { ...chapterNames, ...courseStructureChapterNames(chapter.children) }
    }
    return chapterNames
  })
  return chapterNames
}

/**
 * @function return id of first content in chapter, recursively if nested
 * @author cmc
 * @since v1.3.0
 * @param courseNav list of or single CourseNavigationItem
 * @param mode either 'first' or 'last'
 */
export const contentIdGet = (courseNav: any, mode: string): string => {
  if (!courseNav || (mode !== 'first' && mode !== 'last')) {
    return null
  }
  if (Array.isArray(courseNav)) { // courseNav is CourseNavigationItem[]
    const index = mode === 'first' ? 0 : courseNav.length - 1 // first or last element depending on mode
    if (courseNav.length === 0) {
      return null
    } else if (courseNav[index].isChapter) {
      return contentIdGet(courseNav[index].children, mode)
    } else {
      return courseNav[index].id
    }
  } else if (courseNav.isChapter) { // courseNav is CourseNavigationItemChapter
    return contentIdGet(courseNav.children, mode)
  } else { // courseNav is CourseNavigationItemBlock
    return courseNav.id
  }
}

/**
 * @description slugs ending in 'new' and 'edit' can cause routing issues; therefore, avoid them
 * @param title text to be turned to slug
 * @param type type of block for fallback
 */
const chapterSlugRoutingIssueAvoid = (title: string, type: string): string => {
  const slug = slugify(title)
  const noConflict = slug !== 'edit' && slug !== 'new' // avoid routing issues with edit views
  return noConflict ? slug : slug + '-' + type
}

/**
 * @description recursively check for duplicate slugs per level, adding ascending suffixes
 * @param chapters Course navigation to check
 */
export const chapterSlugDuplicateAvoid = (chapters: CourseNavigationItem[]) => {
  chapters.forEach((el: any, i) => {
    if (el.isChapter) {
      chapterSlugDuplicateAvoid(el.children)
    } else {
      let count = 2 // ascending count in case there are several duplicates
      chapters.forEach((el2, j) => {
        if (i !== j && el.slug === el2.slug) { // same slug at different indexes
          el2.slug += `-${count}` // append count to slug
          count++
        }
      })
    }
  })
}

/**
 * @description transform a content block into a course chapter
 * @param block to be transformed into chapter
 */
export const contentBlockToNavItemTransform = (block: ContentBlock): CourseNavigationItemBlock => {
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
 * @function set all follow properties to the next content block, barring button navigation blocks
 * @author cmc
 * @since v1.3.0
 * @param chapter reference to chapter that is examined
 * @param nextChapter reference to following chapter (when called recursively)
 */
export const chapterFollowSet = (chapter: CourseNavigationItem | any, nextChapter: CourseNavigationItem) => {
  chapter.children.forEach((item: any, i: number) => {
    const followingChapter = i === chapter.children.length - 1
      ? nextChapter
      : chapter.children[i + 1]
    if (item.isChapter) {
      chapterFollowSet(item, followingChapter)
    } else if (item.type !== 'button-navigation') {
      item.follow = contentIdGet(followingChapter, 'first')
    } // else: button-navigation => no new follow
  })
}

/**
 * @description update slug for chapter corresponding to id
 * @param chapters Course Navigation
 * @param id of course block that had title updated
 * @param title the updated title to be turned into a new slug
 * @param type type of corresponding block to avoid routing issues
 */
export const chapterSlugUpdate = (chapters: CourseNavigationItem[], id: string, title: string, type: string) => {
  chapters.forEach((chapter: any) => {
    if (chapter.isChapter) {
      chapterSlugUpdate(chapter.children, id, title, type)
    } else if (chapter.id === id) {
      chapter.slug = chapterSlugRoutingIssueAvoid(title, type)
    }
  })
}

/**
 * @description traverse course nav object, return set of all paths
 * @param courseNav course navigation object
 * @returns list of tuples with route and id
 */
export const coursePathsGet =
  (courseNav: CourseNavigationItem[]):
    any[] => {
    const routes = [] // instantiate here because of recursion
    const start = contentIdGet(courseNav, 'first')
    if (start) {
      routes.push(['', start])
    }
    courseStructureRoutesCollect(courseNav, '', routes)
    return routes
  }

/**
 * @description traverse course structure object, extracting all content ids and
 *  writing them to `ids` object
 * @param structure course structure object
 * @param ids object containing ids of content blocks, will be modified consisting
 *  all ids of content blocks in course structure
 */
export const courseStructureContentIdsExtract = (structure: any, ids: any): void => {
  if (Array.isArray(structure)) { // structure is array of CourseNavigationItems
    structure.forEach(item => courseStructureContentIdsExtract(item, ids))
  } else if (structure.isChapter && structure.children) { // structure is single CourseNavigationItem
    structure.children.forEach((item: CourseNavigationItem) => courseStructureContentIdsExtract(item, ids)) // recursively call for each child
  } else {
    ids[structure.id] = {}
  }
}

/**
 * @description find chapters with only one item and remove slug
 * @author cmc
 * @since v1.3.0
 * @param routes list of routes
 * @param subChapterSlug slug to keep (chapter or block)
 */
const courseSubChapterSlugTrim = (
  routes: Array<[route: string, id: string]>,
  subChapterSlug: string
): void => {
  if (subChapterSlug === 'chapter' || subChapterSlug === 'block') {
    routes.forEach((route: [string, string]) => {
      const pathList = route[0].split('/') // split path into list
      if (pathList.length >= 2) { // more than one member => subchapters
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

/**
 * @description traverse courseChapters, create mapping ids to follow
 * @param chapter chapter array or CourseNavItem
 * @param map resulting mapping
 */
export const courseChaptersExtractFollow = (chapter: any, map: object) => {
  if (Array.isArray(chapter)) {
    chapter.forEach(child => courseChaptersExtractFollow(child, map))
  } else if (chapter.isChapter) { // recursively call itself
    chapter.children.forEach((child: any) => {
      courseChaptersExtractFollow(child, map)
    })
  } else {
    map[chapter.id] = chapter.follow
  }
}

/**
 * @description traverse course nav object, return tuple: object with ids of content blocks and list of routes
 * @param courseChapters course structure object
 * @param subChapterSlug course property (trim subchapter slug when only one subchapter)
 * @returns [courseContent, courseRoutes] - courseContent: object with ids as
 *  keys, courseRoutes: list of tuples [route, id]
 */
export const courseStructureDescent = (
  courseChapters: CourseNavigationItem[],
  subChapterSlug?: string
):
  [
    { [id: string]: {} },
    any[]
  ] => {
  const ids: { [id: string]: {} } = {}
  courseStructureContentIdsExtract(courseChapters, ids)
  const routes = coursePathsGet(courseChapters)
  if (subChapterSlug) {
    courseSubChapterSlugTrim(routes, subChapterSlug)
  }
  return [ids, routes]
}

// take arabic string, transcribe to chat alphabet
const arabicToChat = (text: string): string => {
  // transform arabic letters to latin letters
  text = text.replace(/[\u0600-\u06FF]/g, (letter) => {
    return arabicToLatin[letter]
  })
  // replace 'aa' with hyphen
  text = text.replace(/aa/g, '-')
  // remove any double vowels
  text = text.replace(/([aeiou])\1+/g, '$1')
  return text
}

// lookup table for mapping arabic to latin letters
const arabicToLatin = {
  ء: '2',
  آ: '2',
  أ: '2',
  ؤ: '2',
  إ: '2',
  ئ: '2',
  ا: 'A',
  ب: 'B',
  ة: 'H',
  ت: 'T',
  ث: 'th',
  ج: 'j',
  ح: '7',
  خ: 'kh',
  د: 'D',
  ذ: 'DH',
  ر: 'R',
  ز: 'Z',
  س: 'S',
  ش: 'SH',
  ص: '9',
  ض: 'DH',
  ط: '6',
  ظ: 'TH',
  ع: '3',
  غ: '8',
  ف: 'F',
  ق: 'Q',
  ك: 'K',
  ل: 'L',
  م: 'M',
  ن: 'N',
  ه: 'H',
  و: 'W',
  ى: 'A',
  ي: 'I',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9'
}
