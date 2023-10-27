import { deepCopy } from '@/mixins/general/helpers'
import { chapterFollowSet, chapterSlugDuplicateAvoid, chapterSlugUpdate } from '@/mixins/general/course-chapters'
import SampleCourseChapters from '../../../mocks/sample-course-chapters.json'
import SampleCourseChaptersNested from '../../../mocks/sample-course-chapters-nested.json'

describe('course chapters mixin', () => {
  describe('chapterFollowSet', () => {
    let courseChapters: any
    const linearChapters = {
      isChapter: true,
      children: [
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: ['zw31', 'dr31'] },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'fu3nf' },
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: null }
      ]
    }
    beforeEach(() => {
      courseChapters = deepCopy(linearChapters)
    })

    it('sets follow property for all chapters', () => {
      courseChapters.children.forEach((chapter: any) => { chapter.follow = null })
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: null },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'fu3nf' },
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: null }
      ])
    })

    it('sets follow correctly when order is reversed', () => {
      courseChapters.children.reverse()
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        { id: 'fu3nf', isChapter: false, slug: 'drag-drop-sample', follow: 'v13r' },
        { id: 'v13r', isChapter: false, slug: 'multiple-choice-test', follow: 'dr31' },
        { id: 'dr31', isChapter: false, slug: 'wysiwyg', follow: 'zw31' },
        { id: 'zw31', isChapter: false, slug: 'video', follow: 'e1n5' },
        { id: 'e1n5', isChapter: false, slug: 'dialog-sample', type: 'button-navigation', follow: ['zw31', 'dr31'] }
      ])
    })

    it('sets follow correctly in nested chapters', () => {
      courseChapters = {
        isChapter: true,
        children: [
          {
            id: 'b',
            isChapter: true,
            children: [
              { id: 'e', isChapter: false },
              { id: 'f', isChapter: false }
            ]
          },
          { id: 'c', isChapter: false },
          { id: 'd', isChapter: false }
        ]
      }
      chapterFollowSet(courseChapters, null)
      expect(courseChapters.children).toStrictEqual([
        {
          id: 'b',
          isChapter: true,
          children: [
            { id: 'e', isChapter: false, follow: 'f' },
            { id: 'f', isChapter: false, follow: 'c' }
          ]
        },
        { id: 'c', isChapter: false, follow: 'd' },
        { id: 'd', isChapter: false, follow: null }
      ])
    })
  })

  describe('chapterSlugDuplicateAvoid', () => {
    let nav: any
    const dummyBlock = {
      isChapter: false,
      slug: 'test'
    }
    it('detects duplicate slugs in flat navigation and corrects them', () => {
      nav = [deepCopy(dummyBlock), deepCopy(dummyBlock)]
      chapterSlugDuplicateAvoid(nav)
      expect(nav[1].slug).not.toBe(nav[0].slug)
      expect(nav[1].slug).toBe('test-2')
    })

    it('detects duplicate slugs in flat navigation and corrects with ascending index', () => {
      nav = [deepCopy(dummyBlock), deepCopy(dummyBlock), deepCopy(dummyBlock), deepCopy(dummyBlock)]
      chapterSlugDuplicateAvoid(nav)
      expect(nav[1].slug).not.toBe(nav[0].slug)
      expect(nav[1].slug).toBe('test-2')
      expect(nav[2].slug).toBe('test-3')
      expect(nav[3].slug).toBe('test-4')
    })

    it('detects multiple duplicates in a flat navigation', () => {
      const dummyBlock2 = { isChapter: false, slug: 'something-else' }
      nav = [deepCopy(dummyBlock), deepCopy(dummyBlock2), deepCopy(dummyBlock), deepCopy(dummyBlock2)]
      chapterSlugDuplicateAvoid(nav)
      expect(nav[2].slug).not.toBe(nav[0].slug)
      expect(nav[2].slug).toBe('test-2')
      expect(nav[1].slug).not.toBe(nav[3].slug)
      expect(nav[3].slug).toBe('something-else-2')
    })

    it('detects duplicates in nested navigation', () => {
      const navChapter = [deepCopy(dummyBlock), deepCopy(dummyBlock)]
      nav = [
        { isChapter: true, children: deepCopy(navChapter) },
        { isChapter: true, children: deepCopy(navChapter) }
      ]
      chapterSlugDuplicateAvoid(nav)
      expect(nav[0].children[1].slug).not.toBe(nav[0].children[0].slug)
      expect(nav[0].children[1].slug).toBe('test-2')
      expect(nav[1].children[1].slug).not.toBe(nav[1].children[0].slug)
      expect(nav[1].children[1].slug).toBe('test-2')
    })
  })

  describe('chapterSlugUpdate', () => {
    let chapters: any[]
    it('updates slug in top level content', () => {
      chapters = SampleCourseChapters.chapters
      chapterSlugUpdate(chapters, 'e1ns', 'New Title', 'dialog')
      expect(chapters[0].children[0].slug).toBe('new-title')
    })
    it('updates slug in nested level content', () => {
      chapters = SampleCourseChaptersNested.chapters
      chapterSlugUpdate(chapters, 'v13r', 'New Title', 'test')
      expect(chapters[0].children[0].children[0].children[0].children[0].slug).toBe('new-title')
    })
    it('does nothing when chapters are empty', () => {
      chapters = []
      chapterSlugUpdate(chapters, 'test', 'Test', 'test')
      expect(chapters).toStrictEqual([])
    })
  })
})
