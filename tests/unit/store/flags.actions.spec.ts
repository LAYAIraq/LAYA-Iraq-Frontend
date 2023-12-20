import flags from '@/store/modules/flags'
import SampleCourseChaptersIntermediate from '../../mocks/sample-course-chapters-intermediate.json'
import 'regenerator-runtime/runtime'

describe('flag actions', () => {
  let state
  let getters
  let commit
  const actions = flags.actions
  describe('courseFlagsCheck', () => {
    beforeAll(() => {
      state = {
        courseContent: SampleCourseChaptersIntermediate.courseContent,
        courseFlags: []
      }
      getters = {
        courseContent: state.courseContent
      }
      commit = jest.fn()
    })
    beforeEach(() => {
      state.courseFlags = [] // make sure flags are empty for each test case
    })
    it('does nothing when no flags exist', () => {
      actions.courseFlagsCheck({ commit, getters, state })
      expect(commit).not.toHaveBeenCalled()
    })
    it('sets "flagged" boolean when flag exists', () => {
      state.courseFlags.push({
        referenceId: 'ref01'
      })
      actions.courseFlagsCheck({ commit, getters, state })
      expect(commit).toHaveBeenCalledWith('flagFlaggableElement', expect.objectContaining({
        text: 'Dialog Sample'
      }))
    })
    it('sets "flagged" boolean when flag exists and element is already flagged', () => {
      state.courseContent.zw31.title.flagged = true
      state.courseFlags.push({
        referenceId: 'ref02'
      })
      actions.courseFlagsCheck({ commit, getters, state })
      expect(commit).toHaveBeenCalledWith('flagFlaggableElement', expect.objectContaining({
        text: 'Video'
      }))
    })
    it('checks all properties in content block', () => {
      state.courseFlags.push({ referenceId: 'ref04' })
      state.courseFlags.push({ referenceId: 'ref06' })
      actions.courseFlagsCheck({ commit, getters, state })
      expect(commit).toHaveBeenCalledWith('flagFlaggableElement', expect.objectContaining({
        text: 'SC Quiz'
      }))
      expect(commit).toHaveBeenCalledWith('flagFlaggableElement', expect.objectContaining({
        text: 'Please verify!'
      }))
    })
  })
})
