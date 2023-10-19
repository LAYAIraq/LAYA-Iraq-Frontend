import courseEdit from '@/store/modules/course-edit'
import SampleCourseChaptersIntermediate from '../../mocks/sample-course-chapters-intermediate.json'
import SampleCourseShort from '../../mocks/sample-course-short.json'
import axios from 'axios'
import 'regenerator-runtime/runtime'

describe('course-edit actions', () => {
  describe('courseUpdate', () => {
    const actions = courseEdit.actions
    const state = { course: SampleCourseShort }
    const rootState = {
      courseChapters: SampleCourseChaptersIntermediate.chapters,
      courseContent: SampleCourseChaptersIntermediate.courseContent
    }
    const commit = jest.fn()
    const patchSpy = jest.spyOn(axios, 'patch').mockResolvedValue('Course updated successfully')
    it('should be calling all commits and resolve', async () => {
      const res = await actions.courseUpdate({ commit, state, rootState })
      expect(patchSpy).toHaveBeenCalledWith('courses/t3stkur5', expect.objectContaining({
        courseContent: SampleCourseChaptersIntermediate.courseContent,
        chapters: SampleCourseChaptersIntermediate.chapters
      }))

      expect(commit).toHaveBeenCalledWith('courseSimpleLanguageCheck')
      expect(commit).toHaveBeenCalledWith('coursePropertyCheck')
      expect(commit).toHaveBeenCalledWith('courseUpdatedSet', false)
      expect(res).toBe('Course updated successfully')
    })
  })
})
