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

  const actions = {
    ...courseContent.actions,
    courseFetch: jest.fn(({ commit }, call) => {
      if (call === 'fail') {
        return Promise.reject(new Error('test error'))
      } else {
        commit('courseStructureDestructure', SampleCourseChapters)
        Promise.resolve(SampleCourseChapters)
      }
    })
  }
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
      await expect(postSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
      await actions.courseContentPersist({ commit }, 'put', block)
      await expect(putSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
      await actions.courseContentPersist({ commit }, 'delete', block)
      await expect(deleteSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
      await actions.courseContentPersist({ commit }, 'patch', block)
      await expect(patchSpy).toHaveBeenCalledWith(`course-content/${block.id}`, block)
    })

    it('should reject with error when using GET', async () => {
      await expect(
        actions.courseContentPersist({ commit }, 'get', SampleCourseChaptersContent['zw31'])
      ).rejects.toThrow('Cannot use GET verb for course content persist')
    })
  })
  describe('courseFetch', () => {
    it('gets course from back end', async () => {
      await actions.courseFetch({ commit }, 'sample-course')
      expect(commit).toHaveBeenCalledWith('courseStructureDestructure', SampleCourseChapters)
    })

    it('calls courseContentSet with correct payload', async () => {
      await actions.courseContentFetch({ commit }, 'e1ns')
      expect(commit).toHaveBeenCalledWith('courseContentSet', SampleCourseChaptersContent.e1ns)
    })

    it('rejects with error', async () => {
      await expect(actions.courseFetch({ commit }, 'fail')).rejects.toThrow('test error')
    })
  })
})
