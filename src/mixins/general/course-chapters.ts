/**
 * @file methods for handling chapter list or single chapter
 * @author cmc
 * @since v1.3.0
 */

import { CourseNavigationItem, CourseNavigationItemChapter } from '@/mixins/types/course-structure'
import { courseContentIdGet } from '@/mixins/general/course-structure'
import { slugify } from '@/mixins/general/slugs'

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
      item.follow = courseContentIdGet(followingChapter, 'first')
    } // else: button-navigation => no new follow
  })
}

/**
 * @description checks course chapters for coherence
 * @author cmc
 * @since v1.3.0
 * @param chapters
 */
export const chaptersCheck = (chapters: CourseNavigationItemChapter): boolean => {
  const coherentChapter = (chapter: CourseNavigationItemChapter) => {
    if (chapter.children.length === 0 || !chapter.isChapter) {
      return false
    } else {
      const subChapters = chapter.children.reduce(
        (curVal, item) => curVal + (item.isChapter ? 1 : 0),
        0) // count the number of chapters in the children
      return subChapters === 0 || subChapters === chapter.children.length
    }
  }
  const checkChapter = (chapter: any) => {
    let incoherentSubChapterSeen = false
    if (!coherentChapter(chapter)) { incoherentSubChapterSeen = true }
    chapter.children.forEach((child: CourseNavigationItem) => {
      if (child.isChapter && !checkChapter(child)) {
        incoherentSubChapterSeen = true
      }
    })
    return !incoherentSubChapterSeen
  }
  return checkChapter(chapters)
}

/**
 * @description traverse courseChapters, create mapping ids to follow
 * @param chapter chapter array or CourseNavItem
 * @param map resulting mapping
 */
export const chaptersExtractFollow = (chapter: any, map: object) => {
  if (Array.isArray(chapter)) {
    chapter.forEach(child => chaptersExtractFollow(child, map))
  } else if (chapter.isChapter) { // recursively call itself
    chapter.children.forEach((child: any) => {
      chaptersExtractFollow(child, map)
    })
  } else {
    map[chapter.id] = chapter.follow
  }
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
 * @description slugs ending in 'new' and 'edit' can cause routing issues; therefore, avoid them
 * @param title text to be turned to slug
 * @param type type of block for fallback
 */
export const chapterSlugRoutingIssueAvoid = (title: string, type: string): string => {
  const slug = slugify(title)
  const noConflict = slug !== 'edit' && slug !== 'new' // avoid routing issues with edit views
  return noConflict ? slug : slug + '-' + type
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
