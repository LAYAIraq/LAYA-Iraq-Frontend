import courseContent from '@/store/modules/course-content'
import SampleCourseChaptersContent from '../../mocks/sample-course-chapters-content.json'
import SampleCourseChapters from '../../mocks/sample-course-chapters.json'
import axios from 'axios'
import 'regenerator-runtime/runtime'

describe('course-content store module actions', () => {
  jest.spyOn(axios, 'get').mockImplementation((url: string) => {
    if (/course-content\/[a-z0-9-]+/.test(url)) {
      const id = url.split('/').pop()
      return Promise.resolve({ data: SampleCourseChaptersContent[id] })
    } else if (url.includes('courses/')) {
      return Promise.resolve({ data: SampleCourseChapters })
    } else {
      return Promise.reject(new Error('not found'))
    }
  })

  const actions = courseContent.actions
  const commit = jest.fn()

  it('fetchNewCourse gets course from back end', async () => {
    const resp: any = await actions.courseFetch({ commit }, 'test-course')
    expect(resp).toBeTruthy()
    expect(resp.data).toStrictEqual(SampleCourseChapters)
    expect(commit).toHaveBeenCalled()
  })

  it('courseContentFetch calls courseContentSet', async () => {
    const content: any = await actions.courseContentFetch({ commit }, 'e1ns')
    expect(content).toBeTruthy()
    expect(content.data).toStrictEqual(SampleCourseChaptersContent.e1ns)
    expect(commit).toHaveBeenCalledWith('courseContentSet', SampleCourseChaptersContent.e1ns)
  })
})
