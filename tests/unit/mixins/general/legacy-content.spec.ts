import SampleCourse from '../../../mocks/sample-course-short.json'
import { LegacyContentBlock } from '@/mixins/types/course-structure'
import { getNumberBetween1and10 } from '../../../helpers/random-input'
import { legacyContentStepsTransform } from '@/mixins/general/legacy-content'

describe('legacyContentStepsTransform', () => {
  const content = SampleCourse.content
  const mockContentBlock: LegacyContentBlock = {
    name: 'mock',
    input: {
      title: { id: 't1tl3', text: 'mock' }
    },
    nextStep: null
  }
  it('breaks steps into chapters', () => {
    const contentBlock = content[0]
    const chapters: any = legacyContentStepsTransform(contentBlock)
    expect(chapters).toHaveLength(2)
    expect(Array.isArray(chapters)).toBeTruthy()
    chapters.forEach(chapter => expect(typeof chapter === 'number').toBeTruthy())
  })

  it('returns just a number for a single step', () => {
    for (let i = 1; i < content.length; i++) {
      const contentBlock = content[i]
      const chapters: any = legacyContentStepsTransform(contentBlock)
      expect(typeof chapters === 'number').toBeTruthy()
    }
  })

  it('returns null for no next step', () => {
    const chapters: any = legacyContentStepsTransform(mockContentBlock)
    expect(chapters).toBeNull()
  })

  it('returns -1 for next step 0 (i.e. designated last block)', () => {
    const testBlock = { ...mockContentBlock, nextStep: '0' }
    const chapters: any = legacyContentStepsTransform(testBlock)
    expect(chapters).toBe(-1)
  })

  it('return correct output for random input', () => {
    const noOfItems = getNumberBetween1and10() // random number between 1 and 10
    let steps = ''
    const follow = []
    for (let i = 0; i < noOfItems; i++) { // create random string of numbers
      const number = getNumberBetween1and10()
      steps += i === noOfItems - 1 ? `${number}` : `${number},` // add comma if not last number
      follow.push(number - 1) // -1 because of 0-indexing
    }
    mockContentBlock.nextStep = steps // set random string as nextStep
    const followSteps: any = legacyContentStepsTransform(mockContentBlock)
    if (noOfItems > 1) { // if more than one step, expect array
      expect(followSteps).toHaveLength(noOfItems)
      expect(followSteps).toEqual(follow)
    } else { // if only one step, expect number
      expect(followSteps).toBe(follow[0])
    }
  })
})
