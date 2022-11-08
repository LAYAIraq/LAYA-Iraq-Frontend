/**
 * @fileOverview course-structure.ts - outline of the content structure as TypeScript interface
 * @author cmc
 * @since 1.3.0
 */

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

/***************************************************
 ********** types for new course navigation ********
 ***************************************************/
type FollowingContent = string | number | string[] | number[] | null
export type ContentInput = {
  id: string,
  name: string,
  follow?: FollowingContent,
  [key: string]: any
}

type CourseNavigationChapter = { [id: string]: CourseNavigationChapter | ContentInput[] | ContentInput }
type CourseNavigationItem = CourseNavigationChapter | ContentInput[]

export type CourseNavigation = {
  start: string | number,
  chapters: CourseNavigationItem
  follow?: Set<string>
}
