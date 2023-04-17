/**
 * Filename: course-navigation.ts
 * Use: Course navigation types
 * Author: cmc
 * Since: 1.3.0
 */
export type DraggableCourseChapter = {
  isChapter: boolean,
  chapterName?: string,
  children?: DraggableCourseChapter[]
  id?: string
}
