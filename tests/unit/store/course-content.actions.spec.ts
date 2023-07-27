import courseContent from '@/store/modules/course-content'
import SampleCourseChaptersContent from '../../mocks/sample-course-chapters-content.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import axios from 'axios'
import 'regenerator-runtime/runtime'

describe('course-content store module actions', () => {
  // mock promises for GET requests
  jest.spyOn(axios, 'get').mockImplementation((url: string) => {
    if (/course-content\/[a-z0-9-]+/.test(url)) {
      const id = url.split('/').pop()
      return Object.prototype.hasOwnProperty.call(SampleCourseChaptersContent, id)
        ? Promise.resolve({ data: SampleCourseChaptersContent[id] })
        : Promise.reject(new Error('not found'))
    } else if (url.includes('courses/')) {
      if (url.includes('fail')) {
        return Promise.reject(new Error('test error'))
      }
      return Promise.resolve({ data: SampleCourseChapters })
    } else {
      return Promise.reject(new Error('not found'))
    }
  })

  const { actions } = courseContent
  const commit = jest.fn()

  describe('courseContentFetch', () => {
    it('should call courseContentSet mutation', async () => {
      await actions.courseContentFetch({ commit }, 'zw31')
      expect(commit).toHaveBeenCalledWith('courseContentSet', SampleCourseChaptersContent['zw31'])
    })

    it('should reject with error', async () => {
      await expect(actions.courseContentFetch({ commit }, 'fail')).rejects.toThrow('not found')
    })
  })
  describe('courseContentPersist', () => {
    describe('resolved promise', () => {
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValue('ok')
      const putSpy = jest.spyOn(axios, 'put').mockResolvedValue('ok')
      const deleteSpy = jest.spyOn(axios, 'delete').mockResolvedValue('ok')
      const patchSpy = jest.spyOn(axios, 'patch').mockResolvedValue('ok')

      it('call setBusy commit twice', async () => {
        await actions.courseContentPersist({ commit }, 'post', SampleCourseChaptersContent['zw31'])
        expect(commit).toHaveBeenCalledWith('setBusy', true)
        expect(commit).toHaveBeenLastCalledWith('setBusy', false)
      })
      it('should call the correct methods', async () => {
        const block = SampleCourseChaptersContent.zw31
        await actions.courseContentPersist({ commit }, 'post', block)
        expect(postSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
        await actions.courseContentPersist({ commit }, 'put', block)
        expect(putSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
        await actions.courseContentPersist({ commit }, 'delete', block)
        expect(deleteSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
        await actions.courseContentPersist({ commit }, 'patch', block)
        expect(patchSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
      })

      it('should reject with error when using GET', async () => {
        await expect(
          actions.courseContentPersist({ commit }, 'get', SampleCourseChaptersContent['zw31'])
        ).rejects.toThrow('Cannot use GET verb for course content persist')
      })
    })

    describe('rejected promise', () => {
      it('should return a rejected promise', async () => {
        jest.spyOn(axios, 'post').mockRejectedValue(new Error('test error'))
        await expect(actions.courseContentPersist({ commit }, 'post', SampleCourseChaptersContent['zw31'])).rejects.toThrow('test error')
      })
    })
  })
})
